import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ifzbvpioigzajtjwzsvc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmemJ2cGlvaWd6YWp0and6c3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NzM1MDEsImV4cCI6MjEwMTQ0OTUwMX0.B9RKdntNot5W5Hvgs4ALsIavEO_qQNXoqbIr6gCKVSU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
