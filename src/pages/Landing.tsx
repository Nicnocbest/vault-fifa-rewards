import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import vaultBackground from "@/assets/vault-background.jpg";

const Landing = () => {
  const [email, setEmail] = useState("");
  const [isVaultOpening, setIsVaultOpening] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEnterVault = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email to access the vault.",
        variant: "destructive",
      });
      return;
    }

    // Store email in localStorage for now
    localStorage.setItem("vaultfut_email", email);
    
    // Trigger vault opening animation
    setIsVaultOpening(true);
    
    toast({
      title: "Vault Opening...",
      description: "Welcome to VaultFUT!",
    });

    // Navigate to dashboard after animation
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vault Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${vaultBackground})` }}
      />
      
      {/* Animated Vault Door Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Vault Door Animation Container */}
          <div className={`mb-12 ${isVaultOpening ? 'animate-vault-open' : ''}`}>
            <div className="vault-card p-12 gold-glow">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary via-accent to-primary animate-pulse-gold flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-background/80 flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary rounded-full animate-ping" />
                </div>
              </div>
              
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                VaultFUT
              </h1>
              
              <p className="text-2xl text-muted-foreground mb-8 font-vault">
                Unlock FIFA Rewards
              </p>
            </div>
          </div>

          {/* Email Entry Form */}
          {!isVaultOpening && (
            <div className="vault-card max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-6 text-primary">
                Enter the Vault
              </h2>
              
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email to enter"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="vault-input text-center"
                  onKeyPress={(e) => e.key === 'Enter' && handleEnterVault()}
                />
                
                <Button
                  onClick={handleEnterVault}
                  className="vault-button w-full"
                  size="lg"
                >
                  Open the Vault
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                By entering, you accept our Terms
              </p>
            </div>
          )}

          {/* Loading State */}
          {isVaultOpening && (
            <div className="vault-card max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-primary mt-4 font-vault">Accessing Vault...</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Coins Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 bg-primary rounded-full animate-coin-fall opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Landing;