import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Users, ShoppingCart, TrendingUp, Megaphone, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DashboardAdmin = () => {
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    priority: "normal"
  });
  const [coinForm, setCoinForm] = useState({
    email: "",
    amount: ""
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    ordersToday: 0,
    successRate: 89
  });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get orders count for today
      const today = new Date().toISOString().split('T')[0];
      const { data: todayOrders } = await supabase
        .from('orders')
        .select('id')
        .gte('created_at', today);

      setStats(prev => ({
        ...prev,
        ordersToday: todayOrders?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastForm.title || !broadcastForm.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { error } = await supabase
        .from('broadcasts')
        .insert({
          title: broadcastForm.title,
          message: broadcastForm.message,
          type: broadcastForm.priority,
          is_active: true
        });

      if (error) throw error;

      toast.success("Broadcast sent to all users!");
      setBroadcastForm({ title: "", message: "", priority: "normal" });
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast.error('Failed to send broadcast');
    }
  };

  const handleGiveCoins = async () => {
    if (!coinForm.email || !coinForm.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    const adminEmail = localStorage.getItem("vaultfut_email");
    if (!adminEmail) {
      toast.error("Admin email not found");
      return;
    }

    try {
      const { data, error } = await supabase.rpc('add_coins', {
        _user_id: crypto.randomUUID(), // We'll need to find user by email
        _amount: parseInt(coinForm.amount),
        _transaction_type: 'admin_gift',
        _description: `Admin gift from ${adminEmail}`
      });

      if (error) throw error;

      if (data) {
        toast.success(`Successfully gave ${coinForm.amount} coins to ${coinForm.email}`);
        setCoinForm({ email: "", amount: "" });
      } else {
        toast.error("Access denied - admin rights required");
      }
    } catch (error) {
      console.error('Error giving coins:', error);
      toast.error('Failed to give coins');
    }
  };

  const handleOrderAction = async (orderId: string, action: 'approve' | 'decline', reason?: string) => {
    try {
      const newStatus = action === 'approve' ? 'completed' : 'declined';
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          declined_reason: reason || null
        })
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
      toast.success(`Order ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      toast.error(`Failed to ${action} order`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="vault-card">
        <h2 className="text-3xl font-bold mb-2 text-destructive font-vault">Admin Control Center</h2>
        <p className="text-muted-foreground">
          Manage broadcasts, orders, and monitor system activity
        </p>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm">
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="broadcasts" className="flex items-center space-x-2">
            <Megaphone className="w-4 h-4" />
            <span>Broadcasts</span>
          </TabsTrigger>
          <TabsTrigger value="coins" className="flex items-center space-x-2">
            <Coins className="w-4 h-4" />
            <span>Give Coins</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Orders Management */}
        <TabsContent value="orders" className="space-y-6">
          {loading ? (
            <Card className="vault-card">
              <CardContent className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading orders...</p>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card className="vault-card">
              <CardContent className="p-6 text-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="vault-card border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <Badge variant={
                            order.status === 'completed' ? 'default' : 
                            order.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {order.status}
                          </Badge>
                          <span className="font-vault text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">User:</span>
                            <span className="ml-2 font-medium">{order.email}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Coins:</span>
                            <span className="ml-2 font-medium">{order.coins_used} → {order.fifa_coins_received} FIFA</span>
                          </div>
                          {order.player_name && (
                            <div>
                              <span className="text-muted-foreground">Player:</span>
                              <span className="ml-2 font-medium">{order.player_name}</span>
                            </div>
                          )}
                          {order.declined_reason && (
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Admin Note:</span>
                              <span className="ml-2 font-medium text-red-400">{order.declined_reason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {order.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleOrderAction(order.id, 'approve')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              const reason = prompt('Reason for decline:');
                              if (reason) handleOrderAction(order.id, 'decline', reason);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Broadcasts */}
        <TabsContent value="broadcasts" className="space-y-6">
          <Card className="vault-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Megaphone className="w-5 h-5" />
                <span>Send Broadcast</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Priority Level</Label>
                <Select value={broadcastForm.priority} onValueChange={(value) => 
                  setBroadcastForm(prev => ({...prev, priority: value}))
                }>
                  <SelectTrigger className="vault-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Info Only ℹ️</SelectItem>
                    <SelectItem value="normal">Normal - Standard ⚠️</SelectItem>
                    <SelectItem value="critical">Critical - Emergency 🚨</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm(prev => ({...prev, title: e.target.value}))}
                  placeholder="Broadcast title..."
                  className="vault-input"
                />
              </div>

              <div>
                <Label>Message</Label>
                <Textarea
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm(prev => ({...prev, message: e.target.value}))}
                  placeholder="Broadcast message..."
                  className="vault-input min-h-[100px]"
                />
              </div>

              <Button onClick={handleSendBroadcast} className="vault-button w-full">
                <Megaphone className="w-4 h-4 mr-2" />
                Send Broadcast to All Users
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Give Coins */}
        <TabsContent value="coins" className="space-y-6">
          <Card className="vault-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="w-5 h-5" />
                <span>Give Coins to User</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>User Email</Label>
                <Input
                  value={coinForm.email}
                  onChange={(e) => setCoinForm(prev => ({...prev, email: e.target.value}))}
                  placeholder="user@example.com"
                  className="vault-input"
                />
              </div>

              <div>
                <Label>Amount of Coins</Label>
                <Input
                  type="number"
                  value={coinForm.amount}
                  onChange={(e) => setCoinForm(prev => ({...prev, amount: e.target.value}))}
                  placeholder="1000"
                  className="vault-input"
                />
              </div>

              <Button onClick={handleGiveCoins} className="vault-button w-full">
                <Coins className="w-4 h-4 mr-2" />
                Give Coins to User
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="vault-card">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary">{stats.totalUsers}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </CardContent>
            </Card>
            
            <Card className="vault-card">
              <CardContent className="p-6 text-center">
                <ShoppingCart className="w-12 h-12 text-secondary mx-auto mb-4" />
                <div className="text-3xl font-bold text-secondary">{stats.ordersToday}</div>
                <div className="text-sm text-muted-foreground">Orders Today</div>
              </CardContent>
            </Card>
            
            <Card className="vault-card">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
                <div className="text-3xl font-bold text-accent">{stats.successRate}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};