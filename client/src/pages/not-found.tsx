import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Home, Gamepad2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [_, navigate] = useLocation();
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  const quotes = [
    {
      quote: "Sometimes the person who tries the hardest to connect is the one who feels the most alone.",
      author: "Gamer's Heart"
    },
    {
      quote: "In a world of extroverts, we introverts find our power in the quiet moments of solitude.",
      author: "Digital Soul"
    },
    {
      quote: "Like a broken game controller, a broken heart still knows which buttons were pressed too hard.",
      author: "Player Unknown"
    },
    {
      quote: "Finding your player two requires grinding through many side quests of solitude.",
      author: "Loading Life"
    },
    {
      quote: "Sometimes the greatest connections are formed in the shared silence of understanding.",
      author: "Quiet Mind"
    }
  ];
  
  useEffect(() => {
    // Set a random quote on mount
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-10"></div>
        
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-purple-500"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.5,
              animation: `float-up ${Math.random() * 15 + 10}s infinite ease-in-out ${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
      
      <Card className="w-full max-w-md mx-4 bg-black/60 border border-secondary/30 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
        <CardContent className="pt-12 pb-10 px-6">
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center animate-pulse-slow">
                <Heart className="h-24 w-24 text-secondary/20" fill="rgba(139, 92, 246, 0.05)" />
              </div>
              
              <Heart className="h-20 w-20 text-secondary/70" fill="rgba(139, 92, 246, 0.2)" />
              
              {/* Broken heart crack overlay */}
              <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden pointer-events-none">
                <div className="absolute w-1.5 h-14 bg-black rotate-45 top-3 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mt-8 mb-2 text-white">404</h1>
            <div className="bg-secondary/20 text-secondary text-sm font-medium px-3 py-1 rounded-full mb-5">
              CONNECTION LOST
            </div>
          </div>

          <div className="mb-12 text-center">
            <blockquote className="mb-6 text-lg italic text-white/90 font-medium">
              "{quotes[quoteIndex].quote}"
            </blockquote>
            <cite className="text-sm text-secondary/80 not-italic">
              — {quotes[quoteIndex].author}
            </cite>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-white font-bold"
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
            
            <Button 
              variant="outline" 
              className="border-secondary/30 text-secondary hover:bg-secondary/10"
              onClick={() => setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length)}
            >
              <Heart className="mr-2 h-4 w-4" />
              Another Quote
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-40px) rotate(180deg); opacity: 0.5; }
        }
        
        @keyframes pulse-slow {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
}
