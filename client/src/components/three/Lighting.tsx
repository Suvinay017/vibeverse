import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface LightingProps {
  environmentType?: "cafe" | "street" | "abandoned";
}

export function Lighting({ environmentType = "cafe" }: LightingProps) {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);

  // Set up lighting based on environment type
  const getAmbientIntensity = () => {
    switch (environmentType) {
      case "street":
        return 0.2; // Dark for cyberpunk feel
      case "abandoned":
        return 0.15; // Very dim for abandoned feel
      case "cafe":
      default:
        return 0.5; // Warm ambient for cafe
    }
  };

  const getDirectionalIntensity = () => {
    switch (environmentType) {
      case "street":
        return 0.3; // Low directional for night feel
      case "abandoned":
        return 0.2; // Dim directional light
      case "cafe":
      default:
        return 0.6; // Brighter directional for cafe
    }
  };

  const getLightColor = () => {
    switch (environmentType) {
      case "street":
        return new THREE.Color("#8888FF"); // Bluish light for cyberpunk
      case "abandoned":
        return new THREE.Color("#AAAAAA"); // Grayish light for abandoned
      case "cafe":
      default:
        return new THREE.Color("#FFEECC"); // Warm light for cafe
    }
  };

  // Animate directional light for subtle environment effects
  useFrame(({ clock }) => {
    if (directionalLightRef.current) {
      const time = clock.getElapsedTime();

      // Add subtle movement to directional light
      if (environmentType === "abandoned") {
        // Flickering effect for abandoned place
        const flicker = Math.sin(time * 15) * 0.1 + Math.random() * 0.03;
        directionalLightRef.current.intensity = getDirectionalIntensity() + flicker;
      } else if (environmentType === "street") {
        // Subtle pulsing for neon street lights
        const pulse = Math.sin(time * 0.5) * 0.05;
        directionalLightRef.current.intensity = getDirectionalIntensity() + pulse;
      }
    }
  });

  return (
    <>
      <ambientLight 
        ref={ambientLightRef} 
        intensity={getAmbientIntensity()} 
        color={getLightColor()} 
      />
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={getDirectionalIntensity()}
        color={getLightColor()}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Add environment-specific lighting effects */}
      {environmentType === "street" && (
        <>
          {/* Moon light for street scene */}
          <directionalLight
            position={[30, 50, -30]}
            intensity={0.3}
            color="#8888FF"
          />
          
          {/* Neon glow */}
          <pointLight position={[0, 3, -5]} intensity={1} color="#FF00FF" distance={10} />
          <pointLight position={[-5, 2, 0]} intensity={1} color="#00FFFF" distance={8} />
        </>
      )}
      
      {environmentType === "abandoned" && (
        <>
          {/* Moonlight through windows */}
          <spotLight
            position={[20, 10, 20]}
            angle={Math.PI / 6}
            penumbra={0.5}
            intensity={0.3}
            color="#AAAAFF"
            distance={30}
            castShadow
          />
        </>
      )}
    </>
  );
}
