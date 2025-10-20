/*
  # Site Settings Migration

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `setting_key` (text, unique) - e.g., 'company_name', 'logo_url', 'carousel_images'
      - `setting_value` (jsonb) - flexible value storage
      - `setting_type` (text) - 'text', 'url', 'image_array', etc.
      - `description` (text) - what this setting controls
      - `updated_at` (timestamptz)
      - `updated_by` (uuid) - reference to admin_users

  2. Initial Data
    - Company name setting
    - Logo URL setting
    - Carousel images array
    - Hero title and subtitle
    - Contact information

  3. Security
    - Enable RLS on site_settings table
    - Public can read all settings
    - Only admins can update settings
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  setting_type text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admin_users(id)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.active = true
    )
  );

CREATE POLICY "Admins can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.active = true
    )
  );

INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
VALUES
  (
    'company_name',
    '"Sample Parquet"'::jsonb,
    'text',
    'Şirket adı (header ve footer''da görünür)'
  ),
  (
    'company_tagline',
    '"Premium Parke ve Laminat Çözümleri"'::jsonb,
    'text',
    'Şirket sloganı'
  ),
  (
    'logo_url',
    '""'::jsonb,
    'url',
    'Logo URL (boş ise şirket adı gösterilir)'
  ),
  (
    'hero_title',
    '"Premium Parke ve Laminat"'::jsonb,
    'text',
    'Ana sayfa hero başlığı'
  ),
  (
    'hero_subtitle',
    '"Mekanlarınıza değer katan, kaliteli ve şık zemin kaplamaları"'::jsonb,
    'text',
    'Ana sayfa hero alt başlığı'
  ),
  (
    'carousel_images',
    '[
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1920"
    ]'::jsonb,
    'image_array',
    'Ana sayfa carousel görselleri (en fazla 5 görsel)'
  ),
  (
    'contact_email',
    '"info@sampleparquet.com"'::jsonb,
    'email',
    'İletişim email adresi'
  ),
  (
    'contact_phone',
    '"+90 555 123 4567"'::jsonb,
    'phone',
    'İletişim telefon numarası'
  ),
  (
    'contact_address',
    '"İstanbul, Türkiye"'::jsonb,
    'text',
    'İletişim adresi'
  ),
  (
    'social_facebook',
    '""'::jsonb,
    'url',
    'Facebook profil URL'
  ),
  (
    'social_instagram',
    '""'::jsonb,
    'url',
    'Instagram profil URL'
  ),
  (
    'social_linkedin',
    '""'::jsonb,
    'url',
    'LinkedIn profil URL'
  )
ON CONFLICT (setting_key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

CREATE OR REPLACE FUNCTION update_site_setting_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_settings_timestamp
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_setting_timestamp();