import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Environment } from '@/lib/stores/useEnvironment';

interface StreetProps {
  environment: Environment;
}

export function Street({ environment }: StreetProps) {
  // Textures
  const asphaltTexture = useTexture('/textures/asphalt.png');
  asphaltTexture.wrapS = asphaltTexture.wrapT = THREE.RepeatWrapping;
  asphaltTexture.repeat.set(10, 30);
  
  // Objects from environment
  const road = environment.objects.find(obj => obj.type === 'road');
  const sidewalks = environment.objects.filter(obj => obj.type === 'sidewalk');
  const buildings = environment.objects.filter(obj => obj.type === 'building');
  const neonSigns = environment.objects.filter(obj => obj.type === 'neonSign');
  const streetLights = environment.objects.filter(obj => obj.type === 'streetLight');
  
  // Refs
  const roadRef = useRef<THREE.Mesh>(null);
  const sidewalkRefs = useRef<(THREE.Mesh | null)[]>([]);
  const buildingRefs = useRef<(THREE.Group | null)[]>([]);
  const neonSignRefs = useRef<(THREE.Group | null)[]>([]);
  const streetLightRefs = useRef<(THREE.Group | null)[]>([]);
  
  // Neon colors
  const neonColors = ['#FF00FF', '#00FFFF', '#FF3333', '#33FF33', '#3333FF'];

  return (
    <group>
      {/* Ambient light - dark for cyberpunk feel */}
      <ambientLight intensity={0.2} />
      
      {/* Moon/night light */}
      <directionalLight
        position={[30, 50, -30]}
        intensity={0.3}
        color="#8888FF"
      />
      
      {/* Road */}
      {road && (
        <mesh
          ref={roadRef}
          position={new THREE.Vector3(...road.position)}
          scale={road.scale ? new THREE.Vector3(...road.scale) : new THREE.Vector3(1, 1, 1)}
          rotation={road.rotation ? new THREE.Euler(...road.rotation) : undefined}
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={asphaltTexture} color="#333333" />
        </mesh>
      )}
      
      {/* Sidewalks */}
      {sidewalks.map((sidewalk, index) => (
        <mesh
          key={sidewalk.id}
          ref={el => sidewalkRefs.current[index] = el}
          position={new THREE.Vector3(...sidewalk.position)}
          scale={sidewalk.scale ? new THREE.Vector3(...sidewalk.scale) : new THREE.Vector3(1, 1, 1)}
          rotation={sidewalk.rotation ? new THREE.Euler(...sidewalk.rotation) : undefined}
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      ))}
      
      {/* Buildings */}
      {buildings.map((building, index) => (
        <group
          key={building.id}
          ref={el => buildingRefs.current[index] = el}
          position={new THREE.Vector3(...building.position)}
          scale={building.scale ? new THREE.Vector3(...building.scale) : new THREE.Vector3(1, 1, 1)}
          rotation={building.rotation ? new THREE.Euler(...building.rotation) : undefined}
        >
          {/* Main building structure */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          
          {/* Windows - randomly place on building faces */}
          {Array.from({ length: 20 }).map((_, i) => {
            const posX = (Math.random() - 0.5) * 0.8;
            const posY = (Math.random() - 0.5) * 0.8;
            const side = Math.floor(Math.random() * 4);
            let position, rotation;
            
            switch (side) {
              case 0: // Front
                position = [posX, posY, 0.501];
                rotation = [0, 0, 0];
                break;
              case 1: // Back
                position = [posX, posY, -0.501];
                rotation = [0, Math.PI, 0];
                break;
              case 2: // Left
                position = [-0.501, posY, posX];
                rotation = [0, -Math.PI / 2, 0];
                break;
              case 3: // Right
                position = [0.501, posY, posX];
                rotation = [0, Math.PI / 2, 0];
                break;
              default:
                position = [0, 0, 0];
                rotation = [0, 0, 0];
            }
            
            const isLit = Math.random() > 0.3;
            
            return (
              <mesh
                key={i}
                position={position}
                rotation={rotation}
                scale={[0.1, 0.1, 0.01]}
              >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color={isLit ? "#FFFF77" : "#444444"}
                  emissive={isLit ? "#FFFF77" : "#000000"}
                  emissiveIntensity={isLit ? 1 : 0}
                />
              </mesh>
            );
          })}
        </group>
      ))}
      
      {/* Neon Signs */}
      {neonSigns.map((sign, index) => {
        const color = neonColors[index % neonColors.length];
        
        return (
          <group
            key={sign.id}
            ref={el => neonSignRefs.current[index] = el}
            position={new THREE.Vector3(...sign.position)}
            rotation={sign.rotation ? new THREE.Euler(...sign.rotation) : undefined}
          >
            {/* Sign backing */}
            <mesh castShadow>
              <boxGeometry args={[2, 1, 0.1]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
            
            {/* Neon text - simplified as glowing rectangles */}
            <group position={[0, 0, 0.06]}>
              {/* First line of "text" */}
              <mesh>
                <boxGeometry args={[1.5, 0.2, 0.05]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={2}
                />
              </mesh>
              
              {/* Second line of "text" */}
              <mesh position={[0, -0.3, 0]}>
                <boxGeometry args={[1, 0.15, 0.05]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={2}
                />
              </mesh>
            </group>
            
            {/* Light emanating from sign */}
            <pointLight
              position={[0, 0, 0.3]}
              color={color}
              intensity={5}
              distance={5}
            />
          </group>
        );
      })}
      
      {/* Street Lights */}
      {streetLights.map((light, index) => (
        <group
          key={light.id}
          ref={el => streetLightRefs.current[index] = el}
          position={new THREE.Vector3(...light.position)}
          rotation={light.rotation ? new THREE.Euler(...light.rotation) : undefined}
        >
          {/* Pole */}
          <mesh castShadow>
            <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
            <meshStandardMaterial color="#777777" />
          </mesh>
          
          {/* Light fixture */}
          <group position={[0, 1.5, 0]}>
            {/* Arm extending from pole */}
            <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
              <meshStandardMaterial color="#777777" />
            </mesh>
            
            {/* Light housing */}
            <mesh position={[1, 0, 0]} castShadow>
              <boxGeometry args={[0.2, 0.1, 0.2]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            
            {/* Light */}
            <pointLight
              position={[1, -0.1, 0]}
              color="#77BBFF"
              intensity={2}
              distance={10}
              castShadow
            />
          </group>
        </group>
      ))}
      
      {/* Sky */}
      <mesh position={[0, 30, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#000008" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
