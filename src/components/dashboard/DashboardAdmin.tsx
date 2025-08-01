import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, Package, Calendar, BarChart3, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DashboardAdmin = () => {
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    priority: "normal"
  });
  const { toast } = useToast();

  const orders = [
    {
      id: 1,
      user: "player123@email.com",
      package: "10K Coins",
      amount: 10000,
      status: "pending",
      playerName: "FUT_Master",
      rating: 85,
      buyNowPrice: 5001,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      user: "gamer456@email.com", 
      package: "50K Coins",
      amount: 50000,
      status: "completed",
      playerName: "ProPlayer99",
      rating: 87,
      buyNowPrice: 12500,
      timestamp: "1 day ago"
    }
  ];

  const events = [
    {
      id: 1,
      name: "Double Coins Weekend",
      type: "coin_multiplier",
      multiplier: 2.0,
      active: true,
      startTime: "2024-01-20T00:00:00Z",
      endTime: "2024-01-22T23:59:59Z"
    },
    {
      id: 2,
      name: "Winter Special",
      type: "theme_event",
      multiplier: 1.0,
      active: false,
      startTime: "2024-12-01T00:00:00Z",
      endTime: "2024-12-31T23:59:59Z"
    }
  ];

  const handleSendBroadcast = () => {
    if (!broadcastForm.title || !broadcastForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and message.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Broadcast Sent! 📢",
      description: `${broadcastForm.priority.toUpperCase()} priority message sent to all users.`,
    });

    setBroadcastForm({ title: "", message: "", priority: "normal" });
  };

  const handleOrderAction = (orderId: number, action: string) => {
    toast({
      title: `Order ${action}`,
      description: `Order #${orderId} has been ${action.toLowerCase()}.`,
    });
  };

  const handleEventToggle = (eventId: number) => {
    toast({
      title: "Event Updated",
      description: `Event #${eventId} status has been toggled.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="vault-card">
        <h2 className="text-3xl font-bold mb-2 text-destructive">Admin Panel</h2>
        <p className="text-muted-foreground">
          Manage broadcasts, orders, events, and monitor system activity
        </p>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Orders Management */}
        <TabsContent value="orders">
          <Card className="vault-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Order Management</span>
              </CardTitle>
              <CardDescription>
                Review and process user orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="vault-card">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold">Order #{order.id}</h4>
                          <p className="text-sm text-muted-foreground">{order.user}</p>
                        </div>
                        <Badge variant={order.status === 'completed' ? 'secondary' : 'outline'}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Package: {order.package}</p>
                          <p className="text-sm">Player: {order.playerName}</p>
                          <p className="text-sm">Rating: {order.rating}</p>
                        </div>
                        <div>
                          <p className="text-sm">Buy Now: {order.buyNowPrice}</p>
                          <p className="text-sm">Amount: {order.amount.toLocaleString()} coins</p>
                          <p className="text-sm text-muted-foreground">{order.timestamp}</p>
                        </div>
                      </div>

                      {order.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleOrderAction(order.id, 'Approved')}
                            className="flex items-center space-x-1"
                            variant="secondary"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </Button>
                          <Button 
                            onClick={() => handleOrderAction(order.id, 'Declined')}
                            variant="destructive"
                            className="flex items-center space-x-1"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Decline</span>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Broadcast Management */}
        <TabsContent value="broadcasts">
          <Card className="vault-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Megaphone className="w-5 h-5" />
                <span>Send Broadcast</span>
              </CardTitle>
              <CardDescription>
                Send announcements to all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Priority Level</label>
                  <Select value={broadcastForm.priority} onValueChange={(value) => 
                    setBroadcastForm(prev => ({...prev, priority: value}))
                  }>
                    <SelectTrigger className="vault-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Info Only</SelectItem>
                      <SelectItem value="normal">Normal - Standard</SelectItem>
                      <SelectItem value="critical">Critical - Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm(prev => ({...prev, title: e.target.value}))}
                    placeholder="Broadcast title..."
                    className="vault-input"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm(prev => ({...prev, message: e.target.value}))}
                    placeholder="Broadcast message..."
                    className="vault-input min-h-[100px]"
                  />
                </div>

                <Button onClick={handleSendBroadcast} className="vault-button">
                  Send Broadcast
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Management */}
        <TabsContent value="events">
          <Card className="vault-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Events Management</span>
              </CardTitle>
              <CardDescription>
                Control active events and multipliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id} className="vault-card">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{event.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {event.type} • {event.multiplier}x multiplier
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={event.active ? 'secondary' : 'outline'}>
                            {event.active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            onClick={() => handleEventToggle(event.id)}
                            variant="outline"
                            size="sm"
                          >
                            {event.active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="vault-card">
              <CardContent className="pt-6">
                <BarChart3 className="w-8 h-8 mb-2 text-primary" />
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </CardContent>
            </Card>
            
            <Card className="vault-card">
              <CardContent className="pt-6">
                <Package className="w-8 h-8 mb-2 text-secondary" />
                <div className="text-2xl font-bold">56</div>
                <div className="text-sm text-muted-foreground">Orders Today</div>
              </CardContent>
            </Card>
            
            <Card className="vault-card">
              <CardContent className="pt-6">
                <Megaphone className="w-8 h-8 mb-2 text-accent" />
                <div className="text-2xl font-bold">89%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};