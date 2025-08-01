import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Info, Megaphone } from "lucide-react";

export const BroadcastAlert = () => {
  const [activeBroadcast, setActiveBroadcast] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Mock broadcast data - in real app this would come from Supabase
  useEffect(() => {
    const mockBroadcast = {
      id: 1,
      title: "🚨 System Maintenance Alert",
      message: "Scheduled maintenance will occur Sunday 3AM-4AM GMT. No service interruption expected.",
      type: "critical", // low, normal, critical
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Simulate checking for active broadcast
    const hasActiveBroadcast = Math.random() > 0.7; // 30% chance for demo
    if (hasActiveBroadcast) {
      setActiveBroadcast(mockBroadcast);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // In real app, mark as read in localStorage or database
    localStorage.setItem(`broadcast_dismissed_${activeBroadcast?.id}`, 'true');
  };

  if (!activeBroadcast || !isVisible) {
    return null;
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "critical": return "destructive";
      case "normal": return "default";
      case "low": return "default";
      default: return "default";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "critical": return AlertTriangle;
      case "normal": return Megaphone;
      case "low": return Info;
      default: return Info;
    }
  };

  const Icon = getIcon(activeBroadcast.type);

  return (
    <div className={`w-full bg-gradient-to-r ${
      activeBroadcast.type === 'critical' 
        ? 'from-destructive/20 via-destructive/10 to-destructive/20' 
        : 'from-primary/20 via-primary/10 to-primary/20'
    } border-b border-border/30 ${activeBroadcast.type === 'critical' ? 'animate-shake' : ''}`}>
      <div className="container mx-auto px-6 py-3">
        <Alert variant={getAlertVariant(activeBroadcast.type)} className="border-none bg-transparent">
          <Icon className="h-4 w-4" />
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <AlertTitle className="font-vault text-sm">
                {activeBroadcast.title}
              </AlertTitle>
              <AlertDescription className="text-sm">
                {activeBroadcast.message}
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="ml-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      </div>
    </div>
  );
};