import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useAuth } from "@/lib/stores/useAuth";
import { Avatar } from "@/components/three/Avatar/Avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AvatarCustomizer } from "@/components/three/Avatar/AvatarCustomizer";

export default function AvatarPreview() {
  const { user } = useAuth();
  const [customizeOpen, setCustomizeOpen] = useState(false);
  
  const position: [number, number, number] = [0, 1, 0];
  const rotation: [number, number, number] = [0, 0, 0];

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="h-[300px]">
            <Canvas shadows>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
              <Avatar 
                position={position} 
                rotation={rotation} 
                config={user?.avatarConfig}
                username={user?.username}
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
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setCustomizeOpen(true)}
              className="flex items-center"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Customize Avatar
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Customize Your Avatar</DialogTitle>
          </DialogHeader>
          <AvatarCustomizer 
            initialConfig={user?.avatarConfig}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
