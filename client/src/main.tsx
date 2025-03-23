import { createRoot } from "react-dom/client";
import { Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/sonner";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Match from "./pages/Match";
import Date from "./pages/Date";
import Messages from "./pages/Messages";
import NotFound from "./pages/not-found";
import "./index.css";

// Global window property for user ID
declare global {
  interface Window {
    __USER_ID__?: number;
  }
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vibeverse-theme">
      <App>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile" component={Profile} />
        <Route path="/explore" component={Explore} />
        <Route path="/match" component={Match} />
        <Route path="/date/:id" component={Date} />
        <Route path="/messages" component={Messages} />
        <Route path="/:rest*" component={NotFound} />
      </App>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  </QueryClientProvider>
);
