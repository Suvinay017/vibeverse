import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnvironment, type Environment } from "@/lib/stores/useEnvironment";
import { ArrowRight, Users } from "lucide-react";

export default function ExploreSection() {
  const { environments } = useEnvironment();
  const [activeUsers, setActiveUsers] = useState<Record<string, number>>({});
  
  // Simulate active users in each environment
  useEffect(() => {
    const users: Record<string, number> = {};
    
    environments.forEach(env => {
      // Random number of users between 3 and 15
      users[env.id] = Math.floor(Math.random() * 12) + 3;
    });
    
    setActiveUsers(users);
  }, [environments]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {environments.map((environment) => (
        <EnvironmentCard 
          key={environment.id} 
          environment={environment} 
          activeUsers={activeUsers[environment.id] || 0}
        />
      ))}
    </div>
  );
}

interface EnvironmentCardProps {
  environment: Environment;
  activeUsers: number;
}

function EnvironmentCard({ environment, activeUsers }: EnvironmentCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted relative">
        {/* Environment preview image - since we can't use actual images, using a styled div */}
        <div 
          className="w-full h-full"
          style={{
            background: getEnvironmentGradient(environment.type),
          }}
        >
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="flex gap-1 items-center">
              <Users className="h-3 w-3" />
              <span>{activeUsers} active</span>
            </Badge>
          </div>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle>{environment.name}</CardTitle>
        <CardDescription>
          {getEnvironmentTypeLabel(environment.type)}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground">{environment.description}</p>
      </CardContent>
      
      <CardFooter>
        <Link href={`/date/${environment.id}`}>
          <Button className="w-full">
            Enter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function getEnvironmentTypeLabel(type: string): string {
  switch (type) {
    case 'cafe':
      return 'Cozy Environment';
    case 'street':
      return 'Urban Environment';
    case 'abandoned':
      return 'Adventurous Environment';
    default:
      return 'Virtual Environment';
  }
}

function getEnvironmentGradient(type: string): string {
  switch (type) {
    case 'cafe':
      return 'linear-gradient(135deg, #B06D46 0%, #E8DCCA 100%)';
    case 'street':
      return 'linear-gradient(135deg, #1F2A40 0%, #394C73 50%, #5D2E91 100%)';
    case 'abandoned':
      return 'linear-gradient(135deg, #4B3832 0%, #854442 50%, #BE9B7B 100%)';
    default:
      return 'linear-gradient(135deg, #3A506B 0%, #5BC0BE 100%)';
  }
}
