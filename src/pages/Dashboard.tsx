import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Home, ShoppingCart, MessageSquare, Trophy, Settings } from "lucide-react";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { DashboardShop } from "@/components/dashboard/DashboardShop";
import { DashboardMessages } from "@/components/dashboard/DashboardMessages";
import { DashboardAchievements } from "@/components/dashboard/DashboardAchievements";
import { DashboardAdmin } from "@/components/dashboard/DashboardAdmin";
import { BroadcastAlert } from "@/components/dashboard/BroadcastAlert";
import { FullScreenBroadcast } from "@/components/dashboard/FullScreenBroadcast";

const Dashboard = () => {
  const [userEmail] = useState(() => localStorage.getItem("vaultfut_email") || "");
  const [coins] = useState(500); // Starting balance
  const isAdmin = userEmail === "nicolasmoryson2012@gmail.com";

  return (
    <div className="min-h-screen bg-background">
      {/* Full Screen Broadcast */}
      <FullScreenBroadcast />
      
      {/* Broadcast Alert */}
      <BroadcastAlert />
      
      {/* Header */}
      <header className="border-b border-border/30 bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VaultFUT
              </h1>
              <Badge variant="secondary" className="font-vault">
                BETA
              </Badge>
            </div>
            
            {/* Coin Balance */}
            <div className="vault-card py-2 px-4 bg-primary/10 border-primary/30">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-foreground">C</span>
                </div>
                <span className="font-vault font-bold text-primary">
                  {coins.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit mb-8 bg-card/80 backdrop-blur-sm">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Shop</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="home">
            <DashboardHome />
          </TabsContent>

          <TabsContent value="shop">
            <DashboardShop />
          </TabsContent>

          <TabsContent value="messages">
            <DashboardMessages />
          </TabsContent>

          <TabsContent value="achievements">
            <DashboardAchievements />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <DashboardAdmin />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;