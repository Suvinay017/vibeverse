import { useEffect } from "react";
import { useLocation } from "wouter";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/lib/stores/useAuth";
import { Gamepad2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  return (
    <div className="container max-w-md mx-auto px-6 py-16">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="p-0 mr-4 hover:bg-transparent"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>
        <div>
          <div className="inline-flex items-center mb-2 text-sm font-medium px-3 py-1 bg-primary/20 text-primary rounded-full">
            <Gamepad2 className="inline-block w-4 h-4 mr-1" /> PLAYER ACCOUNT
          </div>
          <h1 className="text-2xl font-bold text-white">Sign In</h1>
        </div>
      </div>
      
      <div className="bg-card/60 border border-border/40 rounded-lg p-6 backdrop-blur-sm mb-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Gamepad2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-center mb-2">Welcome Back, Player</h2>
        <p className="text-muted-foreground text-center text-sm mb-6">
          Login to continue your gaming connections journey
        </p>
        
        <LoginForm />
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <button 
          onClick={() => navigate("/signup")}
          className="text-primary hover:text-primary/90 font-medium"
        >
          Create Player Profile
        </button>
      </p>
    </div>
  );
}
