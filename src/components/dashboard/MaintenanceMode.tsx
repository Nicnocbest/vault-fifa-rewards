import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceData {
  is_active: boolean;
  message: string;
  expected_downtime: string;
}

export const MaintenanceMode = () => {
  const [maintenance, setMaintenance] = useState<MaintenanceData | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get current user to check if admin
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email || null;
      console.log('Current user email:', email);
      setUserEmail(email);
    };

    // Check for maintenance mode
    const checkMaintenance = async () => {
      const { data } = await supabase
        .from('maintenance_mode')
        .select('*')
        .limit(1)
        .single();

      console.log('Maintenance data:', data);
      if (data && data.is_active) {
        setMaintenance(data);
      } else {
        setMaintenance(null);
      }
    };

    getCurrentUser();
    checkMaintenance();

    // Listen for real-time maintenance updates - INSTANT kick out!
    const channel = supabase
      .channel('maintenance_realtime')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'maintenance_mode'
      }, (payload) => {
        // INSTANT response to maintenance changes!
        console.log('MAINTENANCE MODE CHANGED!', payload);
        checkMaintenance();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Don't show maintenance mode for admins so they can turn it off
  // Also don't show if no user is logged in
  const isAdmin = userEmail === 'admin@vaultfut.com';
  console.log('Is admin check:', { userEmail, isAdmin, maintenance: !!maintenance });
  
  if (!maintenance || isAdmin || !userEmail) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-lg flex items-center justify-center">
      <div className="text-center text-white max-w-2xl mx-4">
        {/* Construction Animation */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Construction Helmet */}
            <div className="w-24 h-24 bg-yellow-500 rounded-full mx-auto relative animate-bounce">
              <div className="absolute top-2 left-6 w-12 h-12 bg-yellow-400 rounded-full"></div>
              <div className="absolute top-4 left-8 w-8 h-8 bg-yellow-600 rounded-full"></div>
              <div className="absolute bottom-0 left-4 w-16 h-4 bg-yellow-600 rounded-b-lg"></div>
            </div>
            
            {/* Tools Animation */}
            <div className="absolute -top-4 -left-8 animate-spin-slow">
              <div className="w-6 h-6 bg-gray-400 rotate-45"></div>
            </div>
            <div className="absolute -top-4 -right-8 animate-ping">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            </div>
          </div>

          {/* Warning Signs */}
          <div className="flex justify-center space-x-8 mb-6">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-16 h-16 bg-gradient-to-b from-yellow-400 to-orange-500 rotate-45 animate-pulse"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <div className="w-full h-full border-4 border-black rotate-45 flex items-center justify-center">
                  <span className="text-black font-bold text-xl -rotate-90">!</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Text */}
        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-yellow-400 font-vault animate-pulse tracking-wider">
            🚧 {maintenance.message} 🚧
          </h1>
          
          <div className="text-2xl text-yellow-300 font-semibold">
            EXPECTED DOWNTIME
          </div>
          
          <div className="text-4xl font-bold text-white bg-red-600 py-4 px-8 rounded-lg inline-block animate-bounce shadow-2xl">
            {maintenance.expected_downtime}
          </div>

          <div className="text-lg text-gray-300 max-w-md mx-auto">
            We're upgrading VaultFUT to serve you better. Thanks for your patience!
          </div>

          {/* Loading Bars */}
          <div className="mt-8 space-y-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full animate-[loading_3s_ease-in-out_infinite]" style={{ width: '0%' }} />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-orange-400 h-2 rounded-full animate-[loading_3s_ease-in-out_infinite_0.5s]" style={{ width: '0%' }} />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-red-400 h-2 rounded-full animate-[loading_3s_ease-in-out_infinite_1s]" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0%, 100% { width: 0%; }
          50% { width: 100%; }
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
};