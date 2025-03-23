import { useEffect } from "react";
import { useMatching } from "@/lib/stores/useMatching";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/stores/useAuth";

export default function VibeMatch() {
  const { vibeMatches, fetchVibeMatches, isLoading, error, acceptMatch, rejectMatch } = useMatching();
  const { user } = useAuth();
  
  useEffect(() => {
    fetchVibeMatches();
  }, [fetchVibeMatches]);
  
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
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-4">
            <div className="bg-destructive/20 text-destructive p-3 rounded-md mb-4">
              {error}
            </div>
            <Button onClick={() => fetchVibeMatches()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isLoading) {
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
  
  if (vibeMatches.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-xl font-semibold mb-2">No Vibe Matches Found</h3>
            <p className="text-muted-foreground mb-4">
              Add more vibes to your profile to find people with similar interests.
            </p>
            <Button onClick={() => fetchVibeMatches()}>Refresh</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show the first match
  const match = vibeMatches[0];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{match.user.username}</CardTitle>
        <CardDescription>Vibe Match Score: {match.score}%</CardDescription>
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
            <h3 className="text-sm font-medium mb-2">Matching Vibes</h3>
            <div className="flex flex-wrap gap-2">
              {match.user.vibes?.map(vibe => {
                const isMatching = user?.vibes?.includes(vibe);
                return (
                  <Badge 
                    key={vibe} 
                    variant={isMatching ? "default" : "outline"}
                    className={isMatching ? "bg-primary" : ""}
                  >
                    {vibe}
                  </Badge>
                );
              })}
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
