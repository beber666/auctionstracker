// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yssapojsghmotbifhybq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzc2Fwb2pzZ2htb3RiaWZoeWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDAzNTksImV4cCI6MjA1MDE3NjM1OX0.ZsHAGV2y9Z5bQw9wvcKybo7bptcd0lU4_73pcPbzBTQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);