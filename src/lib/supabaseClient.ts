import { env } from "$env/dynamic/private";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_API_KEY);