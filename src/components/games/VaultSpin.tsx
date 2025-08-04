import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Zap, Clock, Star, Coins, Gift, Crown, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface SpinReward {
  id: string;
  type: 'coins' | 'lootbox' | 'multiplier' | 'ticket';
  amount: number;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  probability: number;
}

export const VaultSpin = () => {
  const [canSpin, setCanSpin] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [lastSpin, setLastSpin] = useState<Date | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<number>(0);
  const [showReward, setShowReward] = useState(false);
  const [wonReward, setWonReward] = useState<SpinReward | null>(null);
  const [userTickets, setUserTickets] = useState(1);
  const wheelRef = useRef<HTMLDivElement>(null);

  const rewards: SpinReward[] = [
    { id: '1', type: 'coins', amount: 100, name: '100 Coins', icon: '🪙', rarity: 'common', color: '#8B5A00', probability: 30 },
    { id: '2', type: 'coins', amount: 250, name: '250 Coins', icon: '💰', rarity: 'common', color: '#8B5A00', probability: 25 },
    { id: '3', type: 'lootbox', amount: 1, name: 'Common Box', icon: '📦', rarity: 'common', color: '#6B7280', probability: 20 },
    { id: '4', type: 'coins', amount: 500, name: '500 Coins', icon: '💎', rarity: 'rare', color: '#3B82F6', probability: 15 },
    { id: '5', type: 'multiplier', amount: 2, name: '2x Multiplier', icon: '⚡', rarity: 'rare', color: '#8B5CF6', probability: 5 },
    { id: '6', type: 'lootbox', amount: 1, name: 'Epic Box', icon: '⭐', rarity: 'epic', color: '#8B5CF6', probability: 3 },
    { id: '7', type: 'coins', amount: 1000, name: '1000 Coins', icon: '💸', rarity: 'epic', color: '#8B5CF6', probability: 1.5 },
    { id: '8', type: 'lootbox', amount: 1, name: 'Legendary Box', icon: '👑', rarity: 'legendary', color: '#F59E0B', probability: 0.5 }
  ];

  useEffect(() => {
    // Check if user can spin (daily limit)
    const lastSpinDate = localStorage.getItem('vaultfut_last_spin');
    if (lastSpinDate) {
      const lastDate = new Date(lastSpinDate);
      const today = new Date();
      const diffHours = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 24) {
        setCanSpin(false);
        setLastSpin(lastDate);
        setTimeUntilNext(24 - diffHours);
      }
    }

    // Load user tickets
    const tickets = localStorage.getItem('vaultfut_spin_tickets');
    setUserTickets(tickets ? parseInt(tickets) : 1);
  }, []);

  useEffect(() => {
    if (!canSpin && timeUntilNext > 0) {
      const timer = setInterval(() => {
        setTimeUntilNext(prev => {
          if (prev <= 0.1) {
            setCanSpin(true);
            return 0;
          }
          return prev - 1/60; // Update every minute
        });
      }, 60000);

      return () => clearInterval(timer);
    }
  }, [canSpin, timeUntilNext]);

  const getRandomReward = (): SpinReward => {
    const random = Math.random() * 100;
    let currentProbability = 0;
    
    for (const reward of rewards) {
      currentProbability += reward.probability;
      if (random <= currentProbability) {
        return reward;
      }
    }
    
    return rewards[0]; // Fallback to first reward
  };

  const spinWheel = async () => {
    if (!canSpin && userTickets <= 0) {
      toast.error("No spin tickets available!");
      return;
    }

    setSpinning(true);
    
    // Animate wheel
    if (wheelRef.current) {
      const randomRotation = 1440 + Math.random() * 1440; // 4-8 full rotations
      wheelRef.current.style.transform = `rotate(${randomRotation}deg)`;
      wheelRef.current.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    }

    // Wait for animation
    setTimeout(() => {
      const reward = getRandomReward();
      setWonReward(reward);
      setShowReward(true);
      setSpinning(false);
      
      // Update local storage
      if (userTickets <= 0) {
        localStorage.setItem('vaultfut_last_spin', new Date().toISOString());
        setCanSpin(false);
        setTimeUntilNext(24);
      } else {
        setUserTickets(prev => {
          const newTickets = Math.max(0, prev - 1);
          localStorage.setItem('vaultfut_spin_tickets', newTickets.toString());
          return newTickets;
        });
      }

      // Award the reward
      awardReward(reward);
    }, 3000);
  };

  const awardReward = (reward: SpinReward) => {
    switch (reward.type) {
      case 'coins':
        // Add coins to user balance
        toast.success(`Won ${reward.amount} coins! 🪙`);
        break;
      case 'lootbox':
        // Add lootbox to user inventory
        toast.success(`Won ${reward.name}! 🎁`);
        break;
      case 'multiplier':
        // Apply multiplier
        toast.success(`Won ${reward.amount}x Multiplier! ⚡`);
        break;
      case 'ticket':
        // Add extra ticket
        toast.success(`Won extra spin ticket! 🎫`);
        break;
    }
  };

  const watchAdForTicket = () => {
    // Simulate watching an ad
    toast.success("Ad watched! Earned 1 spin ticket! 🎫");
    setUserTickets(prev => {
      const newTickets = prev + 1;
      localStorage.setItem('vaultfut_spin_tickets', newTickets.toString());
      return newTickets;
    });
  };

  const formatTimeRemaining = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      <Card className="vault-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Star className="w-6 h-6 text-yellow-400" />
            <span className="text-2xl font-vault">VaultSpin: Wheel of Rewards</span>
            <Star className="w-6 h-6 text-yellow-400" />
          </CardTitle>
          <div className="text-muted-foreground">
            Spin the wheel daily for amazing rewards! 🎡
          </div>
        </CardHeader>
        <CardContent>
        <CardContent className="space-y-6">
          {/* User Stats */}
          <div className="flex justify-center space-x-4">
            <Badge className="bg-blue-500 text-white px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              {canSpin ? "Ready to Spin!" : `Next: ${formatTimeRemaining(timeUntilNext)}`}
            </Badge>
            <Badge className="bg-green-500 text-white px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              {userTickets} Tickets
            </Badge>
          </div>

          {/* Wheel Container */}
          <div className="relative mx-auto w-80 h-80">
            {/* Wheel Background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4 shadow-2xl">
              {/* Pointer */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-white z-10"></div>
              
              {/* Wheel Segments */}
              <div 
                ref={wheelRef}
                className="w-full h-full rounded-full relative overflow-hidden"
                style={{ transition: spinning ? undefined : 'none' }}
              >
                {rewards.map((reward, index) => {
                  const angle = (360 / rewards.length) * index;
                  const nextAngle = (360 / rewards.length) * (index + 1);
                  
                  return (
                    <div
                      key={reward.id}
                      className="absolute w-1/2 h-1/2 origin-bottom-right transform"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        backgroundColor: reward.color,
                        clipPath: `polygon(0 0, 100% 0, ${100 - (100 * Math.cos((nextAngle - angle) * Math.PI / 180))}% ${100 * Math.sin((nextAngle - angle) * Math.PI / 180)}%, 0 100%)`
                      }}
                    >
                      <div className="absolute top-4 right-4 text-white text-center">
                        <div className="text-lg">{reward.icon}</div>
                        <div className="text-xs font-bold">{reward.amount}</div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center space-y-4">
            <Button
              onClick={spinWheel}
              disabled={spinning || (!canSpin && userTickets <= 0)}
              className="vault-button text-lg px-8 py-4 h-auto"
              size="lg"
            >
              {spinning ? (
                <>
                  <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Spinning...
                </>
              ) : canSpin || userTickets > 0 ? (
                <>
                  <Star className="w-5 h-5 mr-2" />
                  SPIN THE WHEEL!
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 mr-2" />
                  Come back in {formatTimeRemaining(timeUntilNext)}
                </>
              )}
            </Button>

            {!canSpin && userTickets <= 0 && (
              <Button
                onClick={watchAdForTicket}
                variant="outline"
                className="border-green-500 text-green-400 hover:bg-green-500/10"
              >
                <Zap className="w-4 h-4 mr-2" />
                Watch Ad for Extra Ticket
              </Button>
            )}
          </div>

          {/* Rewards Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4 border-t border-primary/20">
            {rewards.map((reward) => (
              <div key={reward.id} className="text-center p-2 bg-card/50 rounded-lg">
                <div className="text-lg mb-1">{reward.icon}</div>
                <div className="text-xs font-semibold">{reward.name}</div>
                <div className="text-xs text-muted-foreground">{reward.probability}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reward Dialog */}
      <Dialog open={showReward} onOpenChange={setShowReward}>
        <DialogContent className="vault-card max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">🎉 Congratulations! 🎉</DialogTitle>
          </DialogHeader>
          {wonReward && (
            <div className="space-y-4 py-4">
              <div className="text-6xl">{wonReward.icon}</div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{wonReward.name}</h3>
                <Badge 
                  className="capitalize"
                  style={{ backgroundColor: wonReward.color }}
                >
                  {wonReward.rarity} Reward
                </Badge>
              </div>
              <div className="text-muted-foreground">
                Your reward has been added to your account!
              </div>
              <Button 
                onClick={() => setShowReward(false)}
                className="vault-button w-full"
              >
                Awesome! 🎁
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};