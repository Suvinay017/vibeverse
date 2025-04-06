// Avatar.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from 'troika-three-text';
import type { AvatarConfig } from '@shared/types';

interface AvatarProps {
  position: [number, number, number];
  rotation: [number, number, number];
  config?: AvatarConfig;
  isCurrentUser?: boolean;
  username?: string;
  color?: string;
  message?: string; // ✅ NEW
}

export function Avatar({ 
  position, 
  rotation, 
  config, 
  isCurrentUser = false,
  username = '',
  color = '#ff5555',
  message // ✅ NEW
}: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const hairRef = useRef<THREE.Mesh>(null);

  const walkCycle = useRef(0);
  const lastPosition = useRef(new THREE.Vector3(...position));
  const currentPosition = useRef(new THREE.Vector3(...position));

  const skinTone = config?.skinTone || '#ffdbac';
  const hairColor = config?.hairColor || '#3d2314';
  const outfitColor = color;

  const { camera } = useThree();
  const chatRef = useRef<THREE.Group>(null);

  useEffect(() => {
    console.log(`Avatar created/updated: ${username}, position: [${position.join(', ')}], isCurrentUser: ${isCurrentUser}`);
  }, [username, position, isCurrentUser]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    currentPosition.current.set(...position);
    const movedDistance = currentPosition.current.distanceTo(lastPosition.current);
    const isWalking = movedDistance > 0.001;

    if (isWalking) {
      walkCycle.current += delta * 5;
      leftLegRef.current!.rotation.x = Math.sin(walkCycle.current) * 0.4;
      rightLegRef.current!.rotation.x = Math.sin(walkCycle.current + Math.PI) * 0.4;
      leftArmRef.current!.rotation.x = Math.sin(walkCycle.current + Math.PI) * 0.3;
      rightArmRef.current!.rotation.x = Math.sin(walkCycle.current) * 0.3;
    } else {
      leftLegRef.current!.rotation.x = 0;
      rightLegRef.current!.rotation.x = 0;
      leftArmRef.current!.rotation.x = 0;
      rightArmRef.current!.rotation.x = 0;
    }

    groupRef.current.position.set(...position);
    groupRef.current.rotation.set(0, rotation[1], 0);
    lastPosition.current.copy(currentPosition.current);

    // Make chat face the camera
    if (chatRef.current) {
      chatRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Avatar Mesh */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color={new THREE.Color(outfitColor).multiplyScalar(0.7).getStyle()} />
      </mesh>

      <mesh ref={bodyRef} position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.2]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>

      <mesh ref={headRef} position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>

      <mesh ref={hairRef} position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[0.33, 0.1, 0.33]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.08, 1.4, 0.16]} castShadow>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.08, 1.4, 0.16]} castShadow>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[0.3, 1, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      <mesh ref={rightArmRef} position={[-0.3, 1, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[0.15, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      <mesh ref={rightLegRef} position={[-0.15, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>

      {/* Username Label */}
      {username && (
        <group position={[0, 1.8, 0]}>
          <mesh>
            <planeGeometry args={[1, 0.3]} />
            <meshBasicMaterial color="#111122" transparent opacity={0.7} />
          </mesh>
          <Username
            text={username}
            color="#ffffff"
            fontSize={0.15}
            position={[0, 0, 0.01]}
          />
        </group>
      )}

      {/* Current User Indicator */}
      {isCurrentUser && (
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#44ff44" emissive="#44ff44" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* Chat Message */}
      {message && (
        <group ref={chatRef} position={[0, 2.5, 0]}>
          <Text
            text={message}
            fontSize={0.18}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineColor="#000000"
            outlineWidth={0.01}
          />
        </group>
      )}
    </group>
  );
}

interface UsernameProps {
  text: string;
  color: string;
  fontSize: number;
  position: [number, number, number];
}

function Username({ text, color, fontSize, position }: UsernameProps) {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [textObj] = useState(() => {
    const obj = new Text();
    obj.text = text;
    obj.fontSize = fontSize;
    obj.color = color;
    obj.anchorX = 'center';
    obj.anchorY = 'middle';
    obj.material.depthTest = false;
    obj.strokeColor = '#000000';
    obj.strokeWidth = 0.01;
    return obj;
  });

  useEffect(() => {
    textObj.text = text;
    textObj.fontSize = fontSize;
    textObj.color = color;
    textObj.sync();
  }, [textObj, text, color, fontSize]);

  useFrame(() => {
    if (ref.current && camera) {
      ref.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group ref={ref} position={position}>
      <primitive object={textObj} />
    </group>
  );
}
