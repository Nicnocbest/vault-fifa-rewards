import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DashboardHome = () => {
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const { toast } = useToast();

  const handleDailyReward = () => {
    setDailyRewardClaimed(true);
    toast({
      title: "Daily Reward Claimed! 🎉",
      description: "You received 500 coins!",
    });
  };

  const handleWatchAd = () => {
    setAdWatched(true);
    toast({
      title: "Ad Reward! 💰",
      description: "You earned 100 coins for watching an ad!",
    });
    
    // Reset after 5 seconds for demo
    setTimeout(() => setAdWatched(false), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="vault-card">
        <h2 className="text-3xl font-bold mb-2">Welcome to the Vault</h2>
        <p className="text-muted-foreground">
          Earn FIFA coins through daily rewards and watching ads!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Daily Reward */}
        <Card className="vault-card gold-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-primary" />
              <span>Daily Reward</span>
            </CardTitle>
            <CardDescription>
              Claim your daily 500 coins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500</div>
                <div className="text-sm text-muted-foreground">Coins Available</div>
              </div>
              <Button 
                onClick={handleDailyReward}
                disabled={dailyRewardClaimed}
                className="vault-button w-full"
              >
                {dailyRewardClaimed ? "Claimed Today" : "Claim Reward"}
              </Button>
              {!dailyRewardClaimed && (
                <div className="text-xs text-center text-muted-foreground">
                  Resets in 12h 34m
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Watch Ad */}
        <Card className="vault-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5 text-secondary" />
              <span>Watch Ads</span>
            </CardTitle>
            <CardDescription>
              Earn 100 coins per ad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">100</div>
                <div className="text-sm text-muted-foreground">Coins per Ad</div>
              </div>
              <Button 
                onClick={handleWatchAd}
                disabled={adWatched}
                variant="secondary"
                className="w-full"
              >
                {adWatched ? "Ad Watched!" : "Watch Ad"}
              </Button>
              <div className="text-xs text-center text-muted-foreground">
                No limit on ads today
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Progress */}
        <Card className="vault-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Daily Progress</span>
            </CardTitle>
            <CardDescription>
              Track your daily earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Ads Watched</span>
                  <span className="text-sm">3/10</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Coins Earned</span>
                  <span className="text-sm">800/2000</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Complete goals for bonus rewards!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coin Rain Effect */}
      {(dailyRewardClaimed || adWatched) && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 bg-primary rounded-full animate-coin-fall opacity-80 font-vault text-xs flex items-center justify-center text-primary-foreground"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              C
            </div>
          ))}
        </div>
      )}
    </div>
  );
};