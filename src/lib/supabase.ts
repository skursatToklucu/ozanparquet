import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  images: string[];
  specifications: Record<string, string>;
  price_range: string;
  thickness: string;
  surface_finish: string;
  color_tone: string;
  in_stock: boolean;
  featured: boolean;
  warranty_years: number;
  box_coverage_sqm: number;
  view_count: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  summary: string;
  content: string;
  author: string;
  tags: string[];
  published: boolean;
  published_at: string;
  view_count: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url: string;
  category: string;
  location: string;
  description: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  location: string;
  project_type: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
}
