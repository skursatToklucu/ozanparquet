import { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { supabase } from '../../lib/supabase';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  description: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const settingsMap: Record<string, any> = {};
      data?.forEach((setting: SiteSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });

      setSettings(settingsMap);
      setCarouselImages(settingsMap.carousel_images || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Ayarlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSetting('company_name', settings.company_name);
      await updateSetting('company_tagline', settings.company_tagline);
      await updateSetting('logo_url', settings.logo_url);
      await updateSetting('hero_title', settings.hero_title);
      await updateSetting('hero_subtitle', settings.hero_subtitle);
      await updateSetting('carousel_images', carouselImages);
      await updateSetting('contact_email', settings.contact_email);
      await updateSetting('contact_phone', settings.contact_phone);
      await updateSetting('contact_address', settings.contact_address);
      await updateSetting('social_facebook', settings.social_facebook);
      await updateSetting('social_instagram', settings.social_instagram);
      await updateSetting('social_linkedin', settings.social_linkedin);

      alert('Ayarlar başarıyla kaydedildi');
      window.location.reload();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const addCarouselImage = () => {
    if (carouselImages.length >= 5) {
      alert('Maksimum 5 carousel görseli ekleyebilirsiniz');
      return;
    }
    setCarouselImages([...carouselImages, '']);
  };

  const updateCarouselImage = (index: number, value: string) => {
    const newImages = [...carouselImages];
    newImages[index] = value;
    setCarouselImages(newImages);
  };

  const removeCarouselImage = (index: number) => {
    setCarouselImages(carouselImages.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <AdminLayout currentPage="settings">
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600">Yükleniyor...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="settings">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Settings className="text-amber-600" />
              Site Ayarları
            </h1>
            <p className="text-slate-600 mt-1">
              Sitenizin genel ayarlarını buradan yönetin
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Şirket Bilgileri</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  value={settings.company_name || ''}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Sample Parquet"
                />
                <p className="text-xs text-slate-500 mt-1">Header ve footer'da görünür</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Şirket Sloganı
                </label>
                <input
                  type="text"
                  value={settings.company_tagline || ''}
                  onChange={(e) => setSettings({ ...settings, company_tagline: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Premium Parke ve Laminat Çözümleri"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={settings.logo_url || ''}
                  onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-xs text-slate-500 mt-1">Boş bırakırsanız şirket adı gösterilir</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Ana Sayfa Hero</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hero Başlığı
                </label>
                <input
                  type="text"
                  value={settings.hero_title || ''}
                  onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Premium Parke ve Laminat"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hero Alt Başlığı
                </label>
                <textarea
                  value={settings.hero_subtitle || ''}
                  onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Mekanlarınıza değer katan, kaliteli ve şık zemin kaplamaları"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Carousel Görselleri</h2>
                <p className="text-sm text-slate-600">Maksimum 5 görsel ekleyebilirsiniz</p>
              </div>
              <button
                onClick={addCarouselImage}
                disabled={carouselImages.length >= 5}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={20} />
                Görsel Ekle
              </button>
            </div>

            <div className="space-y-3">
              {carouselImages.map((image, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => updateCarouselImage(index, e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://images.pexels.com/..."
                    />
                  </div>
                  {image && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                      <img
                        src={image}
                        alt={`Carousel ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFMkU4RjAiLz48cGF0aCBkPSJNMzIgMjRMMjAgNDBINDRMMzIgMjRaIiBmaWxsPSIjOTRBM0I4Ii8+PC9zdmc+';
                        }}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => removeCarouselImage(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              {carouselImages.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Henüz carousel görseli eklenmemiş</p>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>İpucu:</strong> Pexels ücretsiz görseller için ideal bir kaynaktır.
                <a href="https://www.pexels.com/search/flooring/" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                  Pexels'te parke görselleri →
                </a>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Görsel URL'si almak için: Görsele sağ tıklayın → "Copy image address"
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">İletişim Bilgileri</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="info@sampleparquet.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={settings.contact_phone || ''}
                  onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="+90 555 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Adres
                </label>
                <input
                  type="text"
                  value={settings.contact_address || ''}
                  onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="İstanbul, Türkiye"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Sosyal Medya</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={settings.social_facebook || ''}
                  onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  value={settings.social_instagram || ''}
                  onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://instagram.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.social_linkedin || ''}
                  onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 sticky bottom-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              <Save size={20} />
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
