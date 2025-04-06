// [Same import section as before...]
import React, { useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Environment } from '@/lib/stores/useEnvironment';

interface CafeProps {
  environment: Environment;
}

export function Cafe({ environment }: CafeProps) {
  const woodTexture = useTexture('/textures/wood.jpg');
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(4, 4);

  const floor = environment.objects.find(obj => obj.id === 'floor');
  const floorRef = useRef<THREE.Mesh>(null);

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
      <ambientLight intensity={1} />

     {/* Floor */}
{floor && (
  <mesh
    ref={floorRef}
    position={new THREE.Vector3(0, -0.05, 0)} // Adjusted floor position
    scale={floor.scale ? new THREE.Vector3(...floor.scale) : new THREE.Vector3(20, 1, 20)} // Enlarged floor scale
    receiveShadow
  >
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial map={woodTexture} color="#D3D3D3" /> {/* Polished gray floor */}
  </mesh>
)}

{/* Tables with candles */}
{tables.map((table, index) => (
  <group
    key={table.id}
    ref={el => tableRefs.current[index] = el}
    position={new THREE.Vector3(...table.position)}
    rotation={table.rotation ? new THREE.Euler(...table.rotation) : undefined}
    scale={table.scale ? new THREE.Vector3(...table.scale) : new THREE.Vector3(1.5, 1, 1.5)} // Increased scale for tables
  >
    <mesh castShadow receiveShadow>
      <boxGeometry args={[2, 0.1, 2]} /> {/* Larger table */}
      <meshStandardMaterial map={woodTexture} color="#FFFFFF" />
    </mesh>
    {[[-0.8, -0.5, -0.8], [-0.8, -0.5, 0.8], [0.8, -0.5, -0.8], [0.8, -0.5, 0.8]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <boxGeometry args={[0.15, 1, 0.15]} />
        <meshStandardMaterial map={woodTexture} color="#5D3A1A" />
      </mesh>
    ))}
    {/* Candle */}
    <pointLight position={[0, 0.5, 0]} intensity={1} distance={3} color="#ffddaa" />
    <mesh position={[0, 0.55, 0]}>
      <cylinderGeometry args={[0.07, 0.07, 0.3, 8]} /> {/* Slightly bigger candle */}
      <meshStandardMaterial color="#FFD700" />
    </mesh>
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
    <mesh position={[0, 1, 0]} castShadow>
      <boxGeometry args={[0.75, 0.1, 0.75]} /> {/* Slightly larger seat */}
      <meshStandardMaterial map={woodTexture} color="#8B4513" />
    </mesh>
    <mesh position={[0, 0.75, -0.4]} castShadow>
      <boxGeometry args={[0.75, 1.2, 0.1]} /> {/* Taller backrest */}
      <meshStandardMaterial map={woodTexture} color="#8B4513" />
    </mesh>
    {[[-0.35, -0.5, -0.35], [-0.35, -0.5, 0.35], [0.35, -0.5, -0.35], [0.35, -0.5, 0.35]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <boxGeometry args={[0.1, 1.2, 0.1]} /> {/* Improved leg design */}
        <meshStandardMaterial map={woodTexture} color="#8B5A2B" />
      </mesh>
    ))}
  </group>
))}

{/* Counter with pastry display & barista */}
{counter && (
  <group
    ref={counterRef}
    position={new THREE.Vector3(...counter.position)}
    rotation={counter.rotation ? new THREE.Euler(...counter.rotation) : undefined}
    scale={counter.scale ? new THREE.Vector3(...counter.scale) : new THREE.Vector3(2, 1, 2)} // Enlarged counter scale
  >
    {/* Counter */}
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[6, 0.1, 2]} /> {/* Larger counter */}
      <meshStandardMaterial map={woodTexture} color="#8B5A2B" />
    </mesh>
    <mesh position={[0, 0, 0.9]} castShadow>
      <boxGeometry args={[6, 1, 0.1]} /> {/* Improved top counter part */}
      <meshStandardMaterial map={woodTexture} color="#A0522D" />
    </mesh>

    {/* Coffee machine with animated steam */}
    <mesh position={[2, 0.8, 0]} castShadow>
      <boxGeometry args={[0.8, 0.6, 0.6]} /> {/* Slightly bigger coffee machine */}
      <meshStandardMaterial color="#333" />
    </mesh>
    <mesh position={[2, 1.4, 0]}>
      <sphereGeometry args={[0.07, 6, 6]} />
      <meshStandardMaterial color="#ccc" transparent opacity={0.5} />
    </mesh>

    {/* Register */}
    <mesh position={[-2, 0.7, 0]} castShadow>
      <boxGeometry args={[0.6, 0.4, 0.5]} /> {/* Slightly bigger register */}
      <meshStandardMaterial color="#333" />
    </mesh>

    {/* Pastry display */}
    <mesh position={[0, 0.6, -1]} castShadow>
      <boxGeometry args={[3, 0.6, 1]} /> {/* Larger pastry display */}
      <meshStandardMaterial color="#fff8dc" />
    </mesh>

    {/* Barista NPC */}
    <mesh position={[0, 1.5, 0]} castShadow>
      <capsuleGeometry args={[0.35, 0.7, 4, 8]} /> {/* Slightly taller barista */}
      <meshStandardMaterial color="#333366" />
    </mesh>
  </group>
)}


      {/* Plants with fairy lights */}
      {plants.map((plant, index) => (
        <group
          key={plant.id}
          ref={el => plantRefs.current[index] = el}
          position={new THREE.Vector3(...plant.position)}
          rotation={plant.rotation ? new THREE.Euler(...plant.rotation) : undefined}
          scale={plant.scale ? new THREE.Vector3(...plant.scale) : new THREE.Vector3(1, 1, 1)}
        >
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.2, 0.4, 16]} />
            <meshStandardMaterial color="#964B00" />
          </mesh>
          <group position={[0, 0.5, 0]}>
            {[0, 1, 2, 3, 4].map(i => (
              <mesh key={i} position={[
                Math.sin(i * Math.PI * 0.4) * 0.2,
                Math.random() * 0.5,
                Math.cos(i * Math.PI * 0.4) * 0.2
              ]} castShadow>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial color="#228B22" />
              </mesh>
            ))}
            <pointLight position={[0, 0.5, 0]} intensity={0.5} distance={2} color="#ffeecc" />
          </group>
        </group>
      ))}

      {/* Reading corner */}
      <group position={[-8, 0, -8]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial color="#deb887" />
        </mesh>
        <mesh position={[0, 1.5, -0.5]}>
          <boxGeometry args={[2, 2, 0.2]} />
          <meshStandardMaterial color="#a0522d" />
        </mesh>
      </group>

      {/* Digital menu */}
      <mesh position={[2, 2, -9.8]}>
        <planeGeometry args={[2, 3]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Walls, ceiling, lights, framed art */}
      {lights.map((light, index) => (
        <pointLight
          key={light.id}
          ref={el => lightRefs.current[index] = el}
          position={new THREE.Vector3(...light.position)}
          intensity={5}
          distance={30}
          color="#FFFFFF"
          castShadow
        />
      ))}

      {/* Basic walls */}
      {[[-10, 5, 0, [0, Math.PI / 2, 0]], [10, 5, 0, [0, Math.PI / 2, 0]], [0, 5, -10, [0, 0, 0]], [0, 5, 10, [0, 0, 0]]].map(([x, y, z, rot], i) => (
        <mesh key={i} position={[x, y, z]} rotation={rot as [number, number, number]} receiveShadow>
          <boxGeometry args={[20, 10, 0.1]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      ))}

      {/* Ceiling */}
      <mesh position={[0, 10, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#F5F5F5" />
      </mesh>

      {/* Framed Art */}
      <mesh position={[0, 5, -9.9]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#FF6B6B" />
      </mesh>
      <mesh position={[-9.9, 5, -5]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#4ECDC4" />
      </mesh>
    </group>
  );
}