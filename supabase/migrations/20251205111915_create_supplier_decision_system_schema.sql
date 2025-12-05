/*
  # Supplier Decision Support System - Complete Database Schema

  ## Overview
  Complete database schema for AI-powered Supplier Decision Support System with real-time chat,
  decision tracking, feedback system, and analytics.

  ## New Tables

  ### 1. profiles
  Extends auth.users with additional user information
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `role` (text) - 'user' or 'admin'
  - `avatar_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. suppliers
  Stores supplier information and scores
  - `id` (uuid, primary key)
  - `name` (text)
  - `price` (decimal)
  - `delivery_time` (integer) - in days
  - `quality_score` (decimal) - 0-100
  - `esg_score` (decimal) - 0-100
  - `ai_performance_score` (decimal) - 0-100
  - `human_scorecard_score` (decimal) - 0-100
  - `description` (text)
  - `country` (text)
  - `category` (text)
  - `status` (text) - 'active', 'inactive'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. decisions
  Stores all supplier decision records
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `decision_name` (text)
  - `supplier_a_id` (uuid, references suppliers)
  - `supplier_b_id` (uuid, references suppliers)
  - `supplier_c_id` (uuid, references suppliers)
  - `ai_selected_supplier` (uuid, references suppliers)
  - `human_selected_supplier` (uuid, references suppliers)
  - `final_selected_supplier` (uuid, references suppliers)
  - `ai_confidence_score` (decimal)
  - `decision_factors` (jsonb) - top factors for AI decision
  - `conflict` (boolean) - true if AI and human disagree
  - `decision_time_seconds` (integer)
  - `status` (text) - 'pending', 'completed', 'exported'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. chats
  Stores chat conversations linked to decisions
  - `id` (uuid, primary key)
  - `decision_id` (uuid, references decisions)
  - `user_id` (uuid, references profiles)
  - `message` (text)
  - `sender` (text) - 'user' or 'ai'
  - `context` (jsonb) - additional context data
  - `created_at` (timestamptz)

  ### 5. feedback_ratings
  Stores user feedback and ratings for decisions
  - `id` (uuid, primary key)
  - `decision_id` (uuid, references decisions)
  - `user_id` (uuid, references profiles)
  - `rating` (text) - 'thumbs_up' or 'thumbs_down'
  - `comment` (text)
  - `sentiment_score` (decimal) - -1 to 1
  - `created_at` (timestamptz)

  ### 6. analytics_logs
  Stores analytics events for tracking system usage
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `event_type` (text) - 'decision_made', 'ai_override', 'chat_interaction', etc.
  - `event_data` (jsonb)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users to manage their own data
  - Admin role can view all data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text DEFAULT 'user',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(10, 2) NOT NULL DEFAULT 0,
  delivery_time integer NOT NULL DEFAULT 0,
  quality_score decimal(5, 2) DEFAULT 0,
  esg_score decimal(5, 2) DEFAULT 0,
  ai_performance_score decimal(5, 2) DEFAULT 0,
  human_scorecard_score decimal(5, 2) DEFAULT 0,
  description text DEFAULT '',
  country text DEFAULT '',
  category text DEFAULT '',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert suppliers"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update suppliers"
  ON suppliers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create decisions table
CREATE TABLE IF NOT EXISTS decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  decision_name text NOT NULL,
  supplier_a_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  supplier_b_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  supplier_c_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  ai_selected_supplier uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  human_selected_supplier uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  final_selected_supplier uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  ai_confidence_score decimal(5, 2) DEFAULT 0,
  decision_factors jsonb DEFAULT '[]'::jsonb,
  conflict boolean DEFAULT false,
  decision_time_seconds integer DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own decisions"
  ON decisions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own decisions"
  ON decisions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own decisions"
  ON decisions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own decisions"
  ON decisions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id uuid REFERENCES decisions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  sender text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chats"
  ON chats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create feedback_ratings table
CREATE TABLE IF NOT EXISTS feedback_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id uuid REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating text NOT NULL,
  comment text DEFAULT '',
  sentiment_score decimal(3, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback"
  ON feedback_ratings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON feedback_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feedback"
  ON feedback_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create analytics_logs table
CREATE TABLE IF NOT EXISTS analytics_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON analytics_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON analytics_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_decisions_user_id ON decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_decisions_created_at ON decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chats_decision_id ON chats(decision_id);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_decision_id ON feedback_ratings(decision_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_logs(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_decisions_updated_at ON decisions;
CREATE TRIGGER update_decisions_updated_at
  BEFORE UPDATE ON decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();