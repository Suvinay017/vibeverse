// src/components/three/Scene.tsx
import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  KeyboardControls,
  Sky,
  useKeyboardControls,
} from "@react-three/drei";
import * as THREE from "three";
import { Lighting } from "./Lighting";
import { Cafe } from "./Environments/Cafe";
import { Street } from "./Environments/Street";
import { AbandonedPlace } from "./Environments/AbandonedPlace";
import { Avatar } from "./Avatar/Avatar";
import { useEnvironment } from "@/lib/stores/useEnvironment";
import { useAudio } from "@/lib/stores/useAudio";
import type { User } from "@shared/types";

const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "sprint", keys: ["ShiftLeft", "ShiftRight"] },
  { name: "interact", keys: ["KeyE"] },
];

interface SceneProps {
  environmentId?: string;
  participants?: User[];
  currentUser?: User;
}

export function Scene({
  environmentId = "cafe",
  participants = [],
  currentUser,
}: SceneProps) {
  const {
    environments,
    currentEnvironment,
    selectEnvironment,
    userPosition,
    userRotation,
    updateUserPosition,
    updateUserRotation,
  } = useEnvironment();

  useEffect(() => {
    selectEnvironment(environmentId);
  }, [environmentId, selectEnvironment]);

  const getRandomColor = (userId: number) => {
    const colors = [
      "#FF5555", "#55FF55", "#5555FF", "#FFAA55",
      "#55FFAA", "#AA55FF", "#FF55AA", "#AAFF55", "#55AAFF",
    ];
    return colors[userId % colors.length];
  };

  const fixedParticipants = useMemo(() => {
    return participants.map((participant) => ({
      ...participant,
      position: [Math.random() * 6 - 3, 0, Math.random() * 6 - 3] as [number, number, number],
      rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
    }));
  }, [participants]);

  return (
    <div className="w-full h-full">
      <KeyboardControls map={controls}>
        <Canvas shadows gl={{ antialias: true }} linear>
          <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} />
          <fog attach="fog" args={["#000020", 10, 50]} />

          <Suspense fallback={null}>
            <Lighting environmentType={currentEnvironment?.type} />

            <Sky
              distance={450000}
              sunPosition={[0, 1, 0]}
              inclination={0.49}
              azimuth={0.25}
              rayleigh={1}
              turbidity={10}
              mieCoefficient={0.005}
              mieDirectionalG={0.8}
            />

            {currentEnvironment?.type === "cafe" && (
              <Cafe environment={currentEnvironment} />
            )}
            {currentEnvironment?.type === "street" && (
              <Street environment={currentEnvironment} />
            )}
            {currentEnvironment?.type === "abandoned" && (
              <AbandonedPlace environment={currentEnvironment} />
            )}

            <PlayerController
              updatePosition={updateUserPosition}
              updateRotation={updateUserRotation}
              currentUser={currentUser}
            />

            {fixedParticipants.map((participant) => (
              <Avatar
                key={participant.id}
                position={participant.position}
                rotation={participant.rotation}
                config={participant.avatarConfig}
                username={participant.username}
                color={getRandomColor(participant.id)}
              />
            ))}
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

interface PlayerControllerProps {
  updatePosition: (position: [number, number, number]) => void;
  updateRotation: (rotation: [number, number, number]) => void;
  currentUser?: User;
}

function PlayerController({
  updatePosition,
  updateRotation,
  currentUser,
}: PlayerControllerProps) {
  const { camera, gl } = useThree();
  const playerRef = useRef<THREE.Group>(null);
  const direction = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const isGrounded = useRef(true);
  const gravity = -9.81;
  const jumpStrength = 6;

  const orbitAngle = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  const [_, getKeys] = useKeyboardControls();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - previousMouse.current.x;
      const dy = e.clientY - previousMouse.current.y;
      previousMouse.current = { x: e.clientX, y: e.clientY };
      orbitAngle.current.x -= dy * 0.002;
      orbitAngle.current.y -= dx * 0.002;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [gl.domElement]);

  useFrame((_, delta) => {
    const keys = getKeys();
    const isJumping = keys.jump;
    const isSprinting = keys.sprint;

    const walkSpeed = 5;
    const sprintSpeed = 10;
    const moveSpeed = isSprinting ? sprintSpeed : walkSpeed;
    const rotSpeed = 5;

    const forward = new THREE.Vector3(
      Math.sin(orbitAngle.current.y),
      0,
      Math.cos(orbitAngle.current.y)
    );
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));

    direction.current.set(0, 0, 0);
    if (keys.forward) direction.current.sub(forward);
    if (keys.backward) direction.current.add(forward);
    if (keys.leftward) direction.current.add(right);
    if (keys.rightward) direction.current.sub(right);

    direction.current.normalize();

    const player = playerRef.current;
    if (player) {
      // Movement
      const horizontal = direction.current.clone().multiplyScalar(moveSpeed * delta);
      player.position.add(horizontal);

      if (direction.current.length() > 0) {
        const angle = Math.atan2(direction.current.x, direction.current.z);
        player.rotation.y = THREE.MathUtils.lerp(
          player.rotation.y,
          angle,
          delta * rotSpeed
        );
      }

      // Jump
      if (isJumping && isGrounded.current) {
        velocity.current.y = jumpStrength;
        isGrounded.current = false;
      }

      // Gravity
      velocity.current.y += gravity * delta;
      player.position.y += velocity.current.y * delta;

      // Ground check
      if (player.position.y <= 0) {
        player.position.y = 0;
        velocity.current.y = 0;
        isGrounded.current = true;
      }

      // Camera follow
      const offset = new THREE.Vector3(0, 2, 6);
      const quat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(orbitAngle.current.x, orbitAngle.current.y, 0)
      );
      const rotatedOffset = offset.clone().applyQuaternion(quat);

      const cameraTarget = player.position.clone();
      const finalCameraPos = cameraTarget.clone().add(rotatedOffset);
      camera.position.lerp(finalCameraPos, 0.1);
      camera.lookAt(cameraTarget);

      // Update state
      updatePosition([player.position.x, player.position.y, player.position.z]);
      updateRotation([player.rotation.x, player.rotation.y, player.rotation.z]);
    }
  });

  return (
    <group ref={playerRef}>
      {currentUser && (
        <Avatar
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          config={currentUser.avatarConfig}
          isCurrentUser={true}
          username={currentUser.username}
        />
      )}
    </group>
  );
}
