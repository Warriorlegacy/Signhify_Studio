export type Lead = {
  id: number;
  org_name: string;
  org_domain: string;
  website: string | null;
  industry: string | null;
  country: string | null;
  size_range: string | null;
  tech_stack: string | null;
  contact_name: string | null;
  contact_role: string | null;
  contact_email: string | null;
  source_channel: string;
  source_url: string | null;
  source_raw: Record<string, unknown> | null;
  email_verdict: string;
  score: number;
  tier: string;
  score_reason: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Campaign = {
  id: number;
  name: string;
  status: string;
  audience: string;
  created_at: string;
  updated_at: string;
};

export type CampaignStep = {
  id: number;
  campaign_id: number;
  step_order: number;
  channel: string;
  delay_days: number;
  subject_template: string;
  body_template: string;
};

export type Thread = {
  id: number;
  lead_id: number | null;
  subject: string | null;
  status: string;
  category: string;
  suggestion: string | null;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: number;
  lead_id: number | null;
  campaign_id: number | null;
  channel: string;
  direction: string;
  subject: string | null;
  body: string | null;
  provider_message_id: string | null;
  status: string;
  sent_at: string | null;
  created_at: string;
};

export type Reply = {
  id: number;
  thread_id: number;
  direction: string;
  body: string;
  status: string;
  created_at: string;
};
