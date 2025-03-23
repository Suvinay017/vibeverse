import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMessages } from "@/lib/stores/useMessages";
import { useAuth } from "@/lib/stores/useAuth";
import { Card } from "@/components/ui/card";
import MessageList from "@/components/messages/MessageList";
import MessageInput from "@/components/messages/MessageInput";

export default function Messages() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  const { fetchChatPartners } = useMessages();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Fetch chat partners when component mounts
    fetchChatPartners();
  }, [user, navigate, fetchChatPartners]);
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-2">
          Chat with your matches and connections
        </p>
      </div>
      
      <div className="space-y-4">
        <MessageList />
        <MessageInput />
      </div>
    </div>
  );
}
