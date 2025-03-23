import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/stores/useAuth";
import { Mail, Lock, LogIn, Gamepad2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [_, setLocation] = useLocation();
  const { loginWithServer, loginWithGoogle, isLoading, error, clearError } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginWithServer(data.username, data.password);
      setLocation("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setLocation("/");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-destructive/20 text-destructive p-3 rounded-md mb-4 text-sm">
          <p className="font-medium">Login Failed</p>
          <p>{error}</p>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">
                  USERNAME
                </FormLabel>
                <FormControl>
                  <div className="flex items-center border border-border/60 bg-background/50 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                    <div className="pl-3 text-muted-foreground">
                      <Gamepad2 className="h-4 w-4" />
                    </div>
                    <Input
                      placeholder="Enter your gamer tag"
                      className="border-0 focus-visible:ring-0 bg-transparent"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-muted-foreground">
                  PASSWORD
                </FormLabel>
                <FormControl>
                  <div className="flex items-center border border-border/60 bg-background/50 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                    <div className="pl-3 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      type="password"
                      placeholder="Enter your secret key"
                      className="border-0 focus-visible:ring-0 bg-transparent"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-primary hover:text-primary/90"
              onClick={() => {}}
            >
              Forgot password?
            </button>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-pulse mr-2">●</span>
                CONNECTING...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                LOGIN
              </>
            )}
          </Button>
        </form>
      </Form>
      
      <div className="my-5 flex items-center">
        <Separator className="flex-1 bg-border/40" />
        <span className="mx-2 text-xs text-muted-foreground">OTHER OPTIONS</span>
        <Separator className="flex-1 bg-border/40" />
      </div>
      
      <Button
        variant="outline"
        className="w-full border-border/40 bg-background/50 hover:bg-primary/10 hover:text-primary"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        SIGN IN WITH GOOGLE
      </Button>
    </div>
  );
}
