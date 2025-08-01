import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Coins, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DashboardShop = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [orderForm, setOrderForm] = useState({
    playerName: "",
    rating: "",
    buyNowPrice: "",
    specialInstructions: ""
  });
  const { toast } = useToast();

  const packages = [
    { id: "5k", coins: 5000, price: "€5", popular: false },
    { id: "10k", coins: 10000, price: "€9", popular: true },
    { id: "50k", coins: 50000, price: "€39", popular: false },
    { id: "100k", coins: 100000, price: "€75", popular: false },
    { id: "custom", coins: 0, price: "Custom", popular: false }
  ];

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleOrderSubmit = () => {
    if (!selectedPackage) {
      toast({
        title: "Select Package",
        description: "Please select a coin package first.",
        variant: "destructive",
      });
      return;
    }

    if (!orderForm.playerName || !orderForm.rating) {
      toast({
        title: "Missing Information",
        description: "Please fill in player name and rating.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Submitted! ✅",
      description: "Your order has been sent for admin approval.",
    });

    // Reset form
    setSelectedPackage(null);
    setOrderForm({
      playerName: "",
      rating: "",
      buyNowPrice: "",
      specialInstructions: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="vault-card">
        <h2 className="text-3xl font-bold mb-2">Coin Shop</h2>
        <p className="text-muted-foreground">
          Purchase FIFA Ultimate Team coins with secure delivery
        </p>
      </div>

      {/* Package Selection */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Select Package</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`vault-card cursor-pointer transition-all ${
                selectedPackage === pkg.id 
                  ? 'ring-2 ring-primary border-primary bg-primary/10' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handlePackageSelect(pkg.id)}
            >
              <CardHeader className="text-center pb-2">
                {pkg.popular && (
                  <Badge className="mb-2 bg-secondary text-secondary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Coins className="w-5 h-5 text-primary" />
                  <span>
                    {pkg.id === "custom" ? "Custom" : `${pkg.coins.toLocaleString()}`}
                  </span>
                </CardTitle>
                <CardDescription className="text-lg font-bold text-primary">
                  {pkg.price}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Order Form */}
      {selectedPackage && (
        <div className="vault-card">
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>Order Details</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
              
              <div>
                <Label htmlFor="buyNowPrice">Buy Now Price</Label>
                <Input
                  id="buyNowPrice"
                  value={orderForm.buyNowPrice}
                  onChange={(e) => setOrderForm(prev => ({...prev, buyNowPrice: e.target.value}))}
                  placeholder="e.g. 5001"
                  className="vault-input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Set your player's buy now price (recommended: unique amount like 5001)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea
                  id="instructions"
                  value={orderForm.specialInstructions}
                  onChange={(e) => setOrderForm(prev => ({...prev, specialInstructions: e.target.value}))}
                  placeholder="Any additional details or requirements..."
                  className="vault-input min-h-[100px]"
                />
              </div>

              <div className="vault-card bg-primary/10 border-primary/30">
                <h4 className="font-semibold text-primary mb-2">💡 Quick Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use a unique buy now price</li>
                  <li>• Keep your player listed</li>
                  <li>• Delivery within 24 hours</li>
                  <li>• Contact support if needed</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <Button 
              onClick={handleOrderSubmit}
              className="vault-button w-full md:w-auto"
              size="lg"
            >
              Submit Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};