import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Zap, Star, Crown, Gift } from "lucide-react";

interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: 'double_coins' | 'bonus_loot' | 'free_spins' | 'mega_rewards';
  icon: string;
  multiplier: number;
  endTime: Date;
  isActive: boolean;
  bgPattern: string;
  color: string;
}

export const EventsTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeEvents, setActiveEvents] = useState<GameEvent[]>([]);

  // Mock events - in real app these would come from database
  const mockEvents: GameEvent[] = [
    {
      id: 'double_coins',
      name: '⚡ Double Coins Event',
      description: 'Get 2x coins from all activities!',
      type: 'double_coins',
      icon: '⚡',
      multiplier: 2,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      isActive: true,
      bgPattern: 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500',
      color: 'text-yellow-100'
    },
    {
      id: 'mega_loot',
      name: '🎁 Mega Loot Friday',
      description: 'Legendary lootbox drop rates increased by 300%!',
      type: 'bonus_loot',
      icon: '🎁',
      multiplier: 4,
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      isActive: true,
      bgPattern: 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600',
      color: 'text-purple-100'
    },
    {
      id: 'free_spins',
      name: '🎡 Free Spin Weekend',
      description: 'Unlimited VaultSpin attempts!',
      type: 'free_spins',
      icon: '🎡',
      multiplier: 999,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      isActive: true,
      bgPattern: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500',
      color: 'text-blue-100'
    }
  ];

  useEffect(() => {
    setActiveEvents(mockEvents.filter(event => event.isActive && event.endTime > new Date()));

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeRemaining = (endTime: Date): string => {
    const diff = endTime.getTime() - currentTime.getTime();
    
    if (diff <= 0) return "EXPIRED";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'double_coins': return <Zap className="w-6 h-6" />;
      case 'bonus_loot': return <Gift className="w-6 h-6" />;
      case 'free_spins': return <Star className="w-6 h-6" />;
      default: return <Crown className="w-6 h-6" />;
    }
  };

  const getAnimationStyle = (type: string) => {
    switch (type) {
      case 'double_coins':
        return {
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 140, 0, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 69, 0, 0.2) 0%, transparent 50%)
          `,
          animation: 'pulse 2s infinite'
        };
      case 'bonus_loot':
        return {
          backgroundImage: `
            linear-gradient(45deg, rgba(147, 51, 234, 0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(236, 72, 153, 0.1) 25%, transparent 25%)
          `,
          backgroundSize: '30px 30px'
        };
      case 'free_spins':
        return {
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)
          `,
          animation: 'spin 10s linear infinite'
        };
      default:
        return {};
    }
  };

  if (activeEvents.length === 0) {
    return (
      <Card className="vault-card">
        <CardContent className="p-6 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <div className="text-muted-foreground">No active events right now</div>
          <div className="text-sm text-muted-foreground mt-2">Check back soon for exciting events!</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activeEvents.map((event) => (
        <Card 
          key={event.id} 
          className={`relative overflow-hidden border-2 ${event.bgPattern} vault-card`}
          style={getAnimationStyle(event.type)}
        >
          {/* Fire Background for Active Events */}
          {event.type === 'double_coins' && (
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="absolute text-orange-500 animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    fontSize: `${Math.random() * 10 + 15}px`
                  }}
                >
                  🔥
                </div>
              ))}
            </div>
          )}

          {/* Snow for Winter Events */}
          {event.type === 'free_spins' && (
            <div className="absolute inset-0 opacity-30">
              {Array.from({ length: 15 }, (_, i) => (
                <div
                  key={i}
                  className="absolute text-blue-200 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    fontSize: `${Math.random() * 8 + 10}px`
                  }}
                >
                  ❄️
                </div>
              ))}
            </div>
          )}

          <CardHeader className="relative z-10">
            <CardTitle className={`flex items-center justify-between ${event.color}`}>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{event.icon}</div>
                <div>
                  <div className="text-xl font-bold">{event.name}</div>
                  <div className="text-sm opacity-90">{event.description}</div>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`text-center ${event.color}`}>
                  <div className="text-2xl font-bold">{event.multiplier}x</div>
                  <div className="text-sm opacity-75">Multiplier</div>
                </div>
                
                <div className={`text-center ${event.color}`}>
                  <div className="text-lg font-bold font-mono">
                    {formatTimeRemaining(event.endTime)}
                  </div>
                  <div className="text-sm opacity-75">Time Left</div>
                </div>
              </div>

              <Button 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                <Flame className="w-4 h-4 mr-2" />
                Join Event
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white/80 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.max(0, Math.min(100, ((event.endTime.getTime() - currentTime.getTime()) / (6 * 60 * 60 * 1000)) * 100))}%` 
                }}
              />
            </div>

            {/* Event Benefits */}
            <div className={`text-sm ${event.color} opacity-90`}>
              <div className="flex flex-wrap gap-2">
                {event.type === 'double_coins' && (
                  <>
                    <Badge className="bg-white/20 text-white">💰 2x Order Rewards</Badge>
                    <Badge className="bg-white/20 text-white">🎮 2x Game Coins</Badge>
                    <Badge className="bg-white/20 text-white">🎁 2x Bonus Claims</Badge>
                  </>
                )}
                {event.type === 'bonus_loot' && (
                  <>
                    <Badge className="bg-white/20 text-white">📦 Better Lootboxes</Badge>
                    <Badge className="bg-white/20 text-white">⭐ Rare Drops</Badge>
                    <Badge className="bg-white/20 text-white">👑 Legendary Chance</Badge>
                  </>
                )}
                {event.type === 'free_spins' && (
                  <>
                    <Badge className="bg-white/20 text-white">🎡 Unlimited Spins</Badge>
                    <Badge className="bg-white/20 text-white">🎫 No Tickets Needed</Badge>
                    <Badge className="bg-white/20 text-white">⚡ Instant Rewards</Badge>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Upcoming Events Preview */}
      <Card className="vault-card border-dashed border-muted-foreground/30">
        <CardContent className="p-4 text-center">
          <div className="text-sm text-muted-foreground mb-2">🔮 Coming Soon</div>
          <div className="text-lg font-semibold">🎄 Christmas Mega Event</div>
          <div className="text-sm text-muted-foreground">December 24-26: Triple rewards & snow theme!</div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};