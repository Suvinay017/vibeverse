import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Avatar } from "./Avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/stores/useProfile";
import type { AvatarConfig } from "@shared/types";
import { toast } from "sonner";

const hairStyles = [0, 1, 2, 3]; // IDs for different hair styles
const outfits = [0, 1, 2, 3]; // IDs for different outfits
const accessories = [0, 1, 2, 3, 4]; // IDs for different accessories

const hairColors = [
  { name: "Black", value: "#000000" },
  { name: "Brown", value: "#3d2314" },
  { name: "Blonde", value: "#e6be8a" },
  { name: "Red", value: "#8d4a43" },
  { name: "Blue", value: "#5566ff" },
  { name: "Purple", value: "#8855aa" },
  { name: "Green", value: "#55aa55" },
];

const skinTones = [
  { name: "Light", value: "#ffdbac" },
  { name: "Medium", value: "#e5aa70" },
  { name: "Tan", value: "#c68642" },
  { name: "Brown", value: "#8d5524" },
  { name: "Dark", value: "#5c3836" },
];

const eyeColors = [
  { name: "Brown", value: "#3d2314" },
  { name: "Blue", value: "#5566ff" },
  { name: "Green", value: "#55aa55" },
  { name: "Hazel", value: "#a6814c" },
  { name: "Gray", value: "#aaaaaa" },
];

interface AvatarCustomizerProps {
  initialConfig?: AvatarConfig;
  onSave?: (config: AvatarConfig) => void;
}

export function AvatarCustomizer({ initialConfig, onSave }: AvatarCustomizerProps) {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig || {
    hairStyle: 0,
    hairColor: "#3d2314",
    skinTone: "#ffdbac",
    eyeColor: "#3d2314",
    outfit: 0,
    accessories: [],
  });
  
  const [position, setPosition] = useState<[number, number, number]>([0, 1, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  
  const { updateProfile, isUpdating, error, clearError } = useProfile();
  
  const handleSave = async () => {
    try {
      if (onSave) {
        onSave(config);
      } else {
        await updateProfile({ avatarConfig: config });
        toast.success("Avatar updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update avatar");
    }
  };
  
  const updateConfig = (key: keyof AvatarConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const toggleAccessory = (id: number) => {
    setConfig(prev => {
      const newAccessories = [...prev.accessories || []];
      
      if (newAccessories.includes(id)) {
        return {
          ...prev,
          accessories: newAccessories.filter(a => a !== id)
        };
      } else {
        return {
          ...prev,
          accessories: [...newAccessories, id]
        };
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Avatar preview */}
      <Card className="md:col-span-2 h-[400px]">
        <CardContent className="p-0 h-full">
          <Canvas shadows>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
            <Avatar 
              position={position} 
              rotation={rotation} 
              config={config} 
            />
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
            </mesh>
            <OrbitControls 
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 2} 
              enableZoom={true}
              enablePan={false}
            />
          </Canvas>
        </CardContent>
      </Card>
      
      {/* Customization options */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="hair">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="hair">Hair</TabsTrigger>
              <TabsTrigger value="face">Face</TabsTrigger>
              <TabsTrigger value="outfit">Outfit</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hair">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Hair Style</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {hairStyles.map(style => (
                      <Button
                        key={style}
                        variant={config.hairStyle === style ? "default" : "outline"}
                        className="p-2 h-12"
                        onClick={() => updateConfig("hairStyle", style)}
                      >
                        Style {style + 1}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Hair Color</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {hairColors.map(color => (
                      <Button
                        key={color.value}
                        variant="outline"
                        className="p-0 h-10 overflow-hidden"
                        onClick={() => updateConfig("hairColor", color.value)}
                        style={{
                          borderColor: config.hairColor === color.value ? "#ffffff" : "transparent",
                          borderWidth: config.hairColor === color.value ? "2px" : "1px"
                        }}
                      >
                        <div 
                          className="w-full h-full" 
                          style={{ backgroundColor: color.value }} 
                          title={color.name}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="face">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Skin Tone</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {skinTones.map(tone => (
                      <Button
                        key={tone.value}
                        variant="outline"
                        className="p-0 h-10 overflow-hidden"
                        onClick={() => updateConfig("skinTone", tone.value)}
                        style={{
                          borderColor: config.skinTone === tone.value ? "#ffffff" : "transparent",
                          borderWidth: config.skinTone === tone.value ? "2px" : "1px"
                        }}
                      >
                        <div 
                          className="w-full h-full" 
                          style={{ backgroundColor: tone.value }} 
                          title={tone.name}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Eye Color</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {eyeColors.map(color => (
                      <Button
                        key={color.value}
                        variant="outline"
                        className="p-0 h-10 overflow-hidden"
                        onClick={() => updateConfig("eyeColor", color.value)}
                        style={{
                          borderColor: config.eyeColor === color.value ? "#ffffff" : "transparent",
                          borderWidth: config.eyeColor === color.value ? "2px" : "1px"
                        }}
                      >
                        <div 
                          className="w-full h-full" 
                          style={{ backgroundColor: color.value }} 
                          title={color.name}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="outfit">
              <div>
                <h3 className="text-sm font-medium mb-2">Outfit Style</h3>
                <div className="grid grid-cols-2 gap-2">
                  {outfits.map(style => (
                    <Button
                      key={style}
                      variant={config.outfit === style ? "default" : "outline"}
                      className="p-2 h-12"
                      onClick={() => updateConfig("outfit", style)}
                    >
                      Outfit {style + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="accessories">
              <div>
                <h3 className="text-sm font-medium mb-2">Accessories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {accessories.map(accessory => (
                    <Button
                      key={accessory}
                      variant={config.accessories?.includes(accessory) ? "default" : "outline"}
                      className="p-2 h-12"
                      onClick={() => toggleAccessory(accessory)}
                    >
                      {config.accessories?.includes(accessory) ? "Remove" : "Add"} {accessory + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Button 
              className="w-full"
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Avatar"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
