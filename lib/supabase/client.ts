import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./env";

let client: ReturnType<typeof createBrowserClient> | undefined;

/** Browser client (singleton). Used by the admin dashboard for direct-to-storage uploads. */
export function getSupabaseBrowserClient() {
  client ??= createBrowserClient(supabaseUrl, supabaseKey);
  return client;
}
