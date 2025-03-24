import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/stores/useAuth";
import { useSpotify } from "@/lib/stores/useSpotify";
import ProfileForm from "@/components/profile/ProfileForm";
import AvatarPreview from "@/components/profile/AvatarPreview";
import { 
  Music, 
  Info, 
  AlertCircle, 
  User, 
  Trophy, 
  Heart, 
  Star, 
  Users, 
  Gamepad2, 
  Upload, 
  Shield, 
  Headphones,
  Sparkles,
  MessageSquare,
  Flame,
  Image
} from "lucide-react";

export default function Profile() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { isConnected, authUrl, getAuthUrl, topTracks, fetchTopTracks, isLoading } = useSpotify();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [activeLevel, setActiveLevel] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showPhotoUploader, setShowPhotoUploader] = useState(false);
  
  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }
  
  // Sample player stats (this would come from the database in a real app)
  const playerStats = {
    level: 8,
    experience: 3427,
    nextLevelExp: 5000,
    datesDone: 12,
    matchesTotal: 24,
    matchRate: 68,
    likesReceived: 47,
    profileViews: 182,
    memberSince: "Jan 2025"
  };

  // Sample achievements
  const achievements = [
    { 
      id: "first_match", 
      name: "First Connection", 
      description: "Found your first match", 
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      completed: true 
    },
    { 
      id: "profile_complete", 
      name: "Identity Established", 
      description: "Completed your profile information", 
      icon: <User className="h-8 w-8 text-blue-500" />,
      completed: true 
    },
    { 
      id: "music_connect", 
      name: "Sound Explorer", 
      description: "Connected your Spotify account", 
      icon: <Headphones className="h-8 w-8 text-green-500" />,
      completed: isConnected 
    },
    { 
      id: "five_matches", 
      name: "Networking Pro", 
      description: "Got 5 successful matches", 
      icon: <Users className="h-8 w-8 text-purple-500" />,
      completed: playerStats.matchesTotal >= 5 
    },
    { 
      id: "first_date", 
      name: "Virtual Dater", 
      description: "Completed your first virtual date", 
      icon: <Gamepad2 className="h-8 w-8 text-cyan-500" />,
      completed: playerStats.datesDone > 0 
    }
  ];
  
  // Sample interest tags
  const interestTags = [
    "RPG Games", "Sci-Fi", "Indie Music", "Game Development", 
    "Pixel Art", "Space Exploration", "Fantasy", "Retro Gaming",
    "Cyberpunk", "Open World"
  ];
  
  // Calculate levels and progress
  const expPercentage = (playerStats.experience / playerStats.nextLevelExp) * 100;
  
  // Handle Spotify connection
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

  // Auto advance level animation
  useEffect(() => {
    if (showAchievements) {
      const interval = setInterval(() => {
        setActiveLevel(prev => (prev + 1) % achievements.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [showAchievements, achievements.length]);
  
  return (
    <div className="min-h-screen bg-black py-10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="relative mb-10 rounded-xl overflow-hidden bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm border border-secondary/20">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-secondary"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  opacity: Math.random() * 0.5
                }}
              ></div>
            ))}
          </div>
          
          <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-secondary/30 to-primary/30 border-4 border-secondary/50 flex items-center justify-center">
                <User className="w-16 h-16 text-white/70" />
              </div>
              
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg border-2 border-black">
                {playerStats.level}
              </div>
            </div>
            
            {/* Profile Details */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-1 text-white">
                {user.username}
                <Badge className="ml-2 bg-secondary text-white">PRO GAMER</Badge>
              </h1>
              
              <p className="text-muted-foreground mb-4">
                Member since {playerStats.memberSince}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                {interestTags.slice(0, 6).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-secondary/10 text-secondary border-secondary/30"
                  >
                    {tag}
                  </Badge>
                ))}
                {interestTags.length > 6 && (
                  <Badge 
                    variant="outline" 
                    className="bg-secondary/10 text-secondary border-secondary/30"
                  >
                    +{interestTags.length - 6} more
                  </Badge>
                )}
              </div>
              
              <div className="w-full max-w-md mx-auto md:mx-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">Level {playerStats.level}</span>
                  <span className="text-xs text-muted-foreground">
                    {playerStats.experience}/{playerStats.nextLevelExp} XP
                  </span>
                </div>
                <Progress value={expPercentage} className="h-2 bg-secondary/20" />
              </div>
            </div>
            
            {/* Profile Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center mt-2">
              <Card className="bg-secondary/10 border-secondary/20">
                <CardContent className="p-3">
                  <Trophy className="h-5 w-5 mx-auto mb-1 text-secondary" />
                  <div className="text-xl font-bold">{playerStats.datesDone}</div>
                  <div className="text-xs text-muted-foreground">Dates</div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary/10 border-secondary/20">
                <CardContent className="p-3">
                  <Heart className="h-5 w-5 mx-auto mb-1 text-secondary" />
                  <div className="text-xl font-bold">{playerStats.matchesTotal}</div>
                  <div className="text-xs text-muted-foreground">Matches</div>
                </CardContent>
              </Card>
              
              <Card className="bg-secondary/10 border-secondary/20">
                <CardContent className="p-3">
                  <Flame className="h-5 w-5 mx-auto mb-1 text-secondary" />
                  <div className="text-xl font-bold">{playerStats.matchRate}%</div>
                  <div className="text-xs text-muted-foreground">Match Rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Achievement Showcase */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-secondary" />
              Player Achievements
            </h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAchievements(!showAchievements)}
              className="border-secondary/40 text-secondary hover:bg-secondary/10"
            >
              {showAchievements ? "Hide" : "Show"} All
            </Button>
          </div>
          
          {!showAchievements ? (
            <div className="flex flex-wrap gap-4">
              {achievements.filter(a => a.completed).slice(0, 5).map((achievement, index) => (
                <Card key={index} className="w-28 bg-black/60 border border-secondary/20 backdrop-blur-sm">
                  <CardContent className="p-3 text-center">
                    <div className="h-16 flex items-center justify-center mb-2">
                      {achievement.icon}
                    </div>
                    <h3 className="text-xs font-semibold mb-1 line-clamp-1">{achievement.name}</h3>
                  </CardContent>
                </Card>
              ))}
              
              {achievements.filter(a => a.completed).length === 0 && (
                <div className="w-full text-center p-6 border border-dashed border-secondary/30 rounded-lg">
                  <AlertCircle className="h-10 w-10 mx-auto mb-2 text-secondary/50" />
                  <h3 className="text-lg font-medium mb-1">No Achievements Yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Complete activities to earn your first achievement!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <Card 
                  key={index} 
                  className={`relative overflow-hidden transition-all duration-300 ${
                    index === activeLevel
                      ? "border-secondary bg-secondary/10"
                      : achievement.completed
                        ? "bg-black/60 border-secondary/20"
                        : "bg-black/40 border-gray-800/50 opacity-75"
                  }`}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                      achievement.completed 
                        ? "bg-secondary/20" 
                        : "bg-gray-800/50"
                    }`}>
                      {achievement.icon}
                    </div>
                    
                    <div>
                      <h3 className={`font-bold mb-1 ${
                        !achievement.completed && "text-muted-foreground"
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    
                    {achievement.completed && (
                      <div className="absolute top-2 right-2">
                        <Sparkles className="h-4 w-4 text-secondary" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Main Profile Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-10">
          <TabsList className="mb-6 p-1 bg-background/20 backdrop-blur-sm">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-secondary data-[state=active]:text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="avatar"
              className="data-[state=active]:bg-secondary data-[state=active]:text-white"
            >
              <Gamepad2 className="h-4 w-4 mr-2" />
              3D Avatar
            </TabsTrigger>
            <TabsTrigger 
              value="gallery"
              className="data-[state=active]:bg-secondary data-[state=active]:text-white"
            >
              <Image className="h-4 w-4 mr-2" />
              Photos
            </TabsTrigger>
            <TabsTrigger 
              value="music"
              className="data-[state=active]:bg-secondary data-[state=active]:text-white"
            >
              <Music className="h-4 w-4 mr-2" />
              Music
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="avatar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/60 border border-secondary/20 backdrop-blur-sm overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-secondary/20">
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-secondary" />
                    3D Avatar Preview
                  </CardTitle>
                  <CardDescription>
                    Your virtual representation in immersive environments
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[350px] flex items-center justify-center bg-gradient-to-b from-transparent to-secondary/5">
                  <AvatarPreview />
                </CardContent>
                <CardFooter className="bg-black/40 border-t border-secondary/20 py-3">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Preview Mode</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-secondary/40 text-secondary hover:bg-secondary/10"
                    >
                      Edit Avatar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              <div className="space-y-6">
                <Card className="bg-black/60 border border-secondary/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Gamepad2 className="h-5 w-5 mr-2 text-secondary" />
                      Avatar Customization
                    </CardTitle>
                    <CardDescription>
                      Create a unique identity for the virtual world
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert className="bg-secondary/5 border border-secondary/30">
                      <Sparkles className="h-4 w-4 text-secondary" />
                      <AlertTitle>Advanced Customization</AlertTitle>
                      <AlertDescription className="text-sm">
                        Our 3D avatar system supports high-fidelity character models with realistic features. Change hairstyles, outfits, accessories and more to express yourself.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Button className="w-full bg-secondary hover:bg-secondary/90">
                        Customize Body
                      </Button>
                      <Button className="w-full bg-secondary hover:bg-secondary/90">
                        Change Outfit
                      </Button>
                      <Button className="w-full bg-secondary hover:bg-secondary/90">
                        Edit Face
                      </Button>
                      <Button className="w-full bg-secondary hover:bg-secondary/90">
                        Add Accessories
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/60 border border-secondary/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-secondary" />
                      Try Your Avatar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Enter virtual environments to see your avatar in action and interact with others in immersive 3D worlds.
                    </p>
                    
                    <Button 
                      className="w-full bg-secondary hover:bg-secondary/90"
                      onClick={() => navigate("/explore")}
                    >
                      Explore Environments
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <Card className="bg-black/60 border border-secondary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="h-5 w-5 mr-2 text-secondary" />
                  Your Photos
                </CardTitle>
                <CardDescription>
                  Share photos of yourself to enhance your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showPhotoUploader ? (
                  <div className="text-center p-10 border border-dashed border-secondary/30 rounded-lg">
                    <Image className="h-16 w-16 mx-auto text-secondary/40 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Photos Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Add photos to your profile to help others get to know you better
                    </p>
                    <Button 
                      className="bg-secondary hover:bg-secondary/90"
                      onClick={() => setShowPhotoUploader(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photos
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 border border-dashed border-secondary/30 rounded-lg text-center">
                      <Upload className="h-10 w-10 mx-auto text-secondary/40 mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your photos here, or click to browse
                      </p>
                      <input type="file" className="hidden" id="photo-upload" />
                      <Button 
                        className="bg-secondary hover:bg-secondary/90"
                        onClick={() => document.getElementById('photo-upload')?.click()}
                      >
                        Choose Files
                      </Button>
                    </div>
                    
                    <Alert className="bg-secondary/5 border border-secondary/30">
                      <Info className="h-4 w-4 text-secondary" />
                      <AlertTitle>Photo Guidelines</AlertTitle>
                      <AlertDescription className="text-sm">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Clear photos of yourself</li>
                          <li>Maximum 6 photos per profile</li>
                          <li>No explicit content</li>
                          <li>Maximum size: 5MB per photo</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="border-secondary/40 text-secondary hover:bg-secondary/10 mr-2"
                        onClick={() => setShowPhotoUploader(false)}
                      >
                        Cancel
                      </Button>
                      <Button className="bg-secondary hover:bg-secondary/90">
                        Save Photos
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="music">
            <Card className="bg-black/60 border border-secondary/20 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-secondary/20">
                <CardTitle className="flex items-center">
                  <Headphones className="h-5 w-5 mr-2 text-secondary" />
                  Music Preferences
                </CardTitle>
                <CardDescription>
                  Connect your Spotify account to match with users who share your music taste
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {!isConnected ? (
                  <div className="text-center p-6 border border-dashed border-secondary/30 rounded-lg">
                    <div className="w-20 h-20 rounded-full bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                      <svg viewBox="0 0 24 24" className="h-10 w-10 text-green-500">
                        <path
                          d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                          fill="#1DB954"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium mb-2">Connect Your Spotify</h3>
                    <p className="text-muted-foreground mb-6">
                      Link your Spotify account to find matches based on your music taste. Find players who enjoy the same game soundtracks, artists, and genres as you.
                    </p>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleConnectSpotify}
                    >
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
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-green-900/20 flex items-center justify-center mr-3">
                          <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-500">
                            <path
                              d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.66.301 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                              fill="#1DB954"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Spotify Connected</h3>
                          <p className="text-xs text-muted-foreground">Your music preferences are synced</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-secondary/40 text-secondary hover:bg-secondary/10"
                        onClick={handleRefreshTracks}
                        disabled={isLoading}
                      >
                        Refresh
                      </Button>
                    </div>
                    
                    {isLoading ? (
                      <div className="text-center p-10">
                        <div className="w-12 h-12 rounded-full border-4 border-secondary/30 border-t-secondary animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your music preferences...</p>
                      </div>
                    ) : topTracks.length === 0 ? (
                      <Alert className="bg-secondary/5 border border-secondary/30">
                        <AlertCircle className="h-4 w-4 text-secondary" />
                        <AlertTitle>No tracks found</AlertTitle>
                        <AlertDescription>
                          We couldn't find your top tracks. Make sure your Spotify account has listening history.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div>
                        <h3 className="text-lg font-medium mb-4 flex items-center">
                          <Music className="h-5 w-5 mr-2 text-secondary" />
                          Your Top Tracks
                        </h3>
                        
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                          {topTracks.map((track, index) => (
                            <Card key={track.id} className="bg-black/40 border border-secondary/20 overflow-hidden">
                              <CardContent className="p-3 flex items-center">
                                <div className="w-10 h-10 rounded-md bg-secondary/20 flex items-center justify-center mr-3 shrink-0">
                                  <Music className="h-5 w-5 text-secondary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-medium truncate">{track.name}</h4>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {track.artists.map(a => a.name).join(", ")}
                                  </p>
                                </div>
                                <div className="w-6 text-center text-muted-foreground text-xs font-mono">
                                  #{index + 1}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        
                        <Separator className="my-6 bg-secondary/20" />
                        
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Find users who share your music taste
                          </p>
                          <Button 
                            className="bg-secondary hover:bg-secondary/90"
                            onClick={() => navigate("/match")}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Find Music Matches
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <style>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
}
