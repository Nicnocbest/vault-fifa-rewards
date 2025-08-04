import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Gift, Star, Sparkles, Crown, Eye, Send, Users } from "lucide-react";
import { toast } from "sonner";

interface LootBox {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  coins: number;
  image: string;
  contents: string[];
}

export const LootDropEditor = () => {
  const [lootForm, setLootForm] = useState({
    name: "",
    description: "",
    rarity: "common" as const,
    coins: "",
    contents: ""
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");

  const rarityConfig = {
    common: { 
      color: "bg-gray-500", 
      icon: "📦", 
      glow: "shadow-gray-500/50",
      border: "border-gray-500/30"
    },
    rare: { 
      color: "bg-blue-500", 
      icon: "💎", 
      glow: "shadow-blue-500/50",
      border: "border-blue-500/30"
    },
    epic: { 
      color: "bg-purple-500", 
      icon: "⭐", 
      glow: "shadow-purple-500/50",
      border: "border-purple-500/30"
    },
    legendary: { 
      color: "bg-yellow-500", 
      icon: "👑", 
      glow: "shadow-yellow-500/50",
      border: "border-yellow-500/30"
    }
  };

  const createLootbox = async () => {
    if (!lootForm.name || !lootForm.description || !lootForm.coins) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newLootbox: LootBox = {
        id: Date.now().toString(),
        name: lootForm.name,
        description: lootForm.description,
        rarity: lootForm.rarity,
        coins: parseInt(lootForm.coins),
        image: `https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop`,
        contents: lootForm.contents.split(',').map(item => item.trim()).filter(Boolean)
      };

      toast.success("Lootbox created successfully!");
      setLootForm({
        name: "",
        description: "",
        rarity: "common",
        coins: "",
        contents: ""
      });
    } catch (error) {
      toast.error("Failed to create lootbox");
    }
  };

  const sendLootbox = async () => {
    if (!sendToAll && !targetEmail) {
      toast.error("Please specify target email or select 'Send to All'");
      return;
    }

    try {
      if (sendToAll) {
        toast.success("Lootbox sent to ALL users! 🎉");
      } else {
        toast.success(`Lootbox sent to ${targetEmail}! 🎁`);
      }
      setTargetEmail("");
      setSendToAll(false);
    } catch (error) {
      toast.error("Failed to send lootbox");
    }
  };

  const LootboxPreview = () => {
    const config = rarityConfig[lootForm.rarity];
    
    return (
      <div className="text-center space-y-4 p-6">
        <div className="text-sm text-muted-foreground mb-2">Preview - How users will see it:</div>
        
        <div className={`relative mx-auto w-32 h-32 rounded-lg ${config.color} ${config.glow} shadow-lg ${config.border} border-2 flex items-center justify-center animate-pulse`}>
          <span className="text-4xl">{config.icon}</span>
          <div className="absolute -top-2 -right-2">
            <Badge className={`${config.color} text-white capitalize`}>
              {lootForm.rarity}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{lootForm.name || "Lootbox Name"}</h3>
          <p className="text-muted-foreground text-sm">
            {lootForm.description || "Lootbox description..."}
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-yellow-400">💰</span>
            <span className="font-bold">{lootForm.coins || "0"} Coins</span>
          </div>
        </div>

        <div className="bg-card/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center justify-center space-x-2">
            <Gift className="w-4 h-4" />
            <span>Contents</span>
          </h4>
          {lootForm.contents ? (
            <div className="space-y-1">
              {lootForm.contents.split(',').map((item, idx) => (
                <div key={idx} className="text-sm text-muted-foreground">
                  • {item.trim()}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No contents specified</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Lootbox Creator */}
      <Card className="vault-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="w-5 h-5" />
            <span>Loot-Drop Creator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-4">
              <div>
                <Label>Lootbox Name</Label>
                <Input
                  placeholder="Epic Reward Box"
                  value={lootForm.name}
                  onChange={(e) => setLootForm(prev => ({ ...prev, name: e.target.value }))}
                  className="vault-input"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="A mysterious box containing amazing rewards..."
                  value={lootForm.description}
                  onChange={(e) => setLootForm(prev => ({ ...prev, description: e.target.value }))}
                  className="vault-input"
                />
              </div>

              <div>
                <Label>Rarity Level</Label>
                <Select value={lootForm.rarity} onValueChange={(value: any) => 
                  setLootForm(prev => ({ ...prev, rarity: value }))
                }>
                  <SelectTrigger className="vault-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">📦 Common - Standard rewards</SelectItem>
                    <SelectItem value="rare">💎 Rare - Better rewards</SelectItem>
                    <SelectItem value="epic">⭐ Epic - Great rewards</SelectItem>
                    <SelectItem value="legendary">👑 Legendary - Amazing rewards</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Coin Amount</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={lootForm.coins}
                  onChange={(e) => setLootForm(prev => ({ ...prev, coins: e.target.value }))}
                  className="vault-input"
                />
              </div>

              <div>
                <Label>Contents (comma separated)</Label>
                <Textarea
                  placeholder="100 FIFA Coins, Epic Player Card, Bonus Multiplier, Premium Kit"
                  value={lootForm.contents}
                  onChange={(e) => setLootForm(prev => ({ ...prev, contents: e.target.value }))}
                  className="vault-input"
                />
              </div>
            </div>

            {/* Preview Section */}
            <div className="border border-primary/20 rounded-lg">
              <LootboxPreview />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-primary/20">
            <Button onClick={createLootbox} className="vault-button">
              <Gift className="w-4 h-4 mr-2" />
              Create Lootbox
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Full Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="vault-card max-w-md">
                <DialogHeader>
                  <DialogTitle>Lootbox Preview</DialogTitle>
                </DialogHeader>
                <LootboxPreview />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Send Lootbox */}
      <Card className="vault-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Send Lootbox</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <input 
              type="checkbox" 
              checked={sendToAll}
              onChange={(e) => setSendToAll(e.target.checked)}
              className="w-4 h-4"
            />
            <Label className="text-sm">Send to ALL users</Label>
          </div>

          {!sendToAll && (
            <div>
              <Label>Target User Email</Label>
              <Input
                placeholder="user@example.com"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="vault-input"
              />
            </div>
          )}

          <Button 
            onClick={sendLootbox} 
            className="vault-button w-full"
            disabled={!sendToAll && !targetEmail}
          >
            {sendToAll ? (
              <>
                <Users className="w-4 h-4 mr-2" />
                Send to ALL Users
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send to {targetEmail || "User"}
              </>
            )}
          </Button>

          {sendToAll && (
            <div className="text-sm text-yellow-400 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              ⚠️ This will send the lootbox to ALL registered users instantly!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};