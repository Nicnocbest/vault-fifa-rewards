import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Gift, Megaphone } from "lucide-react";

export const DashboardMessages = () => {
  const messages = [
    {
      id: 1,
      type: "event",
      title: "Double Coins Weekend! 🎉",
      message: "Earn 2x coins from watching ads this weekend only!",
      timestamp: "2 hours ago",
      isRead: false,
      icon: Gift
    },
    {
      id: 2,
      type: "system",
      title: "Server Maintenance",
      message: "Scheduled maintenance on Sunday 3AM-4AM GMT. No downtime expected.",
      timestamp: "1 day ago",
      isRead: true,
      icon: Bell
    },
    {
      id: 3,
      type: "broadcast",
      title: "New Shop Packages Available",
      message: "Check out our new coin packages with better rates!",
      timestamp: "3 days ago",
      isRead: true,
      icon: Megaphone
    },
    {
      id: 4,
      type: "warning",
      title: "Important: TOS Update",
      message: "Our Terms of Service have been updated. Please review the changes.",
      timestamp: "1 week ago",
      isRead: false,
      icon: AlertTriangle
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event": return "bg-secondary/20 text-secondary border-secondary/30";
      case "warning": return "bg-destructive/20 text-destructive border-destructive/30";
      case "broadcast": return "bg-primary/20 text-primary border-primary/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="vault-card">
        <h2 className="text-3xl font-bold mb-2">Messages & Events</h2>
        <p className="text-muted-foreground">
          Stay updated with the latest announcements and events
        </p>
      </div>

      <div className="space-y-4">
        {messages.map((message) => {
          const IconComponent = message.icon;
          return (
            <Card 
              key={message.id}
              className={`vault-card transition-all hover:scale-[1.02] ${
                !message.isRead ? 'ring-1 ring-primary/30' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getTypeColor(message.type)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span>{message.title}</span>
                        {!message.isRead && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {message.timestamp}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{message.message}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State for Future Messages */}
      <Card className="vault-card text-center py-8">
        <CardContent>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">You're all caught up!</h3>
          <p className="text-muted-foreground">
            We'll notify you when there are new announcements or events.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};