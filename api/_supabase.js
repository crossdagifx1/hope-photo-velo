// api/_supabase.js — Supabase Client for HOPE Studio
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pogmsktnqutjuvjmdaay.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_rGnKvjPrxwAJxgYqF5Badg_xUG3D6f5';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
