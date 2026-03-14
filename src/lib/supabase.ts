import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Safeguard for build time/Vercel environments without env vars set yet
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signOut: async () => ({ error: null }),
            signInWithPassword: async () => ({ data: {}, error: { message: 'Authentication is currently unavailable. Please check your configuration.' } }),
            signUp: async () => ({ data: {}, error: { message: 'Sign up is currently unavailable. Please check your configuration.' } }),
            resetPasswordForEmail: async () => ({ data: {}, error: { message: 'Password reset is currently unavailable.' } }),
        }
    } as any;
