/*
  # Sample Parquet Website Database Schema

  ## Overview
  Complete database schema for a corporate parquet/flooring website with products, categories, 
  blog posts, gallery, testimonials, FAQ, and form submissions.

  ## New Tables
  
  ### 1. categories
  - `id` (uuid, primary key)
  - `name` (text) - Category name (e.g., "Engineered Wood", "Laminate")
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Category description
  - `image_url` (text) - Category image
  - `display_order` (integer) - Sort order
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. products
  - `id` (uuid, primary key)
  - `category_id` (uuid, foreign key)
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Full description
  - `short_description` (text) - Brief summary
  - `images` (jsonb) - Array of image URLs
  - `specifications` (jsonb) - Technical specs
  - `price_range` (text) - Price range category
  - `thickness` (text) - Product thickness
  - `surface_finish` (text) - Surface type
  - `color_tone` (text) - Color category
  - `in_stock` (boolean) - Availability
  - `featured` (boolean) - Featured product flag
  - `warranty_years` (integer) - Warranty period
  - `box_coverage_sqm` (decimal) - Coverage per box
  - `view_count` (integer) - Page views
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. blog_posts
  - `id` (uuid, primary key)
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly identifier
  - `cover_image` (text) - Main image URL
  - `summary` (text) - Short summary
  - `content` (text) - Full HTML content
  - `author` (text) - Author name
  - `tags` (text[]) - Array of tags
  - `published` (boolean) - Publication status
  - `published_at` (timestamptz) - Publication date
  - `view_count` (integer) - Page views
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. gallery_items
  - `id` (uuid, primary key)
  - `title` (text) - Project title
  - `image_url` (text) - Image URL
  - `thumbnail_url` (text) - Thumbnail URL
  - `category` (text) - Project category
  - `location` (text) - Project location
  - `description` (text) - Project description
  - `display_order` (integer) - Sort order
  - `created_at` (timestamptz)

  ### 5. testimonials
  - `id` (uuid, primary key)
  - `customer_name` (text) - Customer name
  - `rating` (integer) - 1-5 star rating
  - `comment` (text) - Testimonial text
  - `location` (text) - Customer location
  - `project_type` (text) - Type of project
  - `approved` (boolean) - Approval status
  - `display_order` (integer) - Sort order
  - `created_at` (timestamptz)

  ### 6. faq_items
  - `id` (uuid, primary key)
  - `question` (text) - FAQ question
  - `answer` (text) - FAQ answer
  - `category` (text) - FAQ category
  - `display_order` (integer) - Sort order
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 7. contact_submissions
  - `id` (uuid, primary key)
  - `name` (text) - Contact name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `status` (text) - Processing status
  - `created_at` (timestamptz)

  ### 8. quote_requests
  - `id` (uuid, primary key)
  - `product_id` (uuid, foreign key, nullable)
  - `product_name` (text) - Product selected
  - `area_sqm` (decimal) - Area in square meters
  - `delivery_city` (text) - Delivery city
  - `delivery_district` (text) - Delivery district
  - `service_type` (text) - Installation/delivery service
  - `customer_name` (text) - Customer name
  - `customer_phone` (text) - Customer phone
  - `customer_email` (text) - Customer email
  - `notes` (text) - Additional notes
  - `status` (text) - Processing status
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for content tables (categories, products, blog, gallery, testimonials, faq)
  - Restricted write access for submission tables (contact_submissions, quote_requests)
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  short_description text DEFAULT '',
  images jsonb DEFAULT '[]'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  price_range text DEFAULT '',
  thickness text DEFAULT '',
  surface_finish text DEFAULT '',
  color_tone text DEFAULT '',
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  warranty_years integer DEFAULT 0,
  box_coverage_sqm decimal(10,2) DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  cover_image text DEFAULT '',
  summary text DEFAULT '',
  content text DEFAULT '',
  author text DEFAULT 'Sample Parquet',
  tags text[] DEFAULT ARRAY[]::text[],
  published boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Gallery items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  thumbnail_url text DEFAULT '',
  category text DEFAULT '',
  location text DEFAULT '',
  description text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery items"
  ON gallery_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  location text DEFAULT '',
  project_type text DEFAULT '',
  approved boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- FAQ items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view FAQ items"
  ON faq_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contact submissions"
  ON contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text DEFAULT '',
  area_sqm decimal(10,2) DEFAULT 0,
  delivery_city text DEFAULT '',
  delivery_district text DEFAULT '',
  service_type text DEFAULT '',
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text DEFAULT '',
  notes text DEFAULT '',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create quote requests"
  ON quote_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC) WHERE published = true;
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(approved, display_order) WHERE approved = true;