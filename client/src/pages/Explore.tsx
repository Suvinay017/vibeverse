import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/stores/useAuth";
import ExploreSection from "@/components/explore/ExploreSection";
import { Map, Coffee, Building, Construction } from "lucide-react";

export default function Explore() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold">Explore Virtual Environments</h1>
        <p className="text-muted-foreground mt-2">
          Discover and enter immersive 3D spaces to meet and connect with others
        </p>
      </div>
      
      <Tabs defaultValue="all" className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span>All Environments</span>
          </TabsTrigger>
          <TabsTrigger value="cafe" className="flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            <span>Cafes</span>
          </TabsTrigger>
          <TabsTrigger value="street" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Streets</span>
          </TabsTrigger>
          <TabsTrigger value="abandoned" className="flex items-center gap-2">
            <Construction className="h-4 w-4" />
            <span>Abandoned</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <ExploreSection />
        </TabsContent>
        
        <TabsContent value="cafe">
          <Card>
            <CardHeader>
              <CardTitle>Cozy Cafes</CardTitle>
              <CardDescription>
                Warm and inviting environments perfect for casual conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExploreSection />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="street">
          <Card>
            <CardHeader>
              <CardTitle>Urban Streets</CardTitle>
              <CardDescription>
                Vibrant cyberpunk streets with neon lights and futuristic atmosphere
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExploreSection />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="abandoned">
          <Card>
            <CardHeader>
              <CardTitle>Abandoned Places</CardTitle>
              <CardDescription>
                Mysterious and eerie abandoned locations for adventurous explorers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExploreSection />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>How to Interact</CardTitle>
          <CardDescription>
            Basic controls and tips for navigating 3D environments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Movement Controls</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>W or Up Arrow - Move forward</li>
                <li>S or Down Arrow - Move backward</li>
                <li>A or Left Arrow - Move left</li>
                <li>D or Right Arrow - Move right</li>
                <li>Space - Jump</li>
                <li>E - Interact with objects</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Camera Controls</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Mouse - Look around</li>
                <li>Click to lock mouse pointer for better control</li>
                <li>Press ESC to unlock pointer</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Approach other users to initiate conversations</li>
                <li>Explore the environment to find interactive objects</li>
                <li>Some areas may have special activities or features</li>
                <li>Click on users to view their profile and send connection requests</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
