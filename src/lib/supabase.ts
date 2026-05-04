import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ixhbxiwshawebxvcrwxc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4aGJ4aXdzaGF3ZWJ4dmNyd3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NzM5NDYsImV4cCI6MjA5MzE0OTk0Nn0.XgojEBFNRMkJFMVV0n5_s1ltZChF65X0XHLkUeJO-rY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
