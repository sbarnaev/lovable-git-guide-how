export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      archetype_descriptions: {
        Row: {
          burnout_signs: string[] | null
          challenges: string[] | null
          code: string
          created_at: string | null
          description: string | null
          development_task: string | null
          distorted_manifestation: string | null
          energy_drains: string[] | null
          energy_sources: string[] | null
          female_image_url: string | null
          flow_signs: string[] | null
          formula: string | null
          generator_formula: string | null
          generator_recommendation: string | null
          id: string
          key_distortions: string[] | null
          key_task: string | null
          main_transformation: string | null
          male_image_url: string | null
          mission_challenges: string | null
          mission_essence: string | null
          mission_obstacles: string[] | null
          mission_realization_factors: string[] | null
          non_working_aspects: string[] | null
          potential_realization_ways: string[] | null
          realization_obstacles: string[] | null
          realization_type: string | null
          recommendations: string[] | null
          resource_manifestation: string | null
          resource_qualities: string[] | null
          strengths: string[] | null
          success_sources: string[] | null
          title: string
          updated_at: string | null
          value: number
          working_aspects: string[] | null
          world_contact_basis: string | null
        }
        Insert: {
          burnout_signs?: string[] | null
          challenges?: string[] | null
          code: string
          created_at?: string | null
          description?: string | null
          development_task?: string | null
          distorted_manifestation?: string | null
          energy_drains?: string[] | null
          energy_sources?: string[] | null
          female_image_url?: string | null
          flow_signs?: string[] | null
          formula?: string | null
          generator_formula?: string | null
          generator_recommendation?: string | null
          id?: string
          key_distortions?: string[] | null
          key_task?: string | null
          main_transformation?: string | null
          male_image_url?: string | null
          mission_challenges?: string | null
          mission_essence?: string | null
          mission_obstacles?: string[] | null
          mission_realization_factors?: string[] | null
          non_working_aspects?: string[] | null
          potential_realization_ways?: string[] | null
          realization_obstacles?: string[] | null
          realization_type?: string | null
          recommendations?: string[] | null
          resource_manifestation?: string | null
          resource_qualities?: string[] | null
          strengths?: string[] | null
          success_sources?: string[] | null
          title: string
          updated_at?: string | null
          value: number
          working_aspects?: string[] | null
          world_contact_basis?: string | null
        }
        Update: {
          burnout_signs?: string[] | null
          challenges?: string[] | null
          code?: string
          created_at?: string | null
          description?: string | null
          development_task?: string | null
          distorted_manifestation?: string | null
          energy_drains?: string[] | null
          energy_sources?: string[] | null
          female_image_url?: string | null
          flow_signs?: string[] | null
          formula?: string | null
          generator_formula?: string | null
          generator_recommendation?: string | null
          id?: string
          key_distortions?: string[] | null
          key_task?: string | null
          main_transformation?: string | null
          male_image_url?: string | null
          mission_challenges?: string | null
          mission_essence?: string | null
          mission_obstacles?: string[] | null
          mission_realization_factors?: string[] | null
          non_working_aspects?: string[] | null
          potential_realization_ways?: string[] | null
          realization_obstacles?: string[] | null
          realization_type?: string | null
          recommendations?: string[] | null
          resource_manifestation?: string | null
          resource_qualities?: string[] | null
          strengths?: string[] | null
          success_sources?: string[] | null
          title?: string
          updated_at?: string | null
          value?: number
          working_aspects?: string[] | null
          world_contact_basis?: string | null
        }
        Relationships: []
      }
      calculation_notes: {
        Row: {
          calculation_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          calculation_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          calculation_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
