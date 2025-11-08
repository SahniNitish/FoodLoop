import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantChatProps {
  onClose?: () => void;
}

export default function AIAssistantChat({ onClose }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI assistant. I can help you post food, understand quality scores, and find optimal pickup times. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const quickActions = [
    "How to post food?",
    "Quality guidelines",
    "Safety info",
    "Optimal pickup times",
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages([...messages, userMessage]);
    setInput("");

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I understand you're asking about " + input + ". Let me help you with that...",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <Card className="w-full max-w-md h-[500px] flex flex-col" data-testid="card-ai-chat">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">AI Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs mt-1">
                <span className="w-2 h-2 bg-primary rounded-full mr-1 animate-pulse" />
                Online
              </Badge>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-chat">
              <span className="material-icons">close</span>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "assistant" ? "bg-primary/10" : "bg-muted"
                }`}>
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`rounded-md p-3 max-w-[80%] ${
                    message.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover-elevate"
                onClick={() => handleQuickAction(action)}
                data-testid={`badge-quick-action-${index}`}
              >
                {action}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              data-testid="input-chat-message"
            />
            <Button size="icon" onClick={handleSend} data-testid="button-send-message">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
