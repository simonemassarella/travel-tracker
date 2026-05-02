import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type Database = {
  public: {
    Tables: {
      trips: {
        Row: {
          id: string;
          title: string;
          description: string;
          lat: number;
          lng: number;
          date: string;
          images: string[];
          youtube_links: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          lat: number;
          lng: number;
          date: string;
          images?: string[];
          youtube_links?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          lat?: number;
          lng?: number;
          date?: string;
          images?: string[];
          youtube_links?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
