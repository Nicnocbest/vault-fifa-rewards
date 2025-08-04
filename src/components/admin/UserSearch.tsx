import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, User, Coins, MessageSquare, Gift, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  coins: number;
  created_at: string;
  total_orders: number;
  last_active: string;
}

export const UserSearch = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionForm, setActionForm] = useState({
    coins: "",
    message: "",
    lootbox: ""
  });

  const searchUser = async () => {
    if (!searchEmail.trim()) {
      toast.error("Please enter an email to search");
      return;
    }

    setLoading(true);
    try {
      // Mock user data - in real app would query Supabase
      const mockUser: UserProfile = {
        id: "1",
        email: searchEmail,
        coins: Math.floor(Math.random() * 50000),
        created_at: "2024-01-15",
        total_orders: Math.floor(Math.random() * 20),
        last_active: "2024-01-20"
      };
      
      setFoundUser(mockUser);
      toast.success("User found!");
    } catch (error) {
      console.error('Error searching user:', error);
      toast.error('User not found');
      setFoundUser(null);
    } finally {
      setLoading(false);
    }
  };

  const giveCoins = async () => {
    if (!foundUser || !actionForm.coins) return;
    
    try {
      // In real app: call Supabase RPC
      toast.success(`Gave ${actionForm.coins} coins to ${foundUser.email}`);
      setActionForm(prev => ({ ...prev, coins: "" }));
      // Refresh user data
      setFoundUser(prev => prev ? { ...prev, coins: prev.coins + parseInt(actionForm.coins) } : null);
    } catch (error) {
      toast.error('Failed to give coins');
    }
  };

  const sendMessage = async () => {
    if (!foundUser || !actionForm.message) return;
    
    try {
      // In real app: insert into messages table
      toast.success(`Message sent to ${foundUser.email}`);
      setActionForm(prev => ({ ...prev, message: "" }));
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const sendLootbox = async () => {
    if (!foundUser || !actionForm.lootbox) return;
    
    try {
      // In real app: create lootbox for user
      toast.success(`${actionForm.lootbox} lootbox sent to ${foundUser.email}`);
      setActionForm(prev => ({ ...prev, lootbox: "" }));
    } catch (error) {
      toast.error('Failed to send lootbox');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card className="vault-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>User Quick Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter user email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="vault-input flex-1"
              onKeyPress={(e) => e.key === 'Enter' && searchUser()}
            />
            <Button 
              onClick={searchUser} 
              disabled={loading}
              className="vault-button"
            >
              {loading ? "..." : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Card */}
      {foundUser && (
        <Card className="vault-card border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{foundUser.email}</span>
              </div>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Crown className="w-3 h-3" />
                <span>VIP User</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-card/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{foundUser.coins.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Coins</div>
              </div>
              <div className="text-center p-3 bg-card/50 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{foundUser.total_orders}</div>
                <div className="text-sm text-muted-foreground">Orders</div>
              </div>
              <div className="text-center p-3 bg-card/50 rounded-lg">
                <div className="text-sm font-bold text-muted-foreground">
                  {new Date(foundUser.created_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">Joined</div>
              </div>
              <div className="text-center p-3 bg-card/50 rounded-lg">
                <div className="text-sm font-bold text-muted-foreground">
                  {new Date(foundUser.last_active).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">Last Active</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Give Coins */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="vault-button h-16 flex-col space-y-1">
                    <Coins className="w-6 h-6" />
                    <span>Give Coins</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="vault-card">
                  <DialogHeader>
                    <DialogTitle>Give Coins to {foundUser.email}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Coin Amount</Label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={actionForm.coins}
                        onChange={(e) => setActionForm(prev => ({ ...prev, coins: e.target.value }))}
                        className="vault-input"
                      />
                    </div>
                    <Button onClick={giveCoins} className="vault-button w-full">
                      Give Coins
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Send Message */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <MessageSquare className="w-6 h-6" />
                    <span>Send Message</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="vault-card">
                  <DialogHeader>
                    <DialogTitle>Send Message to {foundUser.email}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Message</Label>
                      <Textarea
                        placeholder="Your message here..."
                        value={actionForm.message}
                        onChange={(e) => setActionForm(prev => ({ ...prev, message: e.target.value }))}
                        className="vault-input"
                      />
                    </div>
                    <Button onClick={sendMessage} className="vault-button w-full">
                      Send Message
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Give Lootbox */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <Gift className="w-6 h-6" />
                    <span>Give Lootbox</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="vault-card">
                  <DialogHeader>
                    <DialogTitle>Give Lootbox to {foundUser.email}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Lootbox Type</Label>
                      <select 
                        className="vault-input w-full"
                        value={actionForm.lootbox}
                        onChange={(e) => setActionForm(prev => ({ ...prev, lootbox: e.target.value }))}
                      >
                        <option value="">Select lootbox...</option>
                        <option value="Common">Common Lootbox</option>
                        <option value="Rare">Rare Lootbox</option>
                        <option value="Epic">Epic Lootbox</option>
                        <option value="Legendary">Legendary Lootbox</option>
                      </select>
                    </div>
                    <Button onClick={sendLootbox} className="vault-button w-full">
                      Give Lootbox
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};