import { useEffect } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/stores/useAuth";
import VibeMatch from "@/components/matching/VibeMatch";
import MusicMatch from "@/components/matching/MusicMatch";
import { Heart, Music } from "lucide-react";

export default function Match() {
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
        <h1 className="text-3xl font-bold">Find Your Matches</h1>
        <p className="text-muted-foreground mt-2">
          Discover people who share your vibes and music taste
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Tabs defaultValue="vibe">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="vibe" className="flex items-center gap-2 w-full">
                <Heart className="h-4 w-4" />
                <span>Vibe Matching</span>
              </TabsTrigger>
              <TabsTrigger value="music" className="flex items-center gap-2 w-full">
                <Music className="h-4 w-4" />
                <span>Music Matching</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="vibe">
              <VibeMatch />
            </TabsContent>
            
            <TabsContent value="music">
              <MusicMatch />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How Matching Works</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-primary" />
                  Vibe Matching
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Our vibe matching system analyzes the tags and interests you've added to your profile 
                  to find people with similar aesthetics, hobbies, and energy. The more vibes you add, 
                  the better matches we can find for you.
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium flex items-center">
                  <Music className="h-4 w-4 mr-2 text-primary" />
                  Music Matching
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  By connecting your Spotify account, we can analyze your listening habits and favorite artists 
                  to match you with people who have similar music taste. Music can be a powerful way to connect 
                  with others who share your emotional and cultural preferences.
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium">Match Scores</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Match scores are calculated based on the number of overlapping interests, vibes, and musical preferences. 
                  A higher score means a stronger potential connection. We recommend focusing on matches with a score of 
                  70% or higher for the best experience.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Match Stats</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Vibe Match Score (Avg):</span>
                <span className="font-medium">78%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Music Match Score (Avg):</span>
                <span className="font-medium">65%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Matches:</span>
                <span className="font-medium">5</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Requests:</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
