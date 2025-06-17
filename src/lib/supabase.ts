import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

// Use environment variables with fallback to config.toml values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://narlejmxxolzjesxfbzg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcmxlam14eG9semplc3hmYnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODMwODcsImV4cCI6MjA2NTQ1OTA4N30.77i7LVcACBNvEao2i_DxAj4NseTFz2xJB1as5HpeiFQ";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Configuration:', {
    url: supabaseUrl ? 'present' : 'missing',
    key: supabaseAnonKey ? 'present' : 'missing'
  });
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
}); 