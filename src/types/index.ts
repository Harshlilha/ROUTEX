export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  supplier_id?: string;
  name: string;
  supplier_name?: string;
  city?: string;
  price: number;
  delivery_time: number;
  quality_score: number;
  esg_score: number;
  baseline_esg_score?: number;
  ai_performance_score: number;
  human_scorecard_score: number;
  description: string;
  country: string;
  category: string;
  status: string;
  employee_count?: number;
  annual_revenue_inr?: number;
  registration_year?: number;
  gst_registered?: boolean;
  baseline_on_time_pct?: number;
  baseline_defect_pct?: number;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  contract_id: string;
  supplier_id: string;
  contract_date: string;
  contract_end_date: string;
  duration_days: number;
  contract_value_inr: number;
  on_time_delivery_pct: number;
  defect_rate_pct: number;
  return_rate_pct: number;
  lead_time_days: number;
  capacity_utilization_pct: number;
  esg_score: number;
  audit_issues_count: number;
  geo_risk_score: number;
  financial_risk_score: number;
  ai_score: number;
  human_score: number;
  ai_human_conflict: number;
  decision_winner: 'AI' | 'Human';
  disruption_flag: number;
  overlapping_event_ids: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  review_id: string;
  decision_id: string;
  contract_id: string;
  supplier_id: string;
  review_date: string;
  rating: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  review_text: string;
  created_at?: string;
}

export interface DisruptionEvent {
  id: string;
  event_id: string;
  event_type: string;
  start_date: string;
  end_date: string;
  affected_cities: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  duration_days: number;
  description: string;
  created_at?: string;
}

export interface Decision {
  id: string;
  decision_id?: string;
  contract_id?: string;
  user_id: string;
  decision_name: string;
  decision_date?: string;
  supplier_a_id: string;
  supplier_b_id: string;
  supplier_c_id: string;
  ai_selected_supplier: string;
  human_selected_supplier?: string;
  final_selected_supplier?: string;
  ai_confidence_score: number;
  ai_score?: number;
  human_score?: number;
  ai_human_conflict?: number;
  decision_winner?: 'AI' | 'Human';
  decision_factors: DecisionFactor[];
  conflict: boolean;
  decision_time_seconds: number;
  thumbs_up?: number;
  thumbs_down?: number;
  success_label?: number;
  status: 'pending' | 'completed' | 'exported';
  created_at: string;
  updated_at: string;
}

export interface DecisionFactor {
  factor: string;
  weight: number;
  description: string;
}

export interface Chat {
  id: string;
  chat_message_id?: string;
  decision_id?: string;
  contract_id?: string;
  supplier_id?: string;
  user_id: string;
  message: string;
  role?: 'user' | 'ai';
  sender: 'user' | 'ai';
  timestamp?: string;
  context?: Record<string, unknown>;
  created_at: string;
}

export interface FeedbackRating {
  id: string;
  decision_id: string;
  user_id: string;
  rating: 'thumbs_up' | 'thumbs_down';
  comment: string;
  sentiment_score: number;
  created_at: string;
}

export interface AnalyticsLog {
  id: string;
  user_id: string;
  event_type: string;
  event_data: Record<string, unknown>;
  created_at: string;
}

export interface Theme {
  mode: 'light' | 'dark';
}
