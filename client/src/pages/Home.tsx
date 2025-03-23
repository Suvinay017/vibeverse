import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/stores/useAuth";
import { useAudio } from "@/lib/stores/useAudio";
import { Music, Heart, Map, Users } from "lucide-react";

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
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          VibeVerse
        </h1>
        <p className="text-xl mb-8 text-muted-foreground">
          Step into a new dimension of dating with immersive 3D environments, 
          vibe matching, and music-based connections.
        </p>
        
        {!user ? (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Join Now
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate("/explore")}>
              Explore Environments
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/match")}>
              Find Matches
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-accent/50 border-accent">
          <CardHeader>
            <Heart className="h-12 w-12 text-primary mb-2" />
            <CardTitle>Vibe Matching</CardTitle>
            <CardDescription>
              Connect with people who share your aesthetic, interests, and energy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our advanced matching algorithm finds people who share your unique vibes, making connections that go beyond just appearances.
            </p>
          </CardContent>
          <CardFooter>
            {user && (
              <Button variant="ghost" className="w-full" onClick={() => navigate("/match")}>
                Find Your Vibes
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card className="bg-accent/50 border-accent">
          <CardHeader>
            <Music className="h-12 w-12 text-primary mb-2" />
            <CardTitle>Music Taste</CardTitle>
            <CardDescription>
              Connect through Spotify and match with people who share your music taste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Link your Spotify account to find matches based on your favorite artists, genres, and tracks for deeper connections.
            </p>
          </CardContent>
          <CardFooter>
            {user && (
              <Button variant="ghost" className="w-full" onClick={() => navigate("/profile")}>
                Connect Spotify
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card className="bg-accent/50 border-accent">
          <CardHeader>
            <Map className="h-12 w-12 text-primary mb-2" />
            <CardTitle>3D Environments</CardTitle>
            <CardDescription>
              Meet and interact in immersive virtual spaces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Choose from cozy cafes, neon streets, or abandoned places for your virtual dates and explore together in 3D.
            </p>
          </CardContent>
          <CardFooter>
            {user && (
              <Button variant="ghost" className="w-full" onClick={() => navigate("/explore")}>
                Explore Spaces
              </Button>
            )}
          </CardFooter>
        </Card>
        
        <Card className="bg-accent/50 border-accent">
          <CardHeader>
            <Users className="h-12 w-12 text-primary mb-2" />
            <CardTitle>Avatar Creation</CardTitle>
            <CardDescription>
              Express yourself with customizable 3D avatars
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create and personalize your 3D avatar to represent yourself in the virtual dating environments.
            </p>
          </CardContent>
          <CardFooter>
            {user && (
              <Button variant="ghost" className="w-full" onClick={() => navigate("/profile")}>
                Customize Avatar
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      <div className="text-center max-w-2xl mx-auto mt-20">
        <h2 className="text-2xl font-bold mb-4">Ready to experience dating in a new dimension?</h2>
        <p className="text-muted-foreground mb-6">
          Join VibeVerse today and start connecting with people who truly match your vibe.
        </p>
        
        {!user ? (
          <Button size="lg" onClick={() => navigate("/signup")}>
            Get Started Now
          </Button>
        ) : (
          <Button size="lg" onClick={() => navigate("/explore")}>
            Start Exploring
          </Button>
        )}
      </div>
    </div>
  );
}
