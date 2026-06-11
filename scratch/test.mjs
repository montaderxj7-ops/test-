import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://icnjekhnnelayrjkyfuz.supabase.co';
const supabaseAnonKey = 'sb_publishable_8VoZ6kqkmNCZJkDxD4qD7g_34JH88-J';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.auth.signUp({
    email: 'gtabassra@gmail.com',
    password: 'gtabassraadmin',
  });
  console.log("Signup Data:", JSON.stringify(data, null, 2));
  console.log("Signup Error:", error);
}

main();
