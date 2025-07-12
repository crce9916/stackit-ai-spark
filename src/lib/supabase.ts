
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyuqpskapfenamafimxz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5dXFwc2thcGZlbmFtYWZpbXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTc0NDAsImV4cCI6MjA1MjI3MzQ0MH0.placeholder'; // Replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
