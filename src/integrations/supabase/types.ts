export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      access_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          key: string
          updated_at: string
          used: boolean
          used_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          key: string
          updated_at?: string
          used?: boolean
          used_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          key?: string
          updated_at?: string
          used?: boolean
          used_at?: string | null
        }
        Relationships: []
      }
      achievements: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          name: string
          requirement_type: string
          requirement_value: number
          reward_coins: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          name: string
          requirement_type: string
          requirement_value: number
          reward_coins?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: number
          reward_coins?: number
          updated_at?: string
        }
        Relationships: []
      }
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          data: Json | null
          description: string
          id: string
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          data?: Json | null
          description: string
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          data?: Json | null
          description?: string
          id?: string
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_actions_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcasts: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          is_active: boolean
          message: string
          start_time: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          is_active?: boolean
          message: string
          start_time?: string
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          is_active?: boolean
          message?: string
          start_time?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          id: string
          is_active: boolean
          multiplier: number | null
          name: string
          start_time: string
          theme_colors: Json | null
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          is_active?: boolean
          multiplier?: number | null
          name: string
          start_time: string
          theme_colors?: Json | null
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          is_active?: boolean
          multiplier?: number | null
          name?: string
          start_time?: string
          theme_colors?: Json | null
          type?: string
        }
        Relationships: []
      }
      exchange_orders: {
        Row: {
          buy_now_price: number
          coins_used: number
          created_at: string
          id: string
          player_name: string
          player_rating: number
          position: string
          special_instructions: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          buy_now_price: number
          coins_used: number
          created_at?: string
          id?: string
          player_name: string
          player_rating: number
          position: string
          special_instructions?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          buy_now_price?: number
          coins_used?: number
          created_at?: string
          id?: string
          player_name?: string
          player_rating?: number
          position?: string
          special_instructions?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      futearn_orders: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          key_id: string
          platform: string
          starting_price: number
          status: string
          updated_at: string
          username: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          key_id: string
          platform: string
          starting_price: number
          status?: string
          updated_at?: string
          username: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          key_id?: string
          platform?: string
          starting_price?: number
          status?: string
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "futearn_orders_key_id_fkey"
            columns: ["key_id"]
            isOneToOne: false
            referencedRelation: "access_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_keys: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          key_code: string
          updated_at: string
          used: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          key_code: string
          updated_at?: string
          used?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          key_code?: string
          updated_at?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      lootboxes: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          opened_at: string | null
          rarity: string
          reward_amount: number
          status: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          opened_at?: string | null
          rarity?: string
          reward_amount?: number
          status?: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          opened_at?: string | null
          rarity?: string
          reward_amount?: number
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lootboxes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buy_now_price: number | null
          coins_used: number
          created_at: string
          declined_reason: string | null
          email: string
          fifa_coins_received: number
          fifa_id: string
          id: string
          player_name: string | null
          position: string | null
          reason: string | null
          status: string
          updated_at: string
          user_id: string
          webhook_sent: boolean
        }
        Insert: {
          buy_now_price?: number | null
          coins_used: number
          created_at?: string
          declined_reason?: string | null
          email: string
          fifa_coins_received: number
          fifa_id: string
          id?: string
          player_name?: string | null
          position?: string | null
          reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
          webhook_sent?: boolean
        }
        Update: {
          buy_now_price?: number | null
          coins_used?: number
          created_at?: string
          declined_reason?: string | null
          email?: string
          fifa_coins_received?: number
          fifa_id?: string
          id?: string
          player_name?: string | null
          position?: string | null
          reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          webhook_sent?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string | null
          ads_watched: number
          avatar_url: string | null
          coin_balance: number
          created_at: string
          daily_login_streak: number
          display_name: string | null
          email: string
          fifa_id: string | null
          id: string
          last_daily_login: string | null
          last_lootbox_claim: string | null
          referral_code: string | null
          referrer_id: string | null
          total_ad_rewards: number | null
          total_referrals: number | null
          updated_at: string
        }
        Insert: {
          account_status?: string | null
          ads_watched?: number
          avatar_url?: string | null
          coin_balance?: number
          created_at?: string
          daily_login_streak?: number
          display_name?: string | null
          email: string
          fifa_id?: string | null
          id: string
          last_daily_login?: string | null
          last_lootbox_claim?: string | null
          referral_code?: string | null
          referrer_id?: string | null
          total_ad_rewards?: number | null
          total_referrals?: number | null
          updated_at?: string
        }
        Update: {
          account_status?: string | null
          ads_watched?: number
          avatar_url?: string | null
          coin_balance?: number
          created_at?: string
          daily_login_streak?: number
          display_name?: string | null
          email?: string
          fifa_id?: string | null
          id?: string
          last_daily_login?: string | null
          last_lootbox_claim?: string | null
          referral_code?: string | null
          referrer_id?: string | null
          total_ad_rewards?: number | null
          total_referrals?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_rewards: {
        Row: {
          created_at: string
          id: string
          referee_id: string
          referrer_id: string
          reward_amount: number
          reward_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          referee_id: string
          referrer_id: string
          reward_amount: number
          reward_type: string
        }
        Update: {
          created_at?: string
          id?: string
          referee_id?: string
          referrer_id?: string
          reward_amount?: number
          reward_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_rewards_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          completed_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          completed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          completed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_coins: {
        Args: {
          _user_id: string
          _amount: number
          _transaction_type: string
          _description?: string
        }
        Returns: boolean
      }
      award_ad_coins: {
        Args: { _user_id: string; _coins?: number }
        Returns: boolean
      }
      check_and_award_achievements: {
        Args: { _user_id: string }
        Returns: boolean
      }
      create_daily_lootbox: {
        Args: { _user_id: string }
        Returns: boolean
      }
      ensure_admin_key: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      handle_referral_signup: {
        Args: { _referee_id: string; _referral_code: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
