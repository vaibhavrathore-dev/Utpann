/**
 * RAY hackathon demo authentication.
 * Uses a real Supabase anonymous user and validated access token — not an auth bypass.
 * JS-memory only: sessions do not persist across app restarts. Use AsyncStorage-backed
 * persistent auth and permanent sign-in for production.
 * Enable Anonymous Sign-Ins for the dedicated RAY Supabase project first.
 */
import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) {
    throw new Error('RAY authentication is not configured. Add Supabase URL and publishable key to the frontend .env.local.');
  }
  client = createClient(url, key, {
    auth: {
      persistSession: false, // For a single-session hackathon demo only
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}

export async function getRayAccessToken(): Promise<string> {
  const supabase = getClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(`Supabase session unavailable: ${sessionError.message}`);
  if (session?.access_token) return session.access_token;

  // Supabase dashboard: Authentication > Providers > Anonymous Sign-Ins = enabled.
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw new Error(`Supabase demo sign-in failed: ${error.message}`);
  const token = data.session?.access_token;
  if (!token) throw new Error('Supabase did not issue a session access token.');
  return token;
}
