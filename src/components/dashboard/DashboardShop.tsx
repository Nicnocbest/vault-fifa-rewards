import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Coins, Star, Zap, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DashboardShop = () => {
  const [orderForm, setOrderForm] = useState({
    playerName: "",
    rating: ""
  });

  const packages = [
    {
      id: 1,
      name: "Starter Pack",
      websiteCoins: 2500,
      fifaCoins: 5000,
      icon: Coins,
      color: "from-blue-500 to-blue-600",
      hint: "Set Buy Now Price: 5,001"
    },
    {
      id: 2,
      name: "Pro Pack",
      websiteCoins: 5000,
      fifaCoins: 10000,
      icon: Star,
      color: "from-purple-500 to-purple-600",
      hint: "Set Buy Now Price: 10,001",
      popular: true
    },
    {
      id: 3,
      name: "Elite Pack",
      websiteCoins: 25000,
      fifaCoins: 50000,
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      hint: "Set Buy Now Price: 50,001"
    },
    {
      id: 4,
      name: "Legend Pack",
      websiteCoins: 50000,
      fifaCoins: 100000,
      icon: Crown,
      color: "from-yellow-500 to-yellow-600",
      hint: "Set Buy Now Price: 100,001"
    }
  ];

  const handlePurchase = async (packageName: string, websiteCoins: number, fifaCoins: number, hint: string) => {
    if (!orderForm.playerName || !orderForm.rating) {
      toast.error("Please fill in all player details");
      return;
    }

    const userEmail = localStorage.getItem("vaultfut_email");
    if (!userEmail) {
      toast.error("Please refresh the page and enter your email");
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: crypto.randomUUID(),
          email: userEmail,
          fifa_id: orderForm.playerName,
          player_name: orderForm.playerName,
          coins_used: websiteCoins,
          fifa_coins_received: fifaCoins,
          status: 'pending'
        });

      if (error) throw error;

      toast.success(`Order placed for ${packageName}! Admin will process it soon.`);
      setOrderForm({ playerName: "", rating: "" });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="vault-card text-center">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-vault">
          Coin Exchange
        </h2>
        <p className="text-muted-foreground text-lg">
          Convert your website coins to FIFA Ultimate Team coins
        </p>
        <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/30">
          <p className="text-primary font-bold">
            💰 Exchange Rate: 1 Website Coin = 2 FIFA Coins
          </p>
        </div>
      </div>

      {/* Player Details Form */}
      <Card className="vault-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span>Player Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="playerName">FIFA Player Name *</Label>
              <Input
                id="playerName"
                value={orderForm.playerName}
                onChange={(e) => setOrderForm(prev => ({...prev, playerName: e.target.value}))}
                placeholder="Your FIFA Ultimate Team name"
                className="vault-input"
              />
            </div>
            <div>
              <Label htmlFor="rating">Player Rating *</Label>
              <Input
                id="rating"
                value={orderForm.rating}
                onChange={(e) => setOrderForm(prev => ({...prev, rating: e.target.value}))}
                placeholder="e.g. 85"
                className="vault-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Selection */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center font-vault">Select Your Package</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card 
                key={pkg.id}
                className="vault-card hover:scale-105 transition-transform cursor-pointer relative overflow-hidden group"
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-accent text-accent-foreground animate-pulse">
                      ⭐ Popular
                    </Badge>
                  </div>
                )}
                
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-vault">{pkg.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="text-center space-y-4 relative z-10">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {pkg.websiteCoins.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Website Coins</div>
                    
                    <div className="text-center py-2">
                      <div className="text-accent">↓</div>
                      <div className="text-xs text-muted-foreground">converts to</div>
                    </div>
                    
                    <div className="text-3xl font-bold text-accent">
                      {pkg.fifaCoins.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">FIFA Coins</div>
                  </div>
                  
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/30">
                    <p className="text-xs text-accent font-medium">{pkg.hint}</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-vault font-bold"
                    onClick={() => handlePurchase(pkg.name, pkg.websiteCoins, pkg.fifaCoins, pkg.hint)}
                    disabled={!orderForm.playerName || !orderForm.rating}
                  >
                    Order Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <Card className="vault-card">
        <CardHeader>
          <CardTitle className="text-center">📋 How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-semibold">Fill Player Info</h4>
              <p className="text-sm text-muted-foreground">Enter your FIFA player name and rating</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h4 className="font-semibold">Set Buy Now Price</h4>
              <p className="text-sm text-muted-foreground">List your player with the specified unique price</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h4 className="font-semibold">Get Your Coins</h4>
              <p className="text-sm text-muted-foreground">Admin will purchase your player and you receive coins</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};