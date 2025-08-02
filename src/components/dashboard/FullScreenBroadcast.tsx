import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Broadcast {
  id: string;
  title: string;
  message: string;
  priority: string;
  created_at: string;
}

export const FullScreenBroadcast = () => {
  const [currentBroadcast, setCurrentBroadcast] = useState<Broadcast | null>(null);
  const [showPriority, setShowPriority] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Check for new broadcasts
    const checkBroadcasts = async () => {
      const { data } = await supabase
        .from('broadcasts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const broadcast = {
          id: data[0].id,
          title: data[0].title,
          message: data[0].message,
          priority: data[0].type || 'normal',
          created_at: data[0].created_at
        };
        const lastShownId = localStorage.getItem('last_broadcast_shown');
        
        // Show broadcast to everyone including admin
        if (broadcast.id !== lastShownId) {
          setCurrentBroadcast(broadcast);
          localStorage.setItem('last_broadcast_shown', broadcast.id);
          
          // Show priority first, then message after 2 seconds
          setTimeout(() => {
            setShowPriority(false);
            setShowMessage(true);
            
            // Hide everything after 5 seconds
            setTimeout(() => {
              setCurrentBroadcast(null);
              setShowPriority(true);
              setShowMessage(false);
            }, 5000);
          }, 2000);
        }
      }
    };

    checkBroadcasts();

    // Listen for real-time broadcast updates - INSTANT kick out!
    const channel = supabase
      .channel('broadcast_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'broadcasts'
      }, (payload) => {
        // INSTANT response to new broadcasts!
        console.log('NEW BROADCAST DETECTED!', payload);
        checkBroadcasts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!currentBroadcast) return null;

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          bgColor: 'bg-red-600',
          emoji: '🚨',
          text: 'CRITICAL ALERT!',
          animation: 'animate-pulse'
        };
      case 'normal':
        return {
          bgColor: 'bg-yellow-600',
          emoji: '⚠️',
          text: 'ATTENTION USERS!',
          animation: 'animate-bounce'
        };
      case 'low':
        return {
          bgColor: 'bg-blue-600',
          emoji: 'ℹ️',
          text: 'INFORMATION',
          animation: ''
        };
      default:
        return {
          bgColor: 'bg-yellow-600',
          emoji: '⚠️',
          text: 'ATTENTION USERS!',
          animation: 'animate-bounce'
        };
    }
  };

  const config = getPriorityConfig(currentBroadcast.priority);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white">
        {showPriority && (
          <div className={`transition-all duration-1000 ${config.animation}`}>
            <div className={`inline-block px-12 py-6 rounded-xl ${config.bgColor} shadow-2xl`}>
              <div className="flex items-center space-x-4">
                <span className="text-6xl">{config.emoji}</span>
                <div className="text-left">
                  <h1 className="text-4xl font-bold font-vault tracking-wider">
                    {config.text}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        )}

        {showMessage && (
          <div className="transition-all duration-1000 animate-fade-in">
            <div className="bg-card/95 backdrop-blur-xl border border-border/30 rounded-2xl p-8 max-w-2xl mx-4 vault-card">
              <h2 className="text-3xl font-bold mb-4 text-primary font-vault">
                {currentBroadcast.title}
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {currentBroadcast.message}
              </p>
              
              {/* Auto-close indicator */}
              <div className="mt-6">
                <div className="w-full bg-border/30 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-[shrink_5s_linear_forwards]" style={{
                    animation: 'shrink 5s linear forwards'
                  }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This message will close automatically
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};