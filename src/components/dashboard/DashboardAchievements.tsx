import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Zap, Eye } from "lucide-react";

export const DashboardAchievements = () => {
  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Watch your first ad",
      icon: Eye,
      progress: 100,
      maxProgress: 1,
      completed: true,
      reward: 100,
      rarity: "common"
    },
    {
      id: 2,
      name: "Ad Watcher",
      description: "Watch 10 ads",
      icon: Eye,
      progress: 3,
      maxProgress: 10,
      completed: false,
      reward: 500,
      rarity: "common"
    },
    {
      id: 3,
      name: "Dedicated Viewer",
      description: "Watch 50 ads",
      icon: Target,
      progress: 3,
      maxProgress: 50,
      completed: false,
      reward: 2000,
      rarity: "rare"
    },
    {
      id: 4,
      name: "Coin Collector",
      description: "Earn 10,000 coins total",
      icon: Trophy,
      progress: 1500,
      maxProgress: 10000,
      completed: false,
      reward: 1000,
      rarity: "epic"
    },
    {
      id: 5,
      name: "Daily Grinder",
      description: "Claim daily rewards for 7 days",
      icon: Star,
      progress: 1,
      maxProgress: 7,
      completed: false,
      reward: 5000,
      rarity: "legendary"
    },
    {
      id: 6,
      name: "Vault Master",
      description: "Complete all other achievements",
      icon: Zap,
      progress: 1,
      maxProgress: 4,
      completed: false,
      reward: 10000,
      rarity: "legendary"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "rare": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "epic": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "legendary": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default: return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="vault-card">
        <h2 className="text-3xl font-bold mb-2">Achievements</h2>
        <p className="text-muted-foreground">
          Complete challenges to earn bonus rewards and show off your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="vault-card text-center">
          <CardContent className="pt-6">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        
        <Card className="vault-card text-center">
          <CardContent className="pt-6">
            <Target className="w-8 h-8 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        
        <Card className="vault-card text-center">
          <CardContent className="pt-6">
            <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold">600</div>
            <div className="text-sm text-muted-foreground">Coins Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const IconComponent = achievement.icon;
          const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
          
          return (
            <Card 
              key={achievement.id}
              className={`vault-card transition-all ${
                achievement.completed 
                  ? 'ring-2 ring-primary/50 bg-primary/5' 
                  : 'hover:border-primary/30'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      achievement.completed 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted/20 text-muted-foreground'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    {achievement.completed && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        ✓ Complete
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className="h-2"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Reward: {achievement.reward} coins
                    </span>
                    {achievement.completed && (
                      <Badge variant="outline" className="text-primary border-primary">
                        +{achievement.reward} earned
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};