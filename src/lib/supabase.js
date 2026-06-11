// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize Supabase only if URL is valid
export const supabase = (supabaseUrl.startsWith('http') && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
      }
    }) 
  : null;
