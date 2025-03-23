import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  PerspectiveCamera, 
  KeyboardControls,
  Sky,
  PointerLockControls
} from "@react-three/drei";
import * as THREE from "three";
import { Lighting } from "./Lighting";
import { Cafe } from "./Environments/Cafe";
import { Street } from "./Environments/Street";
import { AbandonedPlace } from "./Environments/AbandonedPlace";
import { Avatar } from "./Avatar/Avatar";
import { useEnvironment, type Environment } from "@/lib/stores/useEnvironment";
import { useAudio } from "@/lib/stores/useAudio";
import type { User } from "@shared/types";

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "interact", keys: ["KeyE"] },
];

interface SceneProps {
  environmentId?: string;
  participants?: User[];
  currentUser?: User;
}

export function Scene({ environmentId = "cafe", participants = [], currentUser }: SceneProps) {
  const { environments, currentEnvironment, selectEnvironment, userPosition, userRotation, updateUserPosition, updateUserRotation } = useEnvironment();
  
  // Initialize the environment
  useEffect(() => {
    selectEnvironment(environmentId);
  }, [environmentId, selectEnvironment]);

  const getRandomColor = (userId: number) => {
    // Generate a deterministic color based on user ID
    const colors = [
      "#FF5555", "#55FF55", "#5555FF", 
      "#FFAA55", "#55FFAA", "#AA55FF",
      "#FF55AA", "#AAFF55", "#55AAFF"
    ];
    return colors[userId % colors.length];
  };

  return (
    <div className="w-full h-full">
      <KeyboardControls map={controls}>
        <Canvas shadows gl={{ antialias: true }} linear>
          <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={60} />
          
          <fog attach="fog" args={["#000020", 10, 50]} />
          
          <Suspense fallback={null}>
            {/* Lighting */}
            <Lighting environmentType={currentEnvironment?.type} />
            
            {/* Sky */}
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
            
            {/* Current environment */}
            {currentEnvironment?.type === "cafe" && (
              <Cafe environment={currentEnvironment} />
            )}
            {currentEnvironment?.type === "street" && (
              <Street environment={currentEnvironment} />
            )}
            {currentEnvironment?.type === "abandoned" && (
              <AbandonedPlace environment={currentEnvironment} />
            )}
            
            {/* User Avatar */}
            {currentUser && (
              <Avatar 
                position={userPosition} 
                rotation={userRotation}
                config={currentUser.avatarConfig}
                isCurrentUser={true}
                username={currentUser.username}
              />
            )}
            
            {/* Other participants */}
            {participants.map((participant) => (
              <Avatar 
                key={participant.id}
                position={[
                  Math.random() * 6 - 3, 
                  1, 
                  Math.random() * 6 - 3
                ]} 
                rotation={[0, Math.random() * Math.PI * 2, 0]}
                config={participant.avatarConfig}
                username={participant.username}
                color={getRandomColor(participant.id)}
              />
            ))}
          </Suspense>
          
          {/* Controls */}
          <PlayerController updatePosition={updateUserPosition} updateRotation={updateUserRotation} />
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

interface PlayerControllerProps {
  updatePosition: (position: [number, number, number]) => void;
  updateRotation: (rotation: [number, number, number]) => void;
}

function PlayerController({ updatePosition, updateRotation }: PlayerControllerProps) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const velocity = useRef<THREE.Vector3>(new THREE.Vector3());
  const direction = useRef<THREE.Vector3>(new THREE.Vector3());
  const { playHit } = useAudio();
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(!!document.pointerLockElement);
    };

    document.addEventListener('pointerlockchange', handleLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handleLockChange);
    };
  }, []);

  useFrame((state, delta) => {
    if (!isLocked || !controls.current) return;
    
    // Get keyboard state
    const keyboard = state.controls as any;
    if (!keyboard) return;
    
    // Calculate movement direction
    const forward = keyboard.forward ? 1 : 0;
    const backward = keyboard.backward ? 1 : 0;
    const left = keyboard.leftward ? 1 : 0;
    const right = keyboard.rightward ? 1 : 0;
    
    // Direction vector
    direction.current.z = forward - backward;
    direction.current.x = left - right;
    direction.current.normalize();
    
    // Calculate velocity based on direction
    const moveSpeed = 5;
    velocity.current.z = direction.current.z * moveSpeed * delta;
    velocity.current.x = direction.current.x * moveSpeed * delta;
    
    // Move the camera
    controls.current.moveForward(-velocity.current.z);
    controls.current.moveRight(-velocity.current.x);
    
    // Update position and rotation in the store
    const position: [number, number, number] = [
      camera.position.x,
      camera.position.y,
      camera.position.z
    ];
    
    const rotation: [number, number, number] = [
      camera.rotation.x,
      camera.rotation.y,
      camera.rotation.z
    ];
    
    updatePosition(position);
    updateRotation(rotation);
  });

  return (
    <PointerLockControls ref={controls} onLock={() => {
      console.log("Controls locked");
      playHit();
    }} />
  );
}
