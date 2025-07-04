// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://isrnzlhdqqqjhaanktvr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzcm56bGhkcXFxamhhYW5rdHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODI3MjksImV4cCI6MjA2Mzg1ODcyOX0.WplfwlpFtcFgXwzJ6-qnsof9gYfB1hTk846pm_wbhlM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);