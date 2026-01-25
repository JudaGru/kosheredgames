import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if configured - export as function to allow runtime checking
export function getIsSupabaseConfigured(): boolean {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
  return Boolean(url && key);
}

// For backwards compatibility - but prefer using getIsSupabaseConfigured()
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create client - will work if env vars are set
export const supabase: SupabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Feedback features may be limited.');
}
