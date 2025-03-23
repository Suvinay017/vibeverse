import { Link, useLocation } from "wouter";
import { Moon, Sun, Music, Heart, LogOut, UserCircle, MessageSquare, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { useAuth } from "@/lib/stores/useAuth";
import { useAudio } from "@/lib/stores/useAudio";

export default function Navigation() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { isMuted, toggleMute } = useAudio();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const navLinks = user ? [
    { href: "/", label: "Home", icon: <Heart className="h-5 w-5" /> },
    { href: "/explore", label: "Explore", icon: <Compass className="h-5 w-5" /> },
    { href: "/match", label: "Match", icon: <Music className="h-5 w-5" /> },
    { href: "/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" /> },
    { href: "/profile", label: "Profile", icon: <UserCircle className="h-5 w-5" /> },
  ] : [
    { href: "/", label: "Home", icon: <Heart className="h-5 w-5" /> },
  ];

  return (
    <header className="bg-sidebar border-b border-sidebar-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Link href="/">
            <a className="flex items-center space-x-2 text-sidebar-foreground">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="text-xl font-bold">VibeVerse</span>
            </a>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`px-3 py-2 rounded-md flex items-center space-x-1 transition-colors
                  ${location === link.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="text-sidebar-foreground"
          >
            {isMuted ? (
              <Music className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Music className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            className="text-sidebar-foreground"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Logout"
              className="text-sidebar-foreground"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-sidebar-border">
        <div className="grid grid-cols-5 gap-1 p-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={`p-2 flex flex-col items-center justify-center text-xs rounded-md
                  ${location === link.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                  }`}
              >
                {link.icon}
                <span className="mt-1">{link.label}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
