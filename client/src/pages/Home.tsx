import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/lib/stores/useAuth";
import { useAudio } from "@/lib/stores/useAudio";
import { Music, Gamepad2, Map, Users, Heart, Star, Headphones, 
         MessageSquare, LogOut, Moon, Sun, Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const [_, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { backgroundMusic, isMuted, toggleMute } = useAudio();
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [volume, setVolume] = useState(50);
  
  const carouselItems = [
    {
      title: "Find Your Player Two",
      description: "Connect with gamers and like-minded individuals in immersive 3D environments.",
      gradient: "from-cyan-500 to-blue-600",
      image: null
    },
    {
      title: "Level Up Your Dating Experience",
      description: "Immersive 3D environments designed for gamers and explorers",
      gradient: "from-purple-500 to-pink-600",
      image: null
    },
    {
      title: "Find Your Exploration Crew",
      description: "Connect with others who share your passion for exploration and adventure",
      gradient: "from-green-500 to-teal-600",
      image: null
    },
    {
      title: "Match Your Soundtrack",
      description: "Music brings people together - find your harmony with others who share your taste",
      gradient: "from-pink-500 to-purple-600",
      image: null
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  useEffect(() => {
    // Start background music when component mounts
    if (backgroundMusic) {
      backgroundMusic.volume = volume / 100;
      if (!isMuted) {
        backgroundMusic.play().catch(err => {
          console.error("Failed to play audio:", err);
        });
      }
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
  
  // Update volume when slider changes
  useEffect(() => {
    if (backgroundMusic) {
      backgroundMusic.volume = volume / 100;
    }
  }, [volume, backgroundMusic]);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselItems.length]);
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-slate-900'}`}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-20"></div>
        
        {/* Animated stars in background */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.7,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate ${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* App Bar with theme toggle and music controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="bg-background/20 backdrop-blur-lg rounded-full text-white hover:text-white hover:bg-background/30"
        >
          {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="bg-background/20 backdrop-blur-lg rounded-full text-white hover:text-white hover:bg-background/30"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        
        {user && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="bg-background/20 backdrop-blur-lg rounded-full text-white hover:text-white hover:bg-background/30"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Volume Controls */}
      {!isMuted && (
        <div className="fixed bottom-4 right-4 z-50 p-3 bg-background/30 backdrop-blur-lg rounded-lg">
          <div className="w-32 flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-white" />
            <Slider 
              value={[volume]} 
              max={100} 
              step={1} 
              className="flex-1"
              onValueChange={(vals) => setVolume(vals[0])} 
            />
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section - Inspired by NexusLink */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="flex flex-col max-w-xl">
            <div className="mb-2 text-sm font-medium px-3 py-1 bg-secondary/20 text-secondary rounded-full w-fit">
              <Gamepad2 className="inline-block w-4 h-4 mr-1" /> GAMING COMMUNITY
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              {carouselItems[carouselIndex].title.split(' ').map((word, i, arr) => 
                i === arr.length - 1 ? (
                  <span key={i} className={`bg-clip-text text-transparent bg-gradient-to-r ${carouselItems[carouselIndex].gradient}`}>
                    {word}
                  </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>
            
            <p className="text-lg mb-8 text-muted-foreground">
              {carouselItems[carouselIndex].description}
            </p>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">10K+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">50+ Gaming Communities</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Music Matching</span>
              </div>
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex gap-2 mb-8">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === carouselIndex 
                      ? `bg-secondary w-8` 
                      : `bg-secondary/40`
                  }`}
                />
              ))}
            </div>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/signup")}
                  className="bg-secondary hover:bg-secondary/90 text-white font-medium"
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/explore")} 
                  className="border-secondary text-secondary hover:bg-secondary/10"
                >
                  Explore Worlds
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/explore")}
                  className="bg-secondary hover:bg-secondary/90 text-white font-medium"
                >
                  Explore Worlds
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate("/match")}
                  className="border-secondary text-secondary hover:bg-secondary/10"
                >
                  Find Matches
                </Button>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-secondary/20 to-purple-900/20 p-6 rounded-xl w-full max-w-md h-80 flex items-center justify-center border border-secondary/20 backdrop-blur-sm">
            {/* Heart with stars effect */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center animate-pulse-slow">
                <Heart className="h-40 w-40 text-secondary/40" fill="rgba(139, 92, 246, 0.1)" />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-70px)`,
                    }}
                  >
                    <Star className="h-4 w-4 text-yellow-300/80" fill="rgba(253, 224, 71, 0.5)" />
                  </div>
                ))}
              </div>
              
              <div className="z-10">
                <Heart className="h-32 w-32 text-secondary" fill="rgba(139, 92, 246, 0.5)" />
              </div>
              
              {/* Orbiting small planets/asteroids */}
              <div className="absolute inset-0 flex items-center justify-center animate-reverse-spin-slow">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-gradient-to-br from-purple-400 to-indigo-600"
                    style={{
                      transform: `rotate(${i * 120}deg) translateY(-100px)`,
                      width: `${10 + i * 2}px`,
                      height: `${10 + i * 2}px`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature Cards Section */}
        <div className="mt-20 mb-16">
          <h2 className="text-2xl font-bold mb-4 text-center">Level Up Your Dating Experience</h2>
          <p className="text-center text-muted-foreground mb-10">Immersive 3D environments designed for gamers and explorers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="bg-black/60 border border-secondary/20 overflow-hidden backdrop-blur-sm hover:bg-black/80 transition-all">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Customizable 3D Avatars</CardTitle>
                <CardDescription>
                  Create and personalize your 3D avatar with gaming-inspired gear and accessories
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-black/60 border border-secondary/20 overflow-hidden backdrop-blur-sm hover:bg-black/80 transition-all">
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
            
            <Card className="bg-black/60 border border-secondary/20 overflow-hidden backdrop-blur-sm hover:bg-black/80 transition-all">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Immersive Chat</CardTitle>
                <CardDescription>
                  Text, voice, and 3D emotes with gaming references and memes
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-black/60 border border-secondary/20 overflow-hidden backdrop-blur-sm hover:bg-black/80 transition-all">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Gamepad2 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Third-Person Dates</CardTitle>
                <CardDescription>
                  Experience dates from a third-person perspective in our 3D cafe and other venues
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-black/60 border border-secondary/20 overflow-hidden backdrop-blur-sm hover:bg-black/80 transition-all">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Music Matching</CardTitle>
                <CardDescription>
                  Connect with others who share your music taste, from game soundtracks to your favorite genres
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-black/60 border border-secondary/20 overflow-hidden backdrop-blur-sm hover:bg-black/80 transition-all">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Gamepad2 className="h-6 w-6 text-secondary" />
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
              className="bg-secondary hover:bg-secondary/90 text-white font-medium"
            >
              Get Started Now
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={() => navigate("/explore")}
              className="bg-secondary hover:bg-secondary/90 text-white font-medium"
            >
              Start Exploring
            </Button>
          )}
        </div>
      </div>
      
      {/* Add some animation keyframes to the stylesheet */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }
        
        @keyframes pulse-slow {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes reverse-spin-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 5s infinite ease-in-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 30s infinite linear;
        }
        
        .animate-reverse-spin-slow {
          animation: reverse-spin-slow 40s infinite linear;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
}
