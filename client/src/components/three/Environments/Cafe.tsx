import React, { useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Environment } from '@/lib/stores/useEnvironment';

interface CafeProps {
  environment: Environment;
}

export function Cafe({ environment }: CafeProps) {
  // Textures
  const woodTexture = useTexture('/textures/wood.jpg');
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(4, 4);
  
  // Floor
  const floor = environment.objects.find(obj => obj.id === 'floor');
  const floorRef = useRef<THREE.Mesh>(null);
  
  // Set up refs for objects
  const tableRefs = useRef<(THREE.Group | null)[]>([]);
  const chairRefs = useRef<(THREE.Group | null)[]>([]);
  const plantRefs = useRef<(THREE.Group | null)[]>([]);
  const lightRefs = useRef<(THREE.PointLight | null)[]>([]);
  const counterRef = useRef<THREE.Group | null>(null);
  
  const tables = environment.objects.filter(obj => obj.type === 'table');
  const chairs = environment.objects.filter(obj => obj.type === 'chair');
  const plants = environment.objects.filter(obj => obj.type === 'plant');
  const lights = environment.objects.filter(obj => obj.type === 'light');
  const counter = environment.objects.find(obj => obj.type === 'counter');

  return (
    <group>
      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      
      {/* Floor */}
      {floor && (
        <mesh 
          ref={floorRef}
          position={new THREE.Vector3(...floor.position)}
          scale={floor.scale ? new THREE.Vector3(...floor.scale) : new THREE.Vector3(1, 1, 1)}
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={woodTexture} color="#886622" />
        </mesh>
      )}
      
      {/* Tables */}
      {tables.map((table, index) => (
        <group
          key={table.id}
          ref={el => tableRefs.current[index] = el}
          position={new THREE.Vector3(...table.position)}
          rotation={table.rotation ? new THREE.Euler(...table.rotation) : undefined}
          scale={table.scale ? new THREE.Vector3(...table.scale) : new THREE.Vector3(1, 1, 1)}
        >
          {/* Table top */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.1, 1.5]} />
            <meshStandardMaterial map={woodTexture} color="#704214" />
          </mesh>
          
          {/* Table legs */}
          {[[-0.6, -0.5, -0.6], [-0.6, -0.5, 0.6], [0.6, -0.5, -0.6], [0.6, -0.5, 0.6]].map((pos, i) => (
            <mesh key={i} position={new THREE.Vector3(...pos)} castShadow>
              <boxGeometry args={[0.1, 1, 0.1]} />
              <meshStandardMaterial map={woodTexture} color="#5D3A1A" />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Chairs */}
      {chairs.map((chair, index) => (
        <group
          key={chair.id}
          ref={el => chairRefs.current[index] = el}
          position={new THREE.Vector3(...chair.position)}
          rotation={chair.rotation ? new THREE.Euler(...chair.rotation) : undefined}
          scale={chair.scale ? new THREE.Vector3(...chair.scale) : new THREE.Vector3(1, 1, 1)}
        >
          {/* Chair seat */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.6, 0.1, 0.6]} />
            <meshStandardMaterial map={woodTexture} color="#8B5A2B" />
          </mesh>
          
          {/* Chair back */}
          <mesh position={[0, 0.5, -0.3]} castShadow>
            <boxGeometry args={[0.6, 1, 0.05]} />
            <meshStandardMaterial map={woodTexture} color="#8B5A2B" />
          </mesh>
          
          {/* Chair legs */}
          {[[-0.25, -0.5, -0.25], [-0.25, -0.5, 0.25], [0.25, -0.5, -0.25], [0.25, -0.5, 0.25]].map((pos, i) => (
            <mesh key={i} position={new THREE.Vector3(...pos)} castShadow>
              <boxGeometry args={[0.05, 1, 0.05]} />
              <meshStandardMaterial map={woodTexture} color="#8B4513" />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Counter */}
      {counter && (
        <group
          ref={counterRef}
          position={new THREE.Vector3(...counter.position)}
          rotation={counter.rotation ? new THREE.Euler(...counter.rotation) : undefined}
          scale={counter.scale ? new THREE.Vector3(...counter.scale) : new THREE.Vector3(1, 1, 1)}
        >
          {/* Counter top */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[4, 0.1, 1.5]} />
            <meshStandardMaterial map={woodTexture} color="#8B5A2B" />
          </mesh>
          
          {/* Counter front */}
          <mesh position={[0, 0, 0.7]} castShadow>
            <boxGeometry args={[4, 1, 0.1]} />
            <meshStandardMaterial map={woodTexture} color="#A0522D" />
          </mesh>
          
          {/* Coffee machine */}
          <mesh position={[1, 0.8, 0]} castShadow>
            <boxGeometry args={[0.7, 0.6, 0.5]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
          
          {/* Register */}
          <mesh position={[-1, 0.7, 0]} castShadow>
            <boxGeometry args={[0.5, 0.4, 0.4]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      )}
      
      {/* Plants */}
      {plants.map((plant, index) => (
        <group
          key={plant.id}
          ref={el => plantRefs.current[index] = el}
          position={new THREE.Vector3(...plant.position)}
          rotation={plant.rotation ? new THREE.Euler(...plant.rotation) : undefined}
          scale={plant.scale ? new THREE.Vector3(...plant.scale) : new THREE.Vector3(1, 1, 1)}
        >
          {/* Pot */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.2, 0.4, 16]} />
            <meshStandardMaterial color="#964B00" />
          </mesh>
          
          {/* Plant */}
          <group position={[0, 0.5, 0]}>
            {[0, 1, 2, 3, 4].map(i => (
              <mesh key={i} position={[
                Math.sin(i * Math.PI * 0.4) * 0.2,
                Math.random() * 0.5,
                Math.cos(i * Math.PI * 0.4) * 0.2
              ]} castShadow>
                <sphereGeometry args={[0.2, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                <meshStandardMaterial color="#228B22" />
              </mesh>
            ))}
          </group>
        </group>
      ))}
      
      {/* Lights */}
      {lights.map((light, index) => (
        <pointLight
          key={light.id}
          ref={el => lightRefs.current[index] = el}
          position={new THREE.Vector3(...light.position)}
          intensity={5}
          distance={10}
          color="#FFF5E0"
          castShadow
        />
      ))}
      
      {/* Walls */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="#E8DCCA" />
      </mesh>
      
      <mesh position={[0, 5, 10]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="#E8DCCA" />
      </mesh>
      
      <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="#E8DCCA" />
      </mesh>
      
      <mesh position={[10, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 10, 0.1]} />
        <meshStandardMaterial color="#E8DCCA" />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>
      
      {/* Art on walls */}
      <mesh position={[0, 5, -9.9]} receiveShadow>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>
      
      <mesh position={[-9.9, 5, -5]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#4ECDC4" />
      </mesh>
    </group>
  );
}
