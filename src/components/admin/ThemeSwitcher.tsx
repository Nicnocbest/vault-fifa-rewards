import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Calendar, Snowflake, Ghost, Heart, Sun, Zap } from "lucide-react";
import { toast } from "sonner";

interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  effects: string[];
}

export const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const themes: Theme[] = [
    {
      id: "default",
      name: "VaultFUT Classic",
      description: "Original dark vault theme with gold accents",
      icon: "🏦",
      active: currentTheme === "default",
      colors: {
        primary: "#FFD700",
        secondary: "#1B1B1B", 
        accent: "#00FF6A"
      },
      effects: ["Gold glow", "Vault animations", "Coin particles"]
    },
    {
      id: "christmas",
      name: "🎄 XMAS Mode",
      description: "Festive Christmas theme with snow and gifts",
      icon: "🎄",
      active: currentTheme === "christmas",
      colors: {
        primary: "#FF0000",
        secondary: "#0F5132",
        accent: "#FFD700"
      },
      effects: ["Falling snow", "Jingle sounds", "Gift animations", "Christmas music"]
    },
    {
      id: "halloween",
      name: "🎃 Halloween Mode", 
      description: "Spooky Halloween theme with pumpkins and ghosts",
      icon: "🎃",
      active: currentTheme === "halloween",
      colors: {
        primary: "#FF6B00",
        secondary: "#1A0A00",
        accent: "#8B00FF"
      },
      effects: ["Floating ghosts", "Spooky sounds", "Pumpkin particles", "Eerie music"]
    },
    {
      id: "valentine",
      name: "💝 Valentine Mode",
      description: "Romantic theme with hearts and pink colors",
      icon: "💝",
      active: currentTheme === "valentine",
      colors: {
        primary: "#FF69B4",
        secondary: "#4A0E4E",
        accent: "#FFB6C1"
      },
      effects: ["Floating hearts", "Love sounds", "Rose petals", "Romantic music"]
    },
    {
      id: "summer",
      name: "☀️ Summer Vibes",
      description: "Bright summer theme with sun and fireworks",
      icon: "☀️",
      active: currentTheme === "summer",
      colors: {
        primary: "#FFD700",
        secondary: "#87CEEB",
        accent: "#FF6347"
      },
      effects: ["Fireworks", "Beach sounds", "Sun rays", "Tropical music"]
    },
    {
      id: "cyber",
      name: "⚡ Cyber Mode",
      description: "Futuristic cyberpunk theme with neon effects",
      icon: "⚡",
      active: currentTheme === "cyber",
      colors: {
        primary: "#00FFFF",
        secondary: "#0A0A0A",
        accent: "#FF00FF"
      },
      effects: ["Neon glow", "Tech sounds", "Matrix rain", "Synth music"]
    }
  ];

  const switchTheme = async (themeId: string) => {
    try {
      // Apply theme immediately for preview
      applyThemeStyles(themeId);
      
      // Save to database
      // await supabase.from('site_settings').update({ theme: themeId })...
      
      setCurrentTheme(themeId);
      toast.success(`Theme switched to ${themes.find(t => t.id === themeId)?.name}!`);
    } catch (error) {
      toast.error("Failed to switch theme");
    }
  };

  const previewThemeTemp = (themeId: string) => {
    setPreviewTheme(themeId);
    applyThemeStyles(themeId);
    
    // Auto-revert after 5 seconds
    setTimeout(() => {
      if (previewTheme === themeId) {
        setPreviewTheme(null);
        applyThemeStyles(currentTheme);
      }
    }, 5000);
  };

  const applyThemeStyles = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply CSS variables
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    
    // Apply theme class
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeId}`);

    // Apply special effects
    applyThemeEffects(themeId);
  };

  const applyThemeEffects = (themeId: string) => {
    // Remove existing effects
    document.querySelectorAll('.theme-effect').forEach(el => el.remove());
    
    const effectsContainer = document.createElement('div');
    effectsContainer.className = 'theme-effect fixed inset-0 pointer-events-none z-[1000]';
    
    switch (themeId) {
      case 'christmas':
        effectsContainer.innerHTML = `
          <div class="snowflakes">
            ${Array.from({ length: 50 }, (_, i) => 
              `<div class="snowflake animate-bounce" style="
                left: ${Math.random() * 100}%; 
                animation-delay: ${Math.random() * 3}s;
                animation-duration: ${3 + Math.random() * 2}s;
              ">❄️</div>`
            ).join('')}
          </div>
          <style>
            .snowflake {
              position: absolute;
              top: -10px;
              font-size: ${Math.random() * 10 + 10}px;
              animation: fall linear infinite;
            }
            @keyframes fall {
              to { transform: translateY(100vh) rotate(360deg); }
            }
          </style>
        `;
        break;
        
      case 'halloween':
        effectsContainer.innerHTML = `
          <div class="ghosts">
            ${Array.from({ length: 20 }, (_, i) => 
              `<div class="ghost animate-pulse" style="
                left: ${Math.random() * 100}%; 
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
              ">👻</div>`
            ).join('')}
          </div>
        `;
        break;
        
      case 'valentine':
        effectsContainer.innerHTML = `
          <div class="hearts">
            ${Array.from({ length: 30 }, (_, i) => 
              `<div class="heart animate-bounce" style="
                left: ${Math.random() * 100}%; 
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
                font-size: ${Math.random() * 15 + 10}px;
              ">💖</div>`
            ).join('')}
          </div>
        `;
        break;
        
      case 'summer':
        effectsContainer.innerHTML = `
          <div class="fireworks">
            ${Array.from({ length: 10 }, (_, i) => 
              `<div class="firework" style="
                left: ${Math.random() * 100}%; 
                top: ${Math.random() * 50}%;
                animation-delay: ${Math.random() * 3}s;
              ">🎆</div>`
            ).join('')}
          </div>
        `;
        break;
    }
    
    document.body.appendChild(effectsContainer);
  };

  useEffect(() => {
    // Initialize with current theme
    applyThemeStyles(currentTheme);
    
    return () => {
      // Cleanup effects on unmount
      document.querySelectorAll('.theme-effect').forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card className="vault-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Theme Switcher for Events</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Change the entire site theme instantly. All users will see the new theme in real-time!
          </div>
          
          {previewTheme && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="text-sm text-blue-400">
                🔍 Preview Mode Active - Theme will revert in 5 seconds
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <Card 
                key={theme.id}
                className={`relative cursor-pointer transition-all duration-300 ${
                  theme.active 
                    ? 'ring-2 ring-primary bg-primary/10' 
                    : 'hover:bg-card/50 hover:border-primary/30'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{theme.icon}</span>
                    {theme.active && (
                      <Badge className="bg-primary text-primary-foreground">
                        Active
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="font-bold mb-1">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {theme.description}
                  </p>
                  
                  {/* Color Preview */}
                  <div className="flex space-x-2 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                  
                  {/* Effects List */}
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground mb-1">Effects:</div>
                    <div className="flex flex-wrap gap-1">
                      {theme.effects.slice(0, 2).map((effect, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                      {theme.effects.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{theme.effects.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => previewThemeTemp(theme.id)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={theme.active}
                    >
                      👁️ Preview (5s)
                    </Button>
                    
                    <Button
                      onClick={() => switchTheme(theme.id)}
                      size="sm"
                      className="w-full vault-button"
                      disabled={theme.active}
                    >
                      {theme.active ? "Currently Active" : "Activate Theme"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Schedule */}
      <Card className="vault-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Event Schedule</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎄</span>
                <div>
                  <div className="font-semibold">Christmas Event</div>
                  <div className="text-sm text-muted-foreground">Dec 24-26, 2024</div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🎃</span>
                <div>
                  <div className="font-semibold">Halloween Event</div>
                  <div className="text-sm text-muted-foreground">Oct 31, 2024</div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};