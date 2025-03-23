import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { useAudio } from '@/lib/stores/useAudio';
import type { AvatarConfig } from '@shared/types';

interface AvatarProps {
  position: [number, number, number];
  rotation: [number, number, number];
  config?: AvatarConfig;
  isCurrentUser?: boolean;
  username?: string;
  color?: string;
}

export function Avatar({ 
  position, 
  rotation, 
  config, 
  isCurrentUser = false,
  username = '',
  color = '#ff5555'
}: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const hairRef = useRef<THREE.Mesh>(null);
  
  // Animation values
  const walkCycle = useRef(0);
  const isWalking = useRef(false);
  const lastPosition = useRef(new THREE.Vector3(...position));
  
  // Default avatar colors
  const skinTone = config?.skinTone || '#ffdbac';
  const hairColor = config?.hairColor || '#3d2314';
  const outfitColor = color;
  
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    // Check if the avatar is moving
    const currentPosition = new THREE.Vector3(...position);
    const distance = lastPosition.current.distanceTo(currentPosition);
    isWalking.current = distance > 0.01;
    
    if (isWalking.current) {
      // Update the walk cycle
      walkCycle.current += delta * 5;
      
      // Animate legs and arms while walking
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(walkCycle.current) * 0.4;
        rightLegRef.current.rotation.x = Math.sin(walkCycle.current + Math.PI) * 0.4;
      }
      
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(walkCycle.current + Math.PI) * 0.3;
        rightArmRef.current.rotation.x = Math.sin(walkCycle.current) * 0.3;
      }
    } else {
      // Reset animations when standing still
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
      
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = 0;
        rightArmRef.current.rotation.x = 0;
      }
    }
    
    // Update position and rotation
    groupRef.current.position.set(...position);
    groupRef.current.rotation.set(...rotation);
    
    // Store current position for next frame
    lastPosition.current.copy(currentPosition);
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Base / Feet - a bit darker than the outfit color */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color={new THREE.Color(outfitColor).multiplyScalar(0.7).getStyle()} />
      </mesh>
      
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.2]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>
      
      {/* Hair - style based on config */}
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
      
      {/* Left Arm */}
      <mesh 
        ref={leftArmRef} 
        position={[0.3, 1, 0]} 
        castShadow
      >
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      
      {/* Right Arm */}
      <mesh 
        ref={rightArmRef} 
        position={[-0.3, 1, 0]} 
        castShadow
      >
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      
      {/* Left Leg */}
      <mesh 
        ref={leftLegRef} 
        position={[0.15, 0.4, 0]} 
        castShadow
      >
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      
      {/* Right Leg */}
      <mesh 
        ref={rightLegRef} 
        position={[-0.15, 0.4, 0]} 
        castShadow
      >
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color={outfitColor} />
      </mesh>
      
      {/* Username label */}
      {username && (
        <group position={[0, 1.8, 0]}>
          <mesh>
            <planeGeometry args={[1, 0.3]} />
            <meshBasicMaterial 
              color="#111122" 
              transparent 
              opacity={0.7}
            />
          </mesh>
          <Username 
            text={username}
            color="#ffffff"
            fontSize={0.15}
            position={[0, 0, 0.01]}
          />
        </group>
      )}
      
      {/* Indicator for current user */}
      {isCurrentUser && (
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#44ff44" emissive="#44ff44" emissiveIntensity={0.5} />
        </mesh>
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
  const [textObj] = useState(() => new Text());
  const { camera } = useThree();
  
  // Setup text properties
  useLayoutEffect(() => {
    textObj.text = text;
    textObj.fontSize = fontSize;
    textObj.color = color;
    textObj.anchorX = 'center';
    textObj.anchorY = 'middle';
    textObj.position.set(position[0], position[1], position[2]);
    textObj.material.depthTest = false;
    textObj.strokeColor = '#000000';
    textObj.strokeWidth = 0.01;
    textObj.sync();
  }, [textObj, text, color, fontSize, position]);

  // Make text always face the camera
  useFrame(() => {
    if (textObj && camera) {
      textObj.quaternion.copy(camera.quaternion);
    }
  });

  return <primitive object={textObj} />;
}
