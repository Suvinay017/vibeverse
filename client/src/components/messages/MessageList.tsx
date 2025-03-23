import { useEffect, useRef } from "react";
import { useMessages } from "@/lib/stores/useMessages";
import { useAuth } from "@/lib/stores/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export default function MessageList() {
  const { messages, chatPartners, selectedUserId, selectUser, fetchChatPartners } = useMessages();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchChatPartners();
  }, [fetchChatPartners]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  // If no chat partners, show empty state
  if (chatPartners.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground">
              Match with other users to start conversations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get selected chat partner
  const selectedPartner = chatPartners.find(partner => partner.id === selectedUserId);
  
  return (
    <Card className="h-[600px] flex flex-col">
      <div className="grid grid-cols-3 h-full">
        {/* Chat partners list */}
        <div className="border-r">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Messages</CardTitle>
            <CardDescription>Your conversations</CardDescription>
          </CardHeader>
          
          <ScrollArea className="h-[calc(600px-73px)]">
            {chatPartners.map(partner => (
              <div
                key={partner.id}
                className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${
                  selectedUserId === partner.id ? "bg-accent" : ""
                }`}
                onClick={() => selectUser(partner.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {partner.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{partner.username}</div>
                    <div className="text-xs text-muted-foreground">
                      {partner.vibes && partner.vibes.length > 0
                        ? partner.vibes.slice(0, 2).join(", ")
                        : "No vibes"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        
        {/* Messages area */}
        <div className="col-span-2 flex flex-col h-full">
          {selectedPartner ? (
            <>
              <CardHeader className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedPartner.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedPartner.username}</CardTitle>
                    <CardDescription>
                      {selectedPartner.vibes && selectedPartner.vibes.length > 0
                        ? selectedPartner.vibes.slice(0, 3).join(", ")
                        : "No vibes"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">
                        No messages yet. Start the conversation!
                      </p>
                    </div>
                  ) : (
                    messages.map(message => {
                      const isCurrentUser = message.senderId === user?.id;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="text-sm">{message.content}</div>
                            <div className="text-xs mt-1 opacity-70">
                              {formatDistanceToNow(new Date(message.timestamp), {
                                addSuffix: true,
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <h3 className="text-xl font-semibold mb-2">Select a Conversation</h3>
                <p className="text-muted-foreground">
                  Choose a match to start messaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
