import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://knqjsyocpmgteujnqxds.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucWpzeW9jcG1ndGV1am5xeGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MjU4MjksImV4cCI6MjA2NzUwMTgyOX0.5K83VZhIvmfg5mFdYFpocjx9VJvAehCpWg-0v-g_iWg';

console.log('Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET');
console.log('Supabase ANON KEY:', supabaseAnonKey ? 'SET' : 'NOT SET');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
}); 