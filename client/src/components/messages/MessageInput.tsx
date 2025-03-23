import { useState } from "react";
import { useMessages } from "@/lib/stores/useMessages";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { toast } from "sonner";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const { selectedUserId, sendMessage, isLoading } = useMessages();
  
  const handleSend = async () => {
    if (!message.trim()) return;
    if (!selectedUserId) {
      toast.error("Please select a user to message");
      return;
    }
    
    try {
      await sendMessage(selectedUserId, message.trim());
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  if (!selectedUserId) {
    return null;
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <Textarea
          placeholder="Type your message..."
          className="min-h-[80px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
      </CardContent>
      <CardFooter className="justify-end pt-0">
        <Button onClick={handleSend} disabled={isLoading || !message.trim()}>
          <SendHorizontal className="mr-2 h-4 w-4" />
          Send
        </Button>
      </CardFooter>
    </Card>
  );
}
