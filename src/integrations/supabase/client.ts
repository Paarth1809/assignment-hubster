
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evhxgdhohuebrhkcfgps.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2aHhnZGhvaHVlYnJoa2NmZ3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNzY2MTYsImV4cCI6MjA1NzY1MjYxNn0.RJ7feji4weE3Aaj3r72wN8rOCeG_wUobps2jYFkoCfA';

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
