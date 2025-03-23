import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useAuth } from "@/lib/stores/useAuth";
import { useProfile, vibeCategories } from "@/lib/stores/useProfile";
import { toast } from "sonner";

const profileSchema = z.object({
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  newVibe: z.string().max(20, "Vibe tag cannot exceed 20 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { user } = useAuth();
  const { updateProfile, isUpdating, error, clearError } = useProfile();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: user?.bio || "",
      newVibe: "",
    },
  });
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile({
        bio: data.bio || user?.bio,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };
  
  const handleAddVibe = async () => {
    const newVibe = form.getValues("newVibe");
    if (!newVibe) return;
    
    const currentVibes = user?.vibes || [];
    
    if (currentVibes.includes(newVibe)) {
      toast.error("This vibe is already added");
      return;
    }
    
    if (currentVibes.length >= 10) {
      toast.error("You can only add up to 10 vibes");
      return;
    }
    
    try {
      await updateProfile({
        vibes: [...currentVibes, newVibe],
      });
      form.setValue("newVibe", "");
      toast.success("Vibe added successfully!");
    } catch (error) {
      toast.error("Failed to add vibe");
    }
  };
  
  const handleRemoveVibe = async (vibe: string) => {
    const currentVibes = user?.vibes || [];
    
    try {
      await updateProfile({
        vibes: currentVibes.filter(v => v !== vibe),
      });
      toast.success("Vibe removed successfully!");
    } catch (error) {
      toast.error("Failed to remove vibe");
    }
  };
  
  const handleAddSuggestedVibe = async (vibe: string) => {
    const currentVibes = user?.vibes || [];
    
    if (currentVibes.includes(vibe)) {
      toast.error("This vibe is already added");
      return;
    }
    
    if (currentVibes.length >= 10) {
      toast.error("You can only add up to 10 vibes");
      return;
    }
    
    try {
      await updateProfile({
        vibes: [...currentVibes, vibe],
      });
      toast.success("Vibe added successfully!");
    } catch (error) {
      toast.error("Failed to add vibe");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your profile information and vibes
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/20 text-destructive p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Your Vibes</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {user?.vibes && user.vibes.length > 0 ? (
              user.vibes.map((vibe) => (
                <Badge key={vibe} variant="secondary" className="px-3 py-1 text-sm">
                  {vibe}
                  <button
                    type="button"
                    onClick={() => handleRemoveVibe(vibe)}
                    className="ml-2 h-4 w-4 rounded-full hover:bg-destructive/20 inline-flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No vibes added yet. Add some to find better matches!
              </p>
            )}
          </div>
          
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add a vibe tag"
              {...form.register("newVibe")}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddVibe}
              disabled={isUpdating}
            >
              Add
            </Button>
          </div>
          
          <div className="space-y-4">
            {vibeCategories.map((category) => (
              <div key={category.id}>
                <h4 className="text-sm font-medium mb-2">{category.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={user?.vibes?.includes(tag) ? "secondary" : "outline"}
                      className="px-3 py-1 text-sm cursor-pointer"
                      onClick={() => handleAddSuggestedVibe(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
