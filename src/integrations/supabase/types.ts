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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_sessions: {
        Row: {
          created_at: string
          id: string
          prompt: string
          response: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          prompt: string
          response?: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          prompt?: string
          response?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          country: string | null
          created_at: string
          id: string
          path: string | null
          project_id: string
          referrer: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          path?: string | null
          project_id: string
          referrer?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          path?: string | null
          project_id?: string
          referrer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      artifacts: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          run_id: string
          type: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          run_id: string
          type?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          run_id?: string
          type?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artifacts_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_proposals: {
        Row: {
          cal_link: string | null
          created_at: string
          currency: string
          id: string
          lead_id: string
          milestones: Json
          offer_type: string
          price_cents: number
          sent_at: string | null
          status: string
          summary: string
          timeline_days: number
          updated_at: string
        }
        Insert: {
          cal_link?: string | null
          created_at?: string
          currency?: string
          id?: string
          lead_id: string
          milestones?: Json
          offer_type: string
          price_cents: number
          sent_at?: string | null
          status?: string
          summary: string
          timeline_days: number
          updated_at?: string
        }
        Update: {
          cal_link?: string | null
          created_at?: string
          currency?: string
          id?: string
          lead_id?: string
          milestones?: Json
          offer_type?: string
          price_cents?: number
          sent_at?: string | null
          status?: string
          summary?: string
          timeline_days?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      builder_projects: {
        Row: {
          id: string
          project_data: Json
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          id?: string
          project_data?: Json
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          id?: string
          project_data?: Json
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      content_schedule: {
        Row: {
          body: string
          created_at: string
          id: string
          metadata: Json
          platform: string
          post_url: string | null
          published_at: string | null
          scheduled_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          metadata?: Json
          platform: string
          post_url?: string | null
          published_at?: string | null
          scheduled_at: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          metadata?: Json
          platform?: string
          post_url?: string | null
          published_at?: string | null
          scheduled_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      creator_waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      directory_listings: {
        Row: {
          approved_at: string | null
          created_at: string
          id: string
          metadata: Json
          notes: string | null
          platform: string
          priority: number
          review_url: string | null
          status: string
          submitted_at: string | null
          updated_at: string
          url: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          notes?: string | null
          platform: string
          priority?: number
          review_url?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          notes?: string | null
          platform?: string
          priority?: number
          review_url?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      frames: {
        Row: {
          cdn_url: string
          created_at: string
          file_size_bytes: number | null
          frame_index: number
          height: number | null
          id: string
          project_id: string
          video_job_id: string
          width: number | null
        }
        Insert: {
          cdn_url: string
          created_at?: string
          file_size_bytes?: number | null
          frame_index: number
          height?: number | null
          id?: string
          project_id: string
          video_job_id: string
          width?: number | null
        }
        Update: {
          cdn_url?: string
          created_at?: string
          file_size_bytes?: number | null
          frame_index?: number
          height?: number | null
          id?: string
          project_id?: string
          video_job_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "frames_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "frames_video_job_id_fkey"
            columns: ["video_job_id"]
            isOneToOne: false
            referencedRelation: "video_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_scores: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          score: number
          signals: Json
          suggested_next_action: string | null
          suggested_offer: string | null
          tier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          score?: number
          signals?: Json
          suggested_next_action?: string | null
          suggested_offer?: string | null
          tier?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          score?: number
          signals?: Json
          suggested_next_action?: string | null
          suggested_offer?: string | null
          tier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_scores_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          budget: string
          company: string | null
          created_at: string
          email: string
          goals: string[]
          id: string
          message: string | null
          name: string
          scope: string
          source: string | null
          status: string
          timeline: string
          type: string
        }
        Insert: {
          budget: string
          company?: string | null
          created_at?: string
          email: string
          goals?: string[]
          id?: string
          message?: string | null
          name: string
          scope: string
          source?: string | null
          status?: string
          timeline: string
          type: string
        }
        Update: {
          budget?: string
          company?: string | null
          created_at?: string
          email?: string
          goals?: string[]
          id?: string
          message?: string | null
          name?: string
          scope?: string
          source?: string | null
          status?: string
          timeline?: string
          type?: string
        }
        Relationships: []
      }
      manual_payments: {
        Row: {
          amount: number
          confirmed_at: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          method: string
          status: string
          transaction_ref: string | null
          user_id: string
          whatsapp_sent: boolean
        }
        Insert: {
          amount: number
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          method: string
          status?: string
          transaction_ref?: string | null
          user_id: string
          whatsapp_sent?: boolean
        }
        Update: {
          amount?: number
          confirmed_at?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          method?: string
          status?: string
          transaction_ref?: string | null
          user_id?: string
          whatsapp_sent?: boolean
        }
        Relationships: []
      }
      marketplace_listings: {
        Row: {
          asset_path: string | null
          category: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          preview_url: string | null
          price_cents: number | null
          search_vector: unknown
          slug: string
          title: string
        }
        Insert: {
          asset_path?: string | null
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          preview_url?: string | null
          price_cents?: number | null
          search_vector?: unknown
          slug: string
          title: string
        }
        Update: {
          asset_path?: string | null
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          preview_url?: string | null
          price_cents?: number | null
          search_vector?: unknown
          slug?: string
          title?: string
        }
        Relationships: []
      }
      marketplace_purchases: {
        Row: {
          id: string
          listing_id: string
          purchased_at: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          listing_id: string
          purchased_at?: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          listing_id?: string
          purchased_at?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_purchases_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_campaigns: {
        Row: {
          active: boolean
          cadence_days: number
          channel: string
          created_at: string
          id: string
          max_steps: number
          metadata: Json
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          cadence_days?: number
          channel?: string
          created_at?: string
          id?: string
          max_steps?: number
          metadata?: Json
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          cadence_days?: number
          channel?: string
          created_at?: string
          id?: string
          max_steps?: number
          metadata?: Json
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      outreach_events: {
        Row: {
          created_at: string
          id: string
          payload: Json
          send_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload?: Json
          send_id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          send_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_events_send_id_fkey"
            columns: ["send_id"]
            isOneToOne: false
            referencedRelation: "outreach_sends"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_sends: {
        Row: {
          body: string
          campaign_id: string
          company: string | null
          created_at: string
          error: string | null
          id: string
          lead_id: string | null
          metadata: Json
          next_send_at: string | null
          prospect_email: string
          prospect_name: string
          provider: string
          provider_message_id: string | null
          scheduled_at: string
          sent_at: string | null
          status: string
          subject: string
          template_key: string
          updated_at: string
        }
        Insert: {
          body: string
          campaign_id: string
          company?: string | null
          created_at?: string
          error?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json
          next_send_at?: string | null
          prospect_email: string
          prospect_name: string
          provider?: string
          provider_message_id?: string | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          subject: string
          template_key: string
          updated_at?: string
        }
        Update: {
          body?: string
          campaign_id?: string
          company?: string | null
          created_at?: string
          error?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json
          next_send_at?: string | null
          prospect_email?: string
          prospect_name?: string
          provider?: string
          provider_message_id?: string | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          subject?: string
          template_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "outreach_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_sends_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          display_name: string | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_current_period_end: string | null
          subscription_plan: string
          subscription_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string | null
          id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_current_period_end?: string | null
          subscription_plan?: string
          subscription_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_current_period_end?: string | null
          subscription_plan?: string
          subscription_status?: string | null
        }
        Relationships: []
      }
      project_secrets: {
        Row: {
          created_at: string
          encrypted_value: string
          id: string
          key: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          encrypted_value: string
          id?: string
          key: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          encrypted_value?: string
          id?: string
          key?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_secrets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          live_url: string | null
          slug: string
          tags: string[] | null
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          live_url?: string | null
          slug: string
          tags?: string[] | null
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          live_url?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      publish_audit: {
        Row: {
          approver_email: string | null
          commit_sha: string | null
          created_at: string
          diff_result: Json
          gates: Json
          id: string
          notes: string | null
          preview_url: string | null
          smoke_result: Json
        }
        Insert: {
          approver_email?: string | null
          commit_sha?: string | null
          created_at?: string
          diff_result?: Json
          gates?: Json
          id?: string
          notes?: string | null
          preview_url?: string | null
          smoke_result?: Json
        }
        Update: {
          approver_email?: string | null
          commit_sha?: string | null
          created_at?: string
          diff_result?: Json
          gates?: Json
          id?: string
          notes?: string | null
          preview_url?: string | null
          smoke_result?: Json
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          count: number
          ip: string
          window_start: string
        }
        Insert: {
          count?: number
          ip: string
          window_start: string
        }
        Update: {
          count?: number
          ip?: string
          window_start?: string
        }
        Relationships: []
      }
      revenue_events: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          id: string
          metadata: Json
          source: string
          source_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          metadata?: Json
          source: string
          source_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          metadata?: Json
          source?: string
          source_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      runs: {
        Row: {
          created_at: string
          id: string
          log: Json
          project_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          log?: Json
          project_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          log?: Json
          project_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ai_keys: {
        Row: {
          api_endpoint: string | null
          api_key_encrypted: string
          created_at: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_endpoint?: string | null
          api_key_encrypted: string
          created_at?: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_endpoint?: string | null
          api_key_encrypted?: string
          created_at?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_projects: {
        Row: {
          conversation_history: Json | null
          created_at: string
          current_css: string | null
          current_html: string | null
          current_js: string | null
          description: string | null
          frame_metadata: Json | null
          id: string
          published_url: string | null
          settings: Json | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          conversation_history?: Json | null
          created_at?: string
          current_css?: string | null
          current_html?: string | null
          current_js?: string | null
          description?: string | null
          frame_metadata?: Json | null
          id?: string
          published_url?: string | null
          settings?: Json | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          conversation_history?: Json | null
          created_at?: string
          current_css?: string | null
          current_html?: string | null
          current_js?: string | null
          description?: string | null
          frame_metadata?: Json | null
          id?: string
          published_url?: string | null
          settings?: Json | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      video_jobs: {
        Row: {
          aspect_ratio: string
          completed_at: string | null
          cost_usd: number | null
          created_at: string
          duration_seconds: number
          error_message: string | null
          external_job_id: string | null
          frame_count: number | null
          id: string
          input_image_url: string | null
          input_type: string
          model: string
          processing_time_ms: number | null
          project_id: string
          provider: string
          retry_count: number
          started_at: string | null
          status: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          aspect_ratio?: string
          completed_at?: string | null
          cost_usd?: number | null
          created_at?: string
          duration_seconds?: number
          error_message?: string | null
          external_job_id?: string | null
          frame_count?: number | null
          id?: string
          input_image_url?: string | null
          input_type: string
          model: string
          processing_time_ms?: number | null
          project_id: string
          provider: string
          retry_count?: number
          started_at?: string | null
          status?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          aspect_ratio?: string
          completed_at?: string | null
          cost_usd?: number | null
          created_at?: string
          duration_seconds?: number
          error_message?: string | null
          external_job_id?: string | null
          frame_count?: number | null
          id?: string
          input_image_url?: string | null
          input_type?: string
          model?: string
          processing_time_ms?: number | null
          project_id?: string
          provider?: string
          retry_count?: number
          started_at?: string | null
          status?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          prompt: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          prompt?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          prompt?: string | null
          source?: string | null
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
