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
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          commission_cents: number
          created_at: string
          id: string
          paid_at: string | null
          referred_user_id: string | null
          status: string
          stripe_session_id: string | null
        }
        Insert: {
          affiliate_id: string
          commission_cents?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          referred_user_id?: string | null
          status?: string
          stripe_session_id?: string | null
        }
        Update: {
          affiliate_id?: string
          commission_cents?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          referred_user_id?: string | null
          status?: string
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          bank_details: Json | null
          code: string
          commission_rate: number
          created_at: string
          id: string
          paypal_email: string | null
          referrals: number
          total_earned_cents: number
          total_paid_cents: number
          upi_id: string | null
          user_id: string
        }
        Insert: {
          bank_details?: Json | null
          code: string
          commission_rate?: number
          created_at?: string
          id?: string
          paypal_email?: string | null
          referrals?: number
          total_earned_cents?: number
          total_paid_cents?: number
          upi_id?: string | null
          user_id: string
        }
        Update: {
          bank_details?: Json | null
          code?: string
          commission_rate?: number
          created_at?: string
          id?: string
          paypal_email?: string | null
          referrals?: number
          total_earned_cents?: number
          total_paid_cents?: number
          upi_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agent_nodes: {
        Row: {
          created_at: string
          depends_on: Json
          id: string
          max_retries: number
          name: string
          prompt: string
          run_id: string
          timeout_ms: number
          tools: Json
        }
        Insert: {
          created_at?: string
          depends_on?: Json
          id: string
          max_retries?: number
          name: string
          prompt: string
          run_id: string
          timeout_ms?: number
          tools?: Json
        }
        Update: {
          created_at?: string
          depends_on?: Json
          id?: string
          max_retries?: number
          name?: string
          prompt?: string
          run_id?: string
          timeout_ms?: number
          tools?: Json
        }
        Relationships: [
          {
            foreignKeyName: "agent_nodes_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_sessions: {
        Row: {
          created_at: string
          error: string | null
          id: string
          latency_ms: number | null
          prompt: string
          provider_used: string | null
          response: Json
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          latency_ms?: number | null
          prompt: string
          provider_used?: string | null
          response?: Json
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          latency_ms?: number | null
          prompt?: string
          provider_used?: string | null
          response?: Json
          status?: string
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
      client_messages: {
        Row: {
          body: string
          client_id: string
          created_at: string
          id: string
          listing_id: string | null
          project_id: string | null
          read_at: string | null
          sender_role: string
        }
        Insert: {
          body: string
          client_id: string
          created_at?: string
          id?: string
          listing_id?: string | null
          project_id?: string | null
          read_at?: string | null
          sender_role?: string
        }
        Update: {
          body?: string
          client_id?: string
          created_at?: string
          id?: string
          listing_id?: string | null
          project_id?: string | null
          read_at?: string | null
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
        ]
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
      creator_payouts: {
        Row: {
          commission_cents: number
          created_at: string
          creator_id: string
          gross_amount_cents: number
          id: string
          listing_id: string | null
          net_amount_cents: number
          paid_at: string | null
          status: string
          stripe_session_id: string | null
        }
        Insert: {
          commission_cents: number
          created_at?: string
          creator_id: string
          gross_amount_cents: number
          id?: string
          listing_id?: string | null
          net_amount_cents: number
          paid_at?: string | null
          status?: string
          stripe_session_id?: string | null
        }
        Update: {
          commission_cents?: number
          created_at?: string
          creator_id?: string
          gross_amount_cents?: number
          id?: string
          listing_id?: string | null
          net_amount_cents?: number
          paid_at?: string | null
          status?: string
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_payouts_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
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
      credit_purchases: {
        Row: {
          amount_cents: number
          created_at: string
          credits: number
          currency: string
          id: string
          pack_id: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          credits: number
          currency?: string
          id?: string
          pack_id: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          credits?: number
          currency?: string
          id?: string
          pack_id?: string
          stripe_session_id?: string | null
          user_id?: string
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
      listing_reviews: {
        Row: {
          author_name: string | null
          body: string | null
          created_at: string
          id: string
          listing_id: string | null
          listing_slug: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name?: string | null
          body?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          listing_slug: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string | null
          body?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          listing_slug?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_payments: {
        Row: {
          amount: number
          confirmed_at: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          kind: string
          listing_id: string | null
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
          kind?: string
          listing_id?: string | null
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
          kind?: string
          listing_id?: string | null
          method?: string
          status?: string
          transaction_ref?: string | null
          user_id?: string
          whatsapp_sent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "manual_payments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "marketplace_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          asset_path: string | null
          category: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          id: string
          is_active: boolean | null
          preview_url: string | null
          price_cents: number | null
          promo_video_url: string | null
          review_note: string | null
          reviewed_at: string | null
          search_vector: unknown
          slug: string
          status: string
          stripe_connect_account_id: string | null
          title: string
        }
        Insert: {
          asset_path?: string | null
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          preview_url?: string | null
          price_cents?: number | null
          promo_video_url?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          search_vector?: unknown
          slug: string
          status?: string
          stripe_connect_account_id?: string | null
          title: string
        }
        Update: {
          asset_path?: string | null
          category?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          preview_url?: string | null
          price_cents?: number | null
          promo_video_url?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          search_vector?: unknown
          slug?: string
          status?: string
          stripe_connect_account_id?: string | null
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
      payout_requests: {
        Row: {
          amount_inr: number
          created_at: string
          creator_id: string
          id: string
          note: string | null
          paid_at: string | null
          status: string
          upi_id: string
        }
        Insert: {
          amount_inr: number
          created_at?: string
          creator_id: string
          id?: string
          note?: string | null
          paid_at?: string | null
          status?: string
          upi_id: string
        }
        Update: {
          amount_inr?: number
          created_at?: string
          creator_id?: string
          id?: string
          note?: string | null
          paid_at?: string | null
          status?: string
          upi_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          display_name: string | null
          free_trial_claimed_at: string | null
          free_trial_used: boolean
          id: string
          stripe_connect_account_id: string | null
          stripe_connect_onboarding_complete: boolean | null
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
          free_trial_claimed_at?: string | null
          free_trial_used?: boolean
          id: string
          stripe_connect_account_id?: string | null
          stripe_connect_onboarding_complete?: boolean | null
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
          free_trial_claimed_at?: string | null
          free_trial_used?: boolean
          id?: string
          stripe_connect_account_id?: string | null
          stripe_connect_onboarding_complete?: boolean | null
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
      promo_videos: {
        Row: {
          created_at: string
          error: string | null
          id: string
          job_id: string | null
          listing_slug: string | null
          project_id: string | null
          prompt: string
          status: string
          updated_at: string
          user_id: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          job_id?: string | null
          listing_slug?: string | null
          project_id?: string | null
          prompt: string
          status?: string
          updated_at?: string
          user_id: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          job_id?: string | null
          listing_slug?: string | null
          project_id?: string | null
          prompt?: string
          status?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_videos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_library: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          category?: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prompt_versions: {
        Row: {
          body: string
          created_at: string
          id: string
          project_id: string | null
          project_title: string | null
          prompt_id: string
          user_id: string
          version: number
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          project_id?: string | null
          project_title?: string | null
          prompt_id: string
          user_id: string
          version: number
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          project_id?: string | null
          project_title?: string | null
          prompt_id?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "prompt_versions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_versions_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt_library"
            referencedColumns: ["id"]
          },
        ]
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
          created_at: string
          id: string | null
          ip: string
          updated_at: string
          window_start: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string | null
          ip: string
          updated_at?: string
          window_start: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string | null
          ip?: string
          updated_at?: string
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
      run_agents: {
        Row: {
          created_at: string
          error: string | null
          finished_at: string | null
          id: string
          input_hash: string | null
          latency_ms: number | null
          name: string
          retries: number
          run_id: string
          started_at: string | null
          status: string
          tokens_used: number
        }
        Insert: {
          created_at?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          input_hash?: string | null
          latency_ms?: number | null
          name: string
          retries?: number
          run_id: string
          started_at?: string | null
          status?: string
          tokens_used?: number
        }
        Update: {
          created_at?: string
          error?: string | null
          finished_at?: string | null
          id?: string
          input_hash?: string | null
          latency_ms?: number | null
          name?: string
          retries?: number
          run_id?: string
          started_at?: string | null
          status?: string
          tokens_used?: number
        }
        Relationships: [
          {
            foreignKeyName: "run_agents_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["id"]
          },
        ]
      }
      run_artifacts: {
        Row: {
          agent_name: string
          content: string
          created_at: string
          id: string
          language: string | null
          path: string
          run_id: string
          size_bytes: number
        }
        Insert: {
          agent_name: string
          content: string
          created_at?: string
          id?: string
          language?: string | null
          path: string
          run_id: string
          size_bytes?: number
        }
        Update: {
          agent_name?: string
          content?: string
          created_at?: string
          id?: string
          language?: string | null
          path?: string
          run_id?: string
          size_bytes?: number
        }
        Relationships: [
          {
            foreignKeyName: "run_artifacts_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["id"]
          },
        ]
      }
      run_errors: {
        Row: {
          created_at: string
          exception_message: string
          id: string
          project_id: string
          resolution_details: string | null
          resolved: boolean
          stack_trace: string | null
        }
        Insert: {
          created_at?: string
          exception_message: string
          id?: string
          project_id: string
          resolution_details?: string | null
          resolved?: boolean
          stack_trace?: string | null
        }
        Update: {
          created_at?: string
          exception_message?: string
          id?: string
          project_id?: string
          resolution_details?: string | null
          resolved?: boolean
          stack_trace?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "run_errors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      run_events: {
        Row: {
          agent_name: string | null
          created_at: string
          event_type: string
          id: string
          payload: Json
          run_id: string
        }
        Insert: {
          agent_name?: string | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          run_id: string
        }
        Update: {
          agent_name?: string | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "run_events_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["id"]
          },
        ]
      }
      run_metrics: {
        Row: {
          agents_completed: number
          agents_failed: number
          created_at: string
          id: string
          provider_mix: Json
          run_id: string
          total_latency_ms: number
          total_tokens: number
        }
        Insert: {
          agents_completed?: number
          agents_failed?: number
          created_at?: string
          id?: string
          provider_mix?: Json
          run_id: string
          total_latency_ms?: number
          total_tokens?: number
        }
        Update: {
          agents_completed?: number
          agents_failed?: number
          created_at?: string
          id?: string
          provider_mix?: Json
          run_id?: string
          total_latency_ms?: number
          total_tokens?: number
        }
        Relationships: [
          {
            foreignKeyName: "run_metrics_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["id"]
          },
        ]
      }
      runs: {
        Row: {
          agents_completed: number
          agents_failed: number
          created_at: string
          current_agent: string | null
          current_agent_id: string | null
          id: string
          log: Json
          project_id: string
          prompt: string | null
          result: Json | null
          status: string
          tool_calls: number
          total_latency_ms: number
          total_tokens: number
          trace_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agents_completed?: number
          agents_failed?: number
          created_at?: string
          current_agent?: string | null
          current_agent_id?: string | null
          id?: string
          log?: Json
          project_id: string
          prompt?: string | null
          result?: Json | null
          status?: string
          tool_calls?: number
          total_latency_ms?: number
          total_tokens?: number
          trace_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agents_completed?: number
          agents_failed?: number
          created_at?: string
          current_agent?: string | null
          current_agent_id?: string | null
          id?: string
          log?: Json
          project_id?: string
          prompt?: string | null
          result?: Json | null
          status?: string
          tool_calls?: number
          total_latency_ms?: number
          total_tokens?: number
          trace_id?: string | null
          updated_at?: string
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
      stripe_events: {
        Row: {
          created_at: string
          event_id: string
          type: string
        }
        Insert: {
          created_at?: string
          event_id: string
          type: string
        }
        Update: {
          created_at?: string
          event_id?: string
          type?: string
        }
        Relationships: []
      }
      tool_calls: {
        Row: {
          agent_id: string
          created_at: string
          duration_ms: number
          error: string | null
          id: string
          input: Json
          output: Json | null
          run_id: string
          success: boolean
          tool_name: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          duration_ms?: number
          error?: string | null
          id?: string
          input: Json
          output?: Json | null
          run_id: string
          success?: boolean
          tool_name: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          duration_ms?: number
          error?: string | null
          id?: string
          input?: Json
          output?: Json | null
          run_id?: string
          success?: boolean
          tool_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_calls_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
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
      user_credits: {
        Row: {
          created_at: string
          credits_remaining: number
          id: string
          max_credits: number
          projects_count: number
          tier: string
          updated_at: string
          user_id: string
          videos_generated: number
        }
        Insert: {
          created_at?: string
          credits_remaining?: number
          id?: string
          max_credits?: number
          projects_count?: number
          tier?: string
          updated_at?: string
          user_id: string
          videos_generated?: number
        }
        Update: {
          created_at?: string
          credits_remaining?: number
          id?: string
          max_credits?: number
          projects_count?: number
          tier?: string
          updated_at?: string
          user_id?: string
          videos_generated?: number
        }
        Relationships: []
      }
      user_presence: {
        Row: {
          cursor_x: number | null
          cursor_y: number | null
          last_seen: string
          run_id: string | null
          selected_agent_id: string | null
          user_id: string
        }
        Insert: {
          cursor_x?: number | null
          cursor_y?: number | null
          last_seen?: string
          run_id?: string | null
          selected_agent_id?: string | null
          user_id?: string
        }
        Update: {
          cursor_x?: number | null
          cursor_y?: number | null
          last_seen?: string
          run_id?: string | null
          selected_agent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_presence_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "runs"
            referencedColumns: ["id"]
          },
        ]
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
          confirmed: boolean
          confirmed_at: string | null
          created_at: string
          email: string
          id: string
          prompt: string | null
          source: string | null
        }
        Insert: {
          confirmed?: boolean
          confirmed_at?: string | null
          created_at?: string
          email: string
          id?: string
          prompt?: string | null
          source?: string | null
        }
        Update: {
          confirmed?: boolean
          confirmed_at?: string | null
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
      add_credits: {
        Args: { p_amount: number; p_user_id: string }
        Returns: undefined
      }
      consume_free_trial: {
        Args: { p_ip?: string; p_user_id: string }
        Returns: Json
      }
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
