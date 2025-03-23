import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Gamepad2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 bg-card/90 border-primary/20 overflow-hidden">
        <CardContent className="pt-10 pb-8 px-6 text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mb-6 animate-pulse">
              <Gamepad2 className="h-10 w-10 text-destructive" />
            </div>
            
            <h1 className="text-4xl font-bold mb-2 text-white">404</h1>
            <div className="bg-primary/20 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4">
              QUEST FAILED
            </div>
            <h2 className="text-xl font-semibold mb-4 text-white">This area doesn't exist</h2>
          </div>

          <p className="mb-8 text-muted-foreground">
            The destination you're trying to reach is not available in this virtual world.
            Maybe it's still under construction or you took a wrong turn.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-medium"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Lobby
            </Button>
            
            <Button 
              variant="outline" 
              className="border-primary/20 hover:bg-primary/10"
              onClick={() => navigate("/explore")}
            >
              <Gamepad2 className="mr-2 h-4 w-4" />
              Explore Environments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
