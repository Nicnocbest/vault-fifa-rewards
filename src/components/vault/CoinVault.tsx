import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Vault, Star, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

interface CoinAnimation {
  id: string;
  amount: number;
  x: number;
  y: number;
  delay: number;
}

export const CoinVault = () => {
  const [vaultOpen, setVaultOpen] = useState(false);
  const [coins, setCoins] = useState(12450);
  const [pendingRewards, setPendingRewards] = useState(850);
  const [animations, setAnimations] = useState<CoinAnimation[]>([]);
  const [vaultGlow, setVaultGlow] = useState(false);
  const vaultRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio (optional)
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio();
    }
  }, []);

  const playSound = (type: 'open' | 'coins' | 'close') => {
    // Mock sound effects - in real app you'd have actual audio files
    if (audioRef.current) {
      switch (type) {
        case 'open':
          // audioRef.current.src = '/sounds/vault-open.mp3';
          break;
        case 'coins':
          // audioRef.current.src = '/sounds/coins-drop.mp3';
          break;
        case 'close':
          // audioRef.current.src = '/sounds/vault-close.mp3';
          break;
      }
      // audioRef.current.play().catch(() => {}); // Ignore errors if audio not supported
    }
  };

  const claimRewards = async () => {
    if (pendingRewards <= 0) {
      toast.error("No pending rewards to claim!");
      return;
    }

    setVaultOpen(true);
    setVaultGlow(true);
    playSound('open');

    // Create coin animations
    const newAnimations: CoinAnimation[] = [];
    const coinCount = Math.min(20, Math.ceil(pendingRewards / 50)); // Max 20 coins

    for (let i = 0; i < coinCount; i++) {
      newAnimations.push({
        id: `coin-${i}-${Date.now()}`,
        amount: Math.floor(pendingRewards / coinCount),
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: i * 100
      });
    }

    setAnimations(newAnimations);

    // Wait a bit then start coin collection animation
    setTimeout(() => {
      playSound('coins');
      
      // Animate coins to vault
      setAnimations(prev => prev.map(anim => ({
        ...anim,
        x: 50, // Center of vault
        y: 60  // Bottom of vault
      })));

      // After animation, update coin count
      setTimeout(() => {
        setCoins(prev => prev + pendingRewards);
        setPendingRewards(0);
        setAnimations([]);
        
        toast.success(`+${pendingRewards} coins claimed! 🪙`, {
          duration: 3000,
        });

        // Close vault after delay
        setTimeout(() => {
          setVaultOpen(false);
          setVaultGlow(false);
          playSound('close');
        }, 1000);
      }, 1500);
    }, 500);
  };

  const addTestReward = () => {
    const bonus = Math.floor(Math.random() * 500) + 100;
    setPendingRewards(prev => prev + bonus);
    toast.success(`+${bonus} coins earned!`);
  };

  return (
    <div className="space-y-6">
      {/* Main Vault */}
      <Card className={`vault-card relative overflow-hidden transition-all duration-500 ${vaultGlow ? 'ring-4 ring-yellow-400/50 shadow-2xl shadow-yellow-400/30' : ''}`}>
        <CardContent className="p-8 text-center space-y-6">
          {/* Vault Status */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Badge className="bg-primary text-primary-foreground px-4 py-2">
              <Vault className="w-4 h-4 mr-2" />
              Your Vault
            </Badge>
            {pendingRewards > 0 && (
              <Badge className="bg-green-500 text-white px-4 py-2 animate-pulse">
                <Star className="w-4 h-4 mr-2" />
                {pendingRewards} Pending!
              </Badge>
            )}
          </div>

          {/* Current Balance */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Current Balance</div>
            <div className="text-4xl font-bold text-primary font-vault">
              {coins.toLocaleString()} 🪙
            </div>
          </div>

          {/* Vault Animation Container */}
          <div 
            ref={vaultRef}
            className="relative mx-auto w-64 h-48 perspective-1000"
          >
            {/* Vault Base */}
            <div className={`relative w-full h-full transition-all duration-1000 ${vaultOpen ? 'transform-style-3d rotateX-12' : ''}`}>
              {/* Vault Body */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-2xl border-4 border-yellow-600">
                {/* Vault Door */}
                <div 
                  className={`absolute inset-2 bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800 rounded transition-all duration-1000 ${
                    vaultOpen ? 'transform rotateY-95 origin-left' : ''
                  }`}
                >
                  {/* Door Handle */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-yellow-300 rounded-full shadow-lg"></div>
                  
                  {/* Lock */}
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-sm"></div>
                </div>

                {/* Vault Interior (visible when open) */}
                {vaultOpen && (
                  <div className="absolute inset-2 bg-gradient-to-t from-yellow-200 via-yellow-300 to-yellow-100 rounded flex items-center justify-center">
                    <div className="text-4xl animate-pulse">💰</div>
                  </div>
                )}

                {/* Sparkle Effects */}
                {vaultGlow && (
                  <div className="absolute inset-0">
                    {Array.from({ length: 15 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute text-yellow-400 animate-ping"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          fontSize: `${Math.random() * 8 + 10}px`
                        }}
                      >
                        ✨
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Flying Coins Animation */}
            {animations.map((anim) => (
              <div
                key={anim.id}
                className="absolute w-8 h-8 text-2xl transition-all duration-1500 ease-out z-10"
                style={{
                  left: `${anim.x}%`,
                  top: `${anim.y}%`,
                  animationDelay: `${anim.delay}ms`,
                  transform: animations.length > 0 && anim.x === 50 ? 'scale(0)' : 'scale(1)'
                }}
              >
                🪙
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {pendingRewards > 0 ? (
              <Button 
                onClick={claimRewards}
                disabled={vaultOpen}
                className="vault-button text-lg px-8 py-4 h-auto relative overflow-hidden"
                size="lg"
              >
                {vaultOpen ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Opening Vault...
                  </>
                ) : (
                  <>
                    <Vault className="w-5 h-5 mr-2" />
                    Claim {pendingRewards} Coins!
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </>
                )}
              </Button>
            ) : (
              <div className="text-muted-foreground">
                <div className="text-lg">Vault is secure! 🔒</div>
                <div className="text-sm">Complete activities to earn rewards</div>
              </div>
            )}

            {/* Test Button (for demo) */}
            <Button 
              onClick={addTestReward}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/10"
            >
              <Zap className="w-4 h-4 mr-2" />
              Simulate Reward (Demo)
            </Button>
          </div>

          {/* Vault Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary/20">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">156</div>
              <div className="text-xs text-muted-foreground">Total Claims</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">2.3x</div>
              <div className="text-xs text-muted-foreground">Avg Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">89%</div>
              <div className="text-xs text-muted-foreground">Claim Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .rotateX-12 {
          transform: rotateX(12deg);
        }
        .rotateY-95 {
          transform: rotateY(-95deg);
        }
        .origin-left {
          transform-origin: left center;
        }
      `}</style>
    </div>
  );
};