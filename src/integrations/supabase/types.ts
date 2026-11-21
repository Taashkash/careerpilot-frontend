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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      job_applications: {
        Row: {
          applied_on: string
          company: string
          created_at: string
          id: string
          interview_on: string | null
          job_url: string | null
          location: string
          notes: string | null
          role: string
          salary: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_on?: string
          company: string
          created_at?: string
          id?: string
          interview_on?: string | null
          job_url?: string | null
          location?: string
          notes?: string | null
          role: string
          salary?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_on?: string
          company?: string
          created_at?: string
          id?: string
          interview_on?: string | null
          job_url?: string | null
          location?: string
          notes?: string | null
          role?: string
          salary?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_plan_weeks: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          exercise: string
          hours: number
          id: string
          objective: string
          project: string
          resource: string
          task_key: string
          topic: string
          updated_at: string
          url: string
          user_id: string
          week: number
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          exercise?: string
          hours?: number
          id?: string
          objective?: string
          project?: string
          resource?: string
          task_key?: string
          topic: string
          updated_at?: string
          url?: string
          user_id: string
          week: number
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          exercise?: string
          hours?: number
          id?: string
          objective?: string
          project?: string
          resource?: string
          task_key?: string
          topic?: string
          updated_at?: string
          url?: string
          user_id?: string
          week?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          created_at: string
          deliverables: string[]
          description: string
          difficulty: string
          duration: string
          id: string
          position: number
          skills: string[]
          target_role: string
          technologies: string[]
          title: string
        }
        Insert: {
          created_at?: string
          deliverables?: string[]
          description?: string
          difficulty?: string
          duration?: string
          id: string
          position?: number
          skills?: string[]
          target_role?: string
          technologies?: string[]
          title: string
        }
        Update: {
          created_at?: string
          deliverables?: string[]
          description?: string
          difficulty?: string
          duration?: string
          id?: string
          position?: number
          skills?: string[]
          target_role?: string
          technologies?: string[]
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string
          created_at: string
          current_position: string
          education: string
          experience: string
          full_name: string
          industry: string
          learning_format: string
          location: string
          notify_interview: boolean
          notify_tips: boolean
          notify_weekly: boolean
          onboarded: boolean
          soft_skills: string
          study_hours: number
          target_role: string
          technical_skills: string
          timeline: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string
          created_at?: string
          current_position?: string
          education?: string
          experience?: string
          full_name?: string
          industry?: string
          learning_format?: string
          location?: string
          notify_interview?: boolean
          notify_tips?: boolean
          notify_weekly?: boolean
          onboarded?: boolean
          soft_skills?: string
          study_hours?: number
          target_role?: string
          technical_skills?: string
          timeline?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string
          created_at?: string
          current_position?: string
          education?: string
          experience?: string
          full_name?: string
          industry?: string
          learning_format?: string
          location?: string
          notify_interview?: boolean
          notify_tips?: boolean
          notify_weekly?: boolean
          onboarded?: boolean
          soft_skills?: string
          study_hours?: number
          target_role?: string
          technical_skills?: string
          timeline?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          file_name: string
          id: string
          mime_type: string
          size_bytes: number
          storage_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string
          size_bytes?: number
          storage_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string
          size_bytes?: number
          storage_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roadmap_tasks: {
        Row: {
          created_at: string
          done: boolean
          hours: number
          id: string
          phase_key: string
          phase_position: number
          phase_title: string
          phase_weeks: string
          position: number
          resource: string
          task_key: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          hours?: number
          id?: string
          phase_key: string
          phase_position?: number
          phase_title: string
          phase_weeks?: string
          position?: number
          resource?: string
          task_key: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          done?: boolean
          hours?: number
          id?: string
          phase_key?: string
          phase_position?: number
          phase_title?: string
          phase_weeks?: string
          position?: number
          resource?: string
          task_key?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_analyses: {
        Row: {
          created_at: string
          id: string
          job_description: string
          readiness: number
          target_role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_description?: string
          readiness?: number
          target_role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_description?: string
          readiness?: number
          target_role?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_gaps: {
        Row: {
          analysis_id: string
          category: string
          created_at: string
          current_level: number
          id: string
          position: number
          required_level: number
          skill: string
          user_id: string
        }
        Insert: {
          analysis_id: string
          category?: string
          created_at?: string
          current_level: number
          id?: string
          position?: number
          required_level: number
          skill: string
          user_id: string
        }
        Update: {
          analysis_id?: string
          category?: string
          created_at?: string
          current_level?: number
          id?: string
          position?: number
          required_level?: number
          skill?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_gaps_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "skill_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      target_roles: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          position: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          name: string
          position?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          position?: number
        }
        Relationships: []
      }
      user_projects: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          project_id: string
          saved: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          project_id: string
          saved?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          project_id?: string
          saved?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
