import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scene } from "@/components/three/Scene";
import { useAuth } from "@/lib/stores/useAuth";
import { useEnvironment } from "@/lib/stores/useEnvironment";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, MessageSquare, Mic, MicOff, Camera, CameraOff, Heart, X, Clock } from "lucide-react";
import { toast } from "sonner";

export default function Date() {
  const { id: environmentId } = useParams();
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { environments, currentEnvironment, loadingEnvironment, selectEnvironment } = useEnvironment();
  
  const [participants, setParticipants] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isCameraOff, setIsCameraOff] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{user: string, content: string, time: Date}[]>([]);
  const [showIntroDialog, setShowIntroDialog] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Load the environment
    if (environmentId) {
      selectEnvironment(environmentId);
    }

    // Mock some participants for demo purposes
    generateParticipants();

    // Cleanup function
    return () => {
      // Any cleanup needed when leaving the environment
    };
  }, [user, navigate, environmentId, selectEnvironment]);

  // Generate some mock participants that would be real users in a full implementation
  const generateParticipants = () => {
    // In a real app, this would come from a WebSocket or API call
    const mockParticipants = [
      {
        id: 101,
        username: "SkyDreamer",
        bio: "Adventure seeker and music lover",
        vibes: ["Adventure", "Music", "Outdoors"],
        avatarConfig: {
          hairStyle: 1,
          hairColor: "#8d4a43",
          skinTone: "#e5aa70",
          eyeColor: "#5566ff",
          outfit: 1,
          accessories: [2]
        }
      },
      {
        id: 102,
        username: "NeonWanderer",
        bio: "Cyberpunk enthusiast and electronic music producer",
        vibes: ["Cyberpunk", "Electronic", "Creative"],
        avatarConfig: {
          hairStyle: 2,
          hairColor: "#5566ff",
          skinTone: "#c68642",
          eyeColor: "#55aa55",
          outfit: 2,
          accessories: [1, 4]
        }
      },
      {
        id: 103,
        username: "VintageVibe",
        bio: "Lover of all things retro and vintage",
        vibes: ["Vintage", "Retro", "Fashion"],
        avatarConfig: {
          hairStyle: 0,
          hairColor: "#e6be8a",
          skinTone: "#ffdbac",
          eyeColor: "#3d2314",
          outfit: 3,
          accessories: [0]
        }
      }
    ];
    
    setParticipants(mockParticipants);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add message to the chat
    const newMessage = {
      user: user?.username || "You",
      content: chatInput.trim(),
      time: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    // In a real app, we would send this to a real-time messaging service
    
    // Simulate a response after a brief delay
    setTimeout(() => {
      if (participants.length > 0) {
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        const responses = [
          "Hey there! How are you enjoying this place?",
          "I love the vibe here, don't you?",
          "Have you checked out the other areas yet?",
          "What kind of music do you listen to?",
          "Nice to meet you in this virtual world!"
        ];
        const responseMessage = {
          user: randomParticipant.username,
          content: responses[Math.floor(Math.random() * responses.length)],
          time: new Date()
        };
        setMessages(prev => [...prev, responseMessage]);
      }
    }, 2000 + Math.random() * 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleViewProfile = (participant: any) => {
    setSelectedUser(participant);
    setShowUserInfo(true);
  };

  const handleSendLike = (userId: number) => {
    toast.success("Like sent! They'll be notified of your interest.");
    setShowUserInfo(false);
  };

  const handleToggleMic = () => {
    setIsMicMuted(!isMicMuted);
    toast(isMicMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const handleToggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    toast(isCameraOff ? "Camera turned on" : "Camera turned off");
  };

  if (loadingEnvironment) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Loading Environment...</h2>
            <p className="text-muted-foreground">
              Preparing the virtual space for your date
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentEnvironment) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-2">Environment Not Found</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't find the environment you're looking for.
              </p>
              <Button onClick={() => navigate("/explore")}>
                Back to Explore
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] relative">
      {/* 3D Scene */}
      <div className="w-full h-full">
        <Scene 
          environmentId={environmentId} 
          participants={participants}
          currentUser={user}
        />
      </div>
      
      {/* Intro dialog */}
      <Dialog open={showIntroDialog} onOpenChange={setShowIntroDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to {currentEnvironment.name}</DialogTitle>
            <DialogDescription>
              You've entered a virtual environment where you can meet and interact with other users.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="font-medium mb-2">Controls:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>W, A, S, D or Arrow Keys - Move around</li>
              <li>Mouse - Look around</li>
              <li>Click to lock mouse pointer for better control</li>
              <li>Press ESC to unlock pointer</li>
              <li>Space - Jump</li>
              <li>E - Interact with objects</li>
            </ul>
            
            <h3 className="font-medium mt-4 mb-2">Tips:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>There are {participants.length} other users in this environment</li>
              <li>Use the chat button to communicate with everyone</li>
              <li>Click on the users list to see who's around</li>
              <li>Have fun exploring and connecting!</li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowIntroDialog(false)}>
              Start Exploring
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* User/Participant info dialog */}
      <Dialog open={showUserInfo} onOpenChange={setShowUserInfo}>
        {selectedUser && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedUser.username}</DialogTitle>
              <DialogDescription>
                User Profile
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Bio</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.bio || "No bio provided"}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Vibes</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.vibes?.map((vibe: string) => (
                    <Badge key={vibe} variant="outline">
                      {vibe}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUserInfo(false)}>
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
              <Button onClick={() => handleSendLike(selectedUser.id)}>
                <Heart className="mr-2 h-4 w-4" />
                Send Like
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* UI Controls Overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <Button 
          variant={showChat ? "default" : "outline"} 
          size="icon"
          onClick={() => setShowChat(!showChat)}
          className="bg-background/80 backdrop-blur-sm hover:bg-accent/80"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => {
            const usersListDialog = document.createElement('dialog');
            usersListDialog.innerHTML = `
              <div>
                <h2>Users in Environment (${participants.length + 1})</h2>
                <ul>
                  <li>You (${user?.username})</li>
                  ${participants.map(p => `<li>${p.username}</li>`).join('')}
                </ul>
                <button>Close</button>
              </div>
            `;
            document.body.appendChild(usersListDialog);
            usersListDialog.showModal();
            
            usersListDialog.querySelector('button')?.addEventListener('click', () => {
              usersListDialog.close();
              document.body.removeChild(usersListDialog);
            });
          }}
          className="bg-background/80 backdrop-blur-sm hover:bg-accent/80"
        >
          <Users className="h-5 w-5" />
        </Button>
        
        <Button 
          variant={isMicMuted ? "outline" : "default"}
          size="icon"
          onClick={handleToggleMic}
          className="bg-background/80 backdrop-blur-sm hover:bg-accent/80"
        >
          {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant={isCameraOff ? "outline" : "default"}
          size="icon"
          onClick={handleToggleCamera}
          className="bg-background/80 backdrop-blur-sm hover:bg-accent/80"
        >
          {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Environment Info */}
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-md">
        <h2 className="font-bold">{currentEnvironment.name}</h2>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>{participants.length + 1} users</span>
        </div>
      </div>
      
      {/* Chat Panel */}
      {showChat && (
        <div className="absolute right-4 bottom-16 w-80 bg-background/90 backdrop-blur-sm rounded-md border border-border flex flex-col">
          <div className="p-3 border-b border-border flex justify-between items-center">
            <h3 className="font-medium">Environment Chat</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowChat(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 p-3 max-h-[300px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <p>No messages yet</p>
                <p>Say hello to everyone!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.user === user?.username || msg.user === "You" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[90%] rounded-lg p-2 ${
                      msg.user === user?.username || msg.user === "You" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}>
                      <div className="text-xs font-medium mb-1">{msg.user}</div>
                      <div className="text-sm">{msg.content}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="shrink-0"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Participants List */}
      <div className="absolute left-4 top-20 bg-background/80 backdrop-blur-sm p-3 rounded-md max-w-[200px]">
        <h3 className="font-medium mb-2">Users Nearby</h3>
        <ul className="space-y-2">
          {participants.map(participant => (
            <li 
              key={participant.id}
              className="text-sm flex items-center justify-between cursor-pointer hover:bg-accent/50 p-1 rounded"
              onClick={() => handleViewProfile(participant)}
            >
              <span>{participant.username}</span>
              <Badge variant="outline" className="text-xs">View</Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
