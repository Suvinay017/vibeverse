import { useEffect } from "react";
import { useMatching } from "@/lib/stores/useMatching";
import { useSpotify } from "@/lib/stores/useSpotify";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Music, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function MusicMatch() {
  const { musicMatches, fetchMusicMatches, isLoading: matchesLoading, error: matchesError } = useMatching();
  const { isConnected, authUrl, getAuthUrl, isLoading: spotifyLoading, error: spotifyError } = useSpotify();
  
  useEffect(() => {
    if (isConnected) {
      fetchMusicMatches();
    } else {
      getAuthUrl();
    }
  }, [isConnected, fetchMusicMatches, getAuthUrl]);
  
  const handleConnectSpotify = () => {
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      getAuthUrl();
    }
  };
  
  const handleAccept = async (userId: number) => {
    try {
      // Create match in backend - in a real app we'd have an API for this
      // For now, just show toast
      toast.success("Match request sent!");
    } catch (error) {
      toast.error("Failed to send match request");
    }
  };
  
  const handleReject = async (userId: number) => {
    try {
      // Reject match in backend - in a real app we'd have an API for this
      // For now, just show toast
      toast.info("Profile skipped");
    } catch (error) {
      toast.error("Failed to skip profile");
    }
  };
  
  // Show Spotify connection UI if not connected
  if (!isConnected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <Music className="mx-auto h-12 w-12 text-primary" />
            <h3 className="text-xl font-semibold mt-4 mb-2">Connect Your Spotify</h3>
            <p className="text-muted-foreground mb-4">
              Connect your Spotify account to find matches based on your music taste.
            </p>
            <Button onClick={handleConnectSpotify} disabled={spotifyLoading}>
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                <path
                  d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                  fill="#1DB954"
                />
              </svg>
              Connect with Spotify
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (matchesError || spotifyError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-4">
            <div className="bg-destructive/20 text-destructive p-3 rounded-md mb-4">
              {matchesError || spotifyError}
            </div>
            <Button onClick={() => fetchMusicMatches()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (matchesLoading || spotifyLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full rounded-md" />
          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 w-full">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </CardFooter>
      </Card>
    );
  }
  
  if (!musicMatches || musicMatches.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-xl font-semibold mb-2">No Music Matches Found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any users with similar music taste yet. Check back later!
            </p>
            <Button onClick={() => fetchMusicMatches()}>Refresh</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show the first match
  const match = musicMatches[0];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{match.user.username}</CardTitle>
        <CardDescription>Music Match Score: {match.score}%</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={match.score} className="h-2" />
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Bio</h3>
            <p className="text-sm text-muted-foreground">
              {match.user.bio || "No bio provided"}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Music Taste</h3>
            <div className="text-sm text-muted-foreground">
              You both enjoy similar artists and tracks!
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Vibes</h3>
            <div className="flex flex-wrap gap-2">
              {match.user.vibes?.map(vibe => (
                <Badge key={vibe} variant="outline">
                  {vibe}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-3 w-full">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => handleReject(match.user.id)}
          >
            <X className="mr-2 h-4 w-4" />
            Skip
          </Button>
          <Button 
            className="w-full"
            onClick={() => handleAccept(match.user.id)}
          >
            <Check className="mr-2 h-4 w-4" />
            Connect
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
