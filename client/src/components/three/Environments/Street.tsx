import React from 'react';
import { useTexture, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { Environment } from '@/lib/stores/useEnvironment';

interface StreetProps {
  environment: Environment;
}

export function Street({ environment }: StreetProps) {
  const textures = {
    asphalt: useTexture('/textures/asphalt.png'),
    sidewalk: useTexture('/textures/sidewalk.jpg'),
    brick: useTexture('/textures/brick_diffuse.jpg'),
  };

  Object.values(textures).forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(30, 30);
  });

  const road = environment.objects.find(obj => obj.type === 'road');
  const sidewalks = environment.objects.filter(obj => obj.type === 'sidewalk');
  const buildings = environment.objects.filter(obj => obj.type === 'building');
  const neonColors = ['#FF00FF', '#00FFFF', '#FF3333', '#33FF33', '#FFA500'];

  return (
    <>
      <color attach="background" args={['#05050a']} />
      <fog attach="fog" args={['#05050a', 15, 120]} />

      {/* Enhanced Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[40, 60, -30]}
        intensity={2}
        color="#fef0dd"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 10, 0]} intensity={1} color="#33ccff" distance={100} />
      <spotLight
        position={[-30, 40, 30]}
        angle={0.4}
        penumbra={1}
        intensity={1.2}
        castShadow
        color="#ff66cc"
      />

      {/* Subtle Night Cloud Glow */}
      <Cloud scale={30} position={[0, 60, 0]} speed={0.1} opacity={0.15} color="#ffffff" />

      {/* Road */}
      {road && (
        <mesh
          position={new THREE.Vector3(...road.position)}
          scale={new THREE.Vector3(...(road.scale || [3, 1, 50]))}
          rotation={new THREE.Euler(...(road.rotation || [0, 0, 0]))}
          receiveShadow
        >
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial
            map={textures.asphalt}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      )}

      {/* Glowing Stripe */}
      {road && (
        <mesh position={[road.position[0], road.position[1] + 0.06, road.position[2]]}>
          <boxGeometry args={[0.1, 0.02, 40]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Sidewalks */}
      {sidewalks.map((sidewalk, index) => (
        <mesh
          key={index}
          position={new THREE.Vector3(...sidewalk.position)}
          scale={new THREE.Vector3(...(sidewalk.scale || [2, 1, 50]))}
          rotation={new THREE.Euler(...(sidewalk.rotation || [0, 0, 0]))}
          receiveShadow
        >
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial
            map={textures.sidewalk}
            color="#cccccc"
            roughness={0.5}
          />
        </mesh>
      ))}

      {/* Buildings */}
      {buildings.map((building, index) => (
        <group
          key={index}
          position={new THREE.Vector3(...building.position)}
          scale={new THREE.Vector3(...(building.scale || [1.5, 3, 1.5]))}
          rotation={new THREE.Euler(...(building.rotation || [0, 0, 0]))}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial
              map={textures.brick}
              color={neonColors[index % neonColors.length]}
              metalness={0.4}
              roughness={0.7}
              emissive={neonColors[index % neonColors.length]}
              emissiveIntensity={0.3}
              toneMapped={false}
            />
          </mesh>

          {/* Random Glowing Windows */}
          {Array.from({ length: 15 }).map((_, w) => {
            const posX = (Math.random() - 0.5) * 0.9;
            const posY = Math.random() * 2 - 1;
            const side = Math.floor(Math.random() * 4);
            let pos: [number, number, number] = [0, 0, 0];
            switch (side) {
              case 0: pos = [posX, posY, 0.501]; break;
              case 1: pos = [posX, posY, -0.501]; break;
              case 2: pos = [-0.501, posY, posX]; break;
              case 3: pos = [0.501, posY, posX]; break;
            }

            return (
              <mesh key={w} position={pos}>
                <planeGeometry args={[0.1, 0.1]} />
                <meshStandardMaterial
                  emissive="#ffffcc"
                  emissiveIntensity={Math.random() * 1.5 + 0.5}
                  toneMapped={false}
                />
              </mesh>
            );
          })}

          {/* Neon Signboard */}
          <mesh position={[0, 2, 0.6]}>
            <planeGeometry args={[0.8, 0.3]} />
            <meshStandardMaterial
              color="#000"
              emissive="#00FFFF"
              emissiveIntensity={3}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}
