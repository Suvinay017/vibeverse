import { useEffect, useState } from "react";
import { useAudio } from "./lib/stores/useAudio";
import { useAuth } from "./lib/stores/useAuth";
import Navigation from "./components/layout/Navigation";
import "@fontsource/inter";

// Main App component
function App({ children }: { children: React.ReactNode }) {
  const { fetchCurrentUser, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { setBackgroundMusic } = useAudio();

  // Initialize app and load audio
  useEffect(() => {
    // Load audio files
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    setBackgroundMusic(backgroundMusic);
    
    // Try to get current user from session
    const initApp = async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initApp();
  }, [fetchCurrentUser, setBackgroundMusic]);

  // Set user ID in window for global access
  useEffect(() => {
    if (user) {
      window.__USER_ID__ = user.id;
    } else {
      delete window.__USER_ID__;
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="text-2xl font-bold text-primary animate-pulse">
          Loading VibeVerse...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-background">
      <Navigation />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default App;
