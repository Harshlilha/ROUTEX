// Test Supabase Connection
import { supabase } from './src/lib/supabase.ts';

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

  try {
    // Test 1: Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth test:', user ? 'User logged in' : 'No user', authError ? `Error: ${authError.message}` : '✓');

    // Test 2: Check database connection with suppliers table
    const { data: suppliers, error: dbError } = await supabase
      .from('suppliers')
      .select('count')
      .limit(1);
    
    console.log('Database test:', suppliers ? '✓ Connected' : '✗ Failed', dbError ? `Error: ${dbError.message}` : '');

    // Test 3: Check profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    console.log('Profiles table:', profiles ? '✓ Exists' : '✗ Not found', profileError ? `Error: ${profileError.message}` : '');

    console.log('\n=== Connection Test Complete ===');
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
