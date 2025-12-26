export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      birthday_claims: {
        Row: {
          address_snapshot: Json | null
          claimed_at: string
          created_at: string
          discount_code: string | null
          gift_type: string
          id: string
          shipped: boolean | null
          user_id: string
          year: number
          years_with_us: number
        }
        Insert: {
          address_snapshot?: Json | null
          claimed_at?: string
          created_at?: string
          discount_code?: string | null
          gift_type: string
          id?: string
          shipped?: boolean | null
          user_id: string
          year: number
          years_with_us: number
        }
        Update: {
          address_snapshot?: Json | null
          claimed_at?: string
          created_at?: string
          discount_code?: string | null
          gift_type?: string
          id?: string
          shipped?: boolean | null
          user_id?: string
          year?: number
          years_with_us?: number
        }
        Relationships: []
      }
      custom_orders: {
        Row: {
          accent_nails: Json | null
          artwork_selections: Json | null
          artwork_type: string | null
          base_product_handle: string | null
          charms_preferences: string | null
          charms_tier: string | null
          colors: Json | null
          created_at: string
          custom_artwork_description: string | null
          effects: Json | null
          estimated_price: number | null
          finish: string
          id: string
          inspiration_images: string[] | null
          length: string
          notes: string | null
          requires_quote: boolean | null
          rhinestones_tier: string | null
          shape: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accent_nails?: Json | null
          artwork_selections?: Json | null
          artwork_type?: string | null
          base_product_handle?: string | null
          charms_preferences?: string | null
          charms_tier?: string | null
          colors?: Json | null
          created_at?: string
          custom_artwork_description?: string | null
          effects?: Json | null
          estimated_price?: number | null
          finish: string
          id?: string
          inspiration_images?: string[] | null
          length: string
          notes?: string | null
          requires_quote?: boolean | null
          rhinestones_tier?: string | null
          shape: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accent_nails?: Json | null
          artwork_selections?: Json | null
          artwork_type?: string | null
          base_product_handle?: string | null
          charms_preferences?: string | null
          charms_tier?: string | null
          colors?: Json | null
          created_at?: string
          custom_artwork_description?: string | null
          effects?: Json | null
          estimated_price?: number | null
          finish?: string
          id?: string
          inspiration_images?: string[] | null
          length?: string
          notes?: string | null
          requires_quote?: boolean | null
          rhinestones_tier?: string | null
          shape?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      drop_claims: {
        Row: {
          address_snapshot: Json
          claimed_at: string
          created_at: string
          id: string
          month: string
          status: string
          user_id: string
        }
        Insert: {
          address_snapshot: Json
          claimed_at?: string
          created_at?: string
          id?: string
          month: string
          status?: string
          user_id: string
        }
        Update: {
          address_snapshot?: Json
          claimed_at?: string
          created_at?: string
          id?: string
          month?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      nail_club_subscribers: {
        Row: {
          email: string
          first_name: string | null
          id: string
          source: string
          subscribed_at: string
        }
        Insert: {
          email: string
          first_name?: string | null
          id?: string
          source?: string
          subscribed_at?: string
        }
        Update: {
          email?: string
          first_name?: string | null
          id?: string
          source?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      nail_profiles: {
        Row: {
          created_at: string
          id: string
          is_selected: boolean | null
          name: string
          sizes: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_selected?: boolean | null
          name: string
          sizes?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_selected?: boolean | null
          name?: string
          sizes?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accepts_marketing: boolean | null
          birthday: string | null
          created_at: string
          email: string | null
          first_name: string | null
          has_purchased: boolean | null
          id: string
          last_name: string | null
          phone: string | null
          shipping_address_line1: string | null
          shipping_address_line2: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_state: string | null
          shipping_zip: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accepts_marketing?: boolean | null
          birthday?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          has_purchased?: boolean | null
          id?: string
          last_name?: string | null
          phone?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accepts_marketing?: boolean | null
          birthday?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          has_purchased?: boolean | null
          id?: string
          last_name?: string | null
          phone?: string | null
          shipping_address_line1?: string | null
          shipping_address_line2?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          apartment_unit: string | null
          city: string
          country: string
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          postal_code: string
          state: string
          street_address: string
          user_id: string
        }
        Insert: {
          apartment_unit?: string | null
          city: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          postal_code: string
          state: string
          street_address: string
          user_id: string
        }
        Update: {
          apartment_unit?: string | null
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          postal_code?: string
          state?: string
          street_address?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
