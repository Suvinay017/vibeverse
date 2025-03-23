import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/stores/useAuth";
import { useAudio } from "@/lib/stores/useAudio";
import { Music, Gamepad2, Map, Users, Headset, MessageSquare } from "lucide-react";

export default function Home() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { backgroundMusic, isMuted, toggleMute } = useAudio();
  
  useEffect(() => {
    // Start background music when component mounts
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(err => {
        console.error("Failed to play audio:", err);
      });
    }
    
    return () => {
      // Pause music when component unmounts
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
    };
  }, [backgroundMusic, isMuted]);
  
  // Play/pause music when mute state changes
  useEffect(() => {
    if (backgroundMusic) {
      if (isMuted) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play().catch(err => {
          console.error("Failed to play audio:", err);
        });
      }
    }
  }, [isMuted, backgroundMusic]);
  
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Section - Inspired by NexusLink */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
        <div className="flex flex-col max-w-xl">
          <div className="mb-2 text-sm font-medium px-3 py-1 bg-primary/20 text-primary rounded-full w-fit">
            <Gamepad2 className="inline-block w-4 h-4 mr-1" /> GAMING COMMUNITY
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Player Two</span>
          </h1>
          <p className="text-lg mb-8 text-muted-foreground">
            Connect with gamers and like-minded individuals in immersive 3D
            environments. Share your vibes, music tastes, and gaming experiences.
          </p>
          
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">10K+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-secondary" />
              <span className="text-sm text-muted-foreground">50+ Gaming Communities</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-accent" />
              <span className="text-sm text-muted-foreground">Music Matching</span>
            </div>
          </div>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/signup")}
                className="bg-primary hover:bg-primary/90 text-white font-medium"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/explore")} 
                className="border-primary text-primary hover:bg-primary/10"
              >
                Explore Worlds
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/explore")}
                className="bg-primary hover:bg-primary/90 text-white font-medium"
              >
                Explore Worlds
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate("/match")}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Find Matches
              </Button>
            </div>
          )}
        </div>
        
        <div className="bg-card p-4 rounded-lg w-full max-w-md h-72 flex items-center justify-center">
          {/* This could be a 3D model or preview image - placeholder for now */}
          <div className="relative w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary text-6xl">
              <Gamepad2 className="h-24 w-24 animate-pulse" />
            </span>
          </div>
        </div>
      </div>
      
      {/* Feature Cards Section */}
      <div className="mt-20 mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Level Up Your Dating Experience</h2>
        <p className="text-center text-muted-foreground mb-10">Immersive 3D environments designed for gamers and explorers</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card border-primary/20 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Customizable 3D Avatars</CardTitle>
              <CardDescription>
                Create and personalize your 3D avatar with gaming-inspired gear and accessories
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card border-secondary/20 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Map className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-xl">Virtual Environments</CardTitle>
              <CardDescription>
                Meet in cyberpunk cities, fantasy realms, or retro arcade worlds
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card border-accent/20 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Immersive Chat</CardTitle>
              <CardDescription>
                Text, voice, and 3D emotes with gaming references and memes
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card border-primary/20 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Third-Person Dates</CardTitle>
              <CardDescription>
                Experience dates from a third-person perspective in our 3D cafe and other venues
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card border-secondary/20 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-xl">Music Matching</CardTitle>
              <CardDescription>
                Connect with others who share your music taste, from game soundtracks to your favorite genres
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-card border-accent/20 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Gamepad2 className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-xl">Gaming Together</CardTitle>
              <CardDescription>
                Play mini-games, solve puzzles, and enjoy co-op experiences on your virtual dates
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="text-center max-w-2xl mx-auto mt-20 mb-12">
        <h2 className="text-2xl font-bold mb-4">Ready to find your gaming partner?</h2>
        <p className="text-muted-foreground mb-6">
          Join NexusLink today and connect with gamers who share your passion.
        </p>
        
        {!user ? (
          <Button 
            size="lg" 
            onClick={() => navigate("/signup")}
            className="bg-primary hover:bg-primary/90 text-white font-medium"
          >
            Get Started Now
          </Button>
        ) : (
          <Button 
            size="lg" 
            onClick={() => navigate("/explore")}
            className="bg-primary hover:bg-primary/90 text-white font-medium"
          >
            Start Exploring
          </Button>
        )}
      </div>
    </div>
  );
}
