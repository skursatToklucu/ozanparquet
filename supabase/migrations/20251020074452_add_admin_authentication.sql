/*
  # Admin Authentication ve RLS Policies

  ## Değişiklikler
  
  1. Admin Kullanıcılar Tablosu
    - `admin_users` tablosu oluşturuldu
    - Supabase auth.users ile ilişkilendirildi
    - Role (admin, super_admin) alanı eklendi
  
  2. Güvenlik
    - Tüm içerik tablolarına admin yazma yetkisi eklendi
    - Admin kullanıcılar authenticated ve admin_users tablosunda kayıtlı olmalı
    - UPDATE, INSERT, DELETE işlemleri için admin kontrolü
  
  3. Admin RLS Policies
    - Kategoriler, ürünler, blog, galeri, testimonials ve FAQ için admin yazma yetkisi
    - Public okuma, admin yazma mantığı
*/

-- Admin kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcılar sadece kendi bilgilerini görebilir
CREATE POLICY "Admins can view their own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Helper function: Kullanıcının admin olup olmadığını kontrol et
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Categories için admin policies
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (is_admin());

-- Products için admin policies
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (is_admin());

-- Blog posts için admin policies
CREATE POLICY "Admins can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (is_admin());

-- Gallery items için admin policies
CREATE POLICY "Admins can insert gallery items"
  ON gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update gallery items"
  ON gallery_items FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete gallery items"
  ON gallery_items FOR DELETE
  TO authenticated
  USING (is_admin());

-- Testimonials için admin policies
CREATE POLICY "Admins can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can view all testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (is_admin());

-- FAQ items için admin policies
CREATE POLICY "Admins can insert faq items"
  ON faq_items FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update faq items"
  ON faq_items FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete faq items"
  ON faq_items FOR DELETE
  TO authenticated
  USING (is_admin());

-- Contact submissions ve quote requests için admin read policy
CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update contact submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can view quote requests"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can update quote requests"
  ON quote_requests FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());