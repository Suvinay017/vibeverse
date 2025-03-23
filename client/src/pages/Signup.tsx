import { useEffect } from "react";
import { useLocation } from "wouter";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/lib/stores/useAuth";
import { Heart } from "lucide-react";

export default function Signup() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col items-center mb-8">
        <Heart className="h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl font-bold text-center">Join VibeVerse</h1>
        <p className="text-muted-foreground mt-2 text-center max-w-md">
          Create an account to start connecting with people who share your vibes
        </p>
      </div>
      
      <SignupForm />
    </div>
  );
}
