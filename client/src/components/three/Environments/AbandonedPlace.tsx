import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Environment } from '@/lib/stores/useEnvironment';

interface AbandonedPlaceProps {
  environment: Environment;
}

export function AbandonedPlace({ environment }: AbandonedPlaceProps) {
  // Textures
  const concreteTexture = useTexture('/textures/asphalt.png'); // Using asphalt as concrete
  concreteTexture.wrapS = concreteTexture.wrapT = THREE.RepeatWrapping;
  concreteTexture.repeat.set(5, 5);
  
  // Objects from environment
  const floor = environment.objects.find(obj => obj.type === 'floor');
  const walls = environment.objects.filter(obj => obj.type === 'wall');
  const machinery = environment.objects.filter(obj => obj.type === 'machinery');
  const crates = environment.objects.filter(obj => obj.type === 'crate');
  const barrels = environment.objects.filter(obj => obj.type === 'barrel');
  const brokenLights = environment.objects.filter(obj => obj.type === 'brokenLight');
  const brokenWindows = environment.objects.filter(obj => obj.type === 'brokenWindow');
  
  // Refs
  const floorRef = useRef<THREE.Mesh>(null);
  const wallRefs = useRef<(THREE.Mesh | null)[]>([]);
  const machineryRefs = useRef<(THREE.Group | null)[]>([]);
  const crateRefs = useRef<(THREE.Mesh | null)[]>([]);
  const barrelRefs = useRef<(THREE.Mesh | null)[]>([]);
  const brokenLightRefs = useRef<(THREE.Group | null)[]>([]);
  const brokenWindowRefs = useRef<(THREE.Group | null)[]>([]);

  return (
    <group>
      {/* Very dim ambient light for abandoned feel */}
      <ambientLight intensity={0.2} />
      
      {/* Moonlight coming through windows */}
      <directionalLight
        position={[20, 10, 20]}
        intensity={0.1}
        color="#AAAAFF"
      />
      
      {/* Floor */}
      {floor && (
        <mesh
          ref={floorRef}
          position={new THREE.Vector3(...floor.position)}
          scale={floor.scale ? new THREE.Vector3(...floor.scale) : new THREE.Vector3(1, 1, 1)}
          rotation={floor.rotation ? new THREE.Euler(...floor.rotation) : undefined}
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={concreteTexture} color="#555555" roughness={1} />
        </mesh>
      )}
      
      {/* Walls */}
      {walls.map((wall, index) => (
        <mesh
          key={wall.id}
          ref={el => wallRefs.current[index] = el}
          position={new THREE.Vector3(...wall.position)}
          scale={wall.scale ? new THREE.Vector3(...wall.scale) : new THREE.Vector3(1, 1, 1)}
          rotation={wall.rotation ? new THREE.Euler(...wall.rotation) : undefined}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#777777" roughness={1} />
        </mesh>
      ))}
      
      {/* Machinery */}
      {machinery.map((machine, index) => (
        <group
          key={machine.id}
          ref={el => machineryRefs.current[index] = el}
          position={new THREE.Vector3(...machine.position)}
          rotation={machine.rotation ? new THREE.Euler(...machine.rotation) : undefined}
          scale={machine.scale ? new THREE.Vector3(...machine.scale) : new THREE.Vector3(1, 1, 1)}
        >
          {/* Base */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, 1, 2]} />
            <meshStandardMaterial color="#555555" roughness={0.9} />
          </mesh>
          
          {/* Top part */}
          <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[1.5, 1, 1.5]} />
            <meshStandardMaterial color="#444444" roughness={0.9} />
          </mesh>
          
          {/* Pipes and details */}
          <mesh position={[0.7, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#666666" roughness={0.7} />
          </mesh>
          
          <mesh position={[-0.5, 1.8, 0.3]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
            <meshStandardMaterial color="#666666" roughness={0.7} />
          </mesh>
          
          {/* Control panel */}
          <mesh position={[0, 1, 1]} castShadow>
            <boxGeometry args={[0.8, 0.5, 0.1]} />
            <meshStandardMaterial color="#333333" roughness={0.5} />
          </mesh>
          
          {/* Broken / rusty parts */}
          <mesh position={[0.5, 0.3, 0.8]} castShadow>
            <boxGeometry args={[0.3, 0.2, 0.3]} />
            <meshStandardMaterial color="#8B4513" roughness={1} />
          </mesh>
        </group>
      ))}
      
      {/* Crates */}
      {crates.map((crate, index) => (
        <mesh
          key={crate.id}
          ref={el => crateRefs.current[index] = el}
          position={new THREE.Vector3(...crate.position)}
          rotation={crate.rotation ? new THREE.Euler(...crate.rotation) : undefined}
          scale={crate.scale ? new THREE.Vector3(...crate.scale) : new THREE.Vector3(1, 1, 1)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
        </mesh>
      ))}
      
      {/* Barrels */}
      {barrels.map((barrel, index) => (
        <mesh
          key={barrel.id}
          ref={el => barrelRefs.current[index] = el}
          position={new THREE.Vector3(...barrel.position)}
          rotation={barrel.rotation ? new THREE.Euler(...barrel.rotation) : undefined}
          scale={barrel.scale ? new THREE.Vector3(...barrel.scale) : new THREE.Vector3(1, 1, 1)}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.5, 0.5, 1.5, 16]} />
          <meshStandardMaterial color="#AA3333" roughness={0.7} />
        </mesh>
      ))}
      
      {/* Broken Lights */}
      {brokenLights.map((light, index) => (
        <group
          key={light.id}
          ref={el => brokenLightRefs.current[index] = el}
          position={new THREE.Vector3(...light.position)}
          rotation={light.rotation ? new THREE.Euler(...light.rotation) : undefined}
        >
          {/* Light fixture */}
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.4, 0.2, 8]} />
            <meshStandardMaterial color="#555555" roughness={0.9} />
          </mesh>
          
          {/* Light bulb - flickering effect will be added in animation */}
          <pointLight
            position={[0, -0.2, 0]}
            color="#FFAA77"
            intensity={Math.random() > 0.7 ? 2 : 0} // Random flickering
            distance={5}
          />
        </group>
      ))}
      
      {/* Broken Windows */}
      {brokenWindows.map((window, index) => (
        <group
          key={window.id}
          ref={el => brokenWindowRefs.current[index] = el}
          position={new THREE.Vector3(...window.position)}
          rotation={window.rotation ? new THREE.Euler(...window.rotation) : undefined}
        >
          {/* Window frame */}
          <mesh castShadow>
            <boxGeometry args={[1.5, 2, 0.1]} />
            <meshStandardMaterial color="#777777" roughness={0.9} />
          </mesh>
          
          {/* Window opening (hole) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 1.7, 0.2]} />
            <meshStandardMaterial color="#000000" transparent opacity={0} />
          </mesh>
          
          {/* Broken glass shards - randomly placed */}
          {Array.from({ length: 5 }).map((_, i) => {
            const posX = (Math.random() - 0.5) * 1.2;
            const posY = (Math.random() - 0.5) * 1.7;
            
            return (
              <mesh
                key={i}
                position={[posX, posY, 0]}
                rotation={[
                  Math.random() * Math.PI,
                  Math.random() * Math.PI,
                  Math.random() * Math.PI
                ]}
                scale={[0.2, 0.4, 0.01]}
                castShadow
              >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color="#AACCFF"
                  transparent
                  opacity={0.3}
                  roughness={0.1}
                />
              </mesh>
            );
          })}
          
          {/* Light coming through window */}
          <spotLight
            position={[0, 0, -1]}
            angle={Math.PI / 4}
            penumbra={0.5}
            intensity={0.5}
            color="#AAAAFF"
            castShadow
          />
        </group>
      ))}
      
      {/* Debris and trash scattered around */}
      {Array.from({ length: 20 }).map((_, i) => {
        const posX = (Math.random() - 0.5) * 28;
        const posZ = (Math.random() - 0.5) * 28;
        const scale = 0.2 + Math.random() * 0.3;
        const type = Math.floor(Math.random() * 3); // 0: rubble, 1: paper, 2: metal
        
        let color;
        switch (type) {
          case 0: color = "#888888"; break;
          case 1: color = "#DDDDCC"; break;
          case 2: color = "#AAAAAA"; break;
          default: color = "#888888";
        }
        
        return (
          <mesh
            key={`debris-${i}`}
            position={[posX, 0.1, posZ]}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            ]}
            scale={[scale, scale, scale]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1, 0.2, 1]} />
            <meshStandardMaterial color={color} roughness={1} />
          </mesh>
        );
      })}
      
      {/* Cobwebs in corners */}
      {[
        [14, 9, 14],
        [14, 9, -14],
        [-14, 9, 14],
        [-14, 9, -14]
      ].map((pos, i) => (
        <mesh
          key={`cobweb-${i}`}
          position={pos}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
