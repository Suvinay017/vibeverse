import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/lib/stores/useAuth";
import { useSpotify } from "@/lib/stores/useSpotify";
import ProfileForm from "@/components/profile/ProfileForm";
import AvatarPreview from "@/components/profile/AvatarPreview";
import { Music, Info, AlertCircle } from "lucide-react";

export default function Profile() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { isConnected, authUrl, getAuthUrl, topTracks, fetchTopTracks, isLoading } = useSpotify();
  
  const [activeTab, setActiveTab] = useState("profile");
  
  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }
  
  const handleConnectSpotify = () => {
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      getAuthUrl();
    }
  };
  
  const handleRefreshTracks = () => {
    fetchTopTracks();
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        
        <TabsContent value="avatar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AvatarPreview />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>About Your Avatar</CardTitle>
                <CardDescription>
                  Your virtual representation in 3D environments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Your avatar will represent you in virtual dating environments. 
                  Customize it to express your personality and style.
                </p>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Try your avatar in 3D</AlertTitle>
                  <AlertDescription>
                    Visit the Explore section to see your avatar in action within 
                    different virtual environments.
                  </AlertDescription>
                </Alert>
                
                <div className="mt-6">
                  <Button onClick={() => navigate("/explore")}>
                    Explore Environments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="music">
          <Card>
            <CardHeader>
              <CardTitle>Music Preferences</CardTitle>
              <CardDescription>
                Connect your Spotify account to match with users who share your music taste
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="text-center p-6">
                  <Music className="h-16 w-16 mx-auto text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Connect Your Spotify</h3>
                  <p className="text-muted-foreground mb-6">
                    Link your Spotify account to find matches based on your favorite artists, genres, and tracks.
                  </p>
                  <Button onClick={handleConnectSpotify}>
                    <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                      <path
                        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                        fill="#1DB954"
                      />
                    </svg>
                    Connect with Spotify
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium">Your Top Tracks</h3>
                    <Button variant="outline" size="sm" onClick={handleRefreshTracks} disabled={isLoading}>
                      Refresh
                    </Button>
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">Loading your music preferences...</p>
                    </div>
                  ) : topTracks.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No tracks found</AlertTitle>
                      <AlertDescription>
                        We couldn't find your top tracks. Make sure your Spotify account has listening history.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {topTracks.map((track) => (
                        <Card key={track.id} className="bg-accent/20">
                          <CardContent className="p-4 flex items-center">
                            <div className="bg-accent rounded-md p-2 mr-3">
                              <Music className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">{track.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {track.artists.map(a => a.name).join(", ")}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <Button onClick={() => navigate("/match")}>
                      Find Music Matches
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
