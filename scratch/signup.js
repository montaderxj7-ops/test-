import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase.auth.signUp({
    email: 'gtabassra@gmail.com',
    password: 'gtabassraadmin',
  });
  console.log("Signup Result:", data);
  console.log("Signup Error:", error);
}

main();
