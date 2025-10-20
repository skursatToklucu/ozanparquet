import { useState, useEffect } from 'react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { supabase, Product } from '../lib/supabase';
import { getUrl } from '../lib/utils';

export default function GetQuotePage() {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    product_id: '',
    product_name: '',
    area_sqm: '',
    delivery_city: '',
    delivery_district: '',
    service_type: 'Sadece Ürün',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('name');
    if (data) setProducts(data);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const { error } = await supabase.from('quote_requests').insert([{
      ...formData,
      area_sqm: parseFloat(formData.area_sqm) || 0,
    }]);

    if (!error) {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceedStep1 = formData.product_name && formData.area_sqm;
  const canProceedStep2 = formData.delivery_city && formData.service_type;

  const steps = [
    { number: 1, title: 'Ürün Seçimi' },
    { number: 2, title: 'Teslimat Bilgileri' },
    { number: 3, title: 'İletişim Bilgileri' },
  ];

  if (submitted) {
    return (
      <>
        <SEO title="Teklif Talebi Alındı" description="Teklif talebiniz başarıyla alındı." canonical="/get-quote" />
        <Header />
        <main className="pt-32 pb-16 min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-green-600" size={40} />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-4">
                Teklif Talebiniz Alındı!
              </h1>
              <p className="text-slate-600 mb-8 text-lg">
                Size en uygun teklifi hazırlayıp en kısa sürede iletişime geçeceğiz.
                Genellikle 2 saat içinde geri dönüş yapıyoruz.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href={getUrl('/')}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                >
                  Ana Sayfaya Dön
                </a>
                <a
                  href={getUrl('/products')}
                  className="bg-slate-200 text-slate-800 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                >
                  Ürünleri İncele
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Teklif Al"
        description="Parke ürünlerimiz için hızlı ve ücretsiz fiyat teklifi alın. 2 saat içinde size dönüş yapıyoruz."
        canonical="/get-quote"
      />
      <Header />

      <main className="pt-32 pb-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Teklif Talep Formu</h1>
            <p className="text-slate-600 text-lg">
              Bilgilerinizi doldurun, size özel teklifi hemen hazırlayalım
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        step >= s.number
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {step > s.number ? <Check size={20} /> : s.number}
                    </div>
                    <div
                      className={`text-sm mt-2 font-medium hidden sm:block ${
                        step >= s.number ? 'text-amber-600' : 'text-slate-500'
                      }`}
                    >
                      {s.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-colors ${
                        step > s.number ? 'bg-amber-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Ürün Bilgileri</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ürün Seçin *
                  </label>
                  <select
                    value={formData.product_name}
                    onChange={(e) => {
                      const productName = e.target.value;
                      const product = products.find((p) => p.name === productName);
                      setFormData({
                        ...formData,
                        product_name: productName,
                        product_id: product?.id || '',
                      });
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Bir ürün seçin</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.name}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Alan (m²) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.area_sqm}
                    onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                    placeholder="Örn: 85.5"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <p className="text-sm text-slate-500 mt-2">
                    Uygulanacak toplam alanı metrekare cinsinden girin
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ek Notlar
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Özel isteklerinizi buraya yazabilirsiniz..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Teslimat ve Hizmet</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      İl *
                    </label>
                    <input
                      type="text"
                      value={formData.delivery_city}
                      onChange={(e) => setFormData({ ...formData, delivery_city: e.target.value })}
                      placeholder="Örn: İstanbul"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      İlçe
                    </label>
                    <input
                      type="text"
                      value={formData.delivery_district}
                      onChange={(e) =>
                        setFormData({ ...formData, delivery_district: e.target.value })
                      }
                      placeholder="Örn: Kadıköy"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hizmet Türü *
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'Sadece Ürün', label: 'Sadece Ürün Teslimatı' },
                      { value: 'Ürün + Montaj', label: 'Ürün + Profesyonel Montaj' },
                      { value: 'Tam Paket', label: 'Tam Paket (Zemin Hazırlık + Montaj)' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-amber-500 transition-colors"
                      >
                        <input
                          type="radio"
                          name="service_type"
                          value={option.value}
                          checked={formData.service_type === option.value}
                          onChange={(e) =>
                            setFormData({ ...formData, service_type: e.target.value })
                          }
                          className="w-5 h-5 text-amber-600"
                        />
                        <span className="font-medium text-slate-800">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">İletişim Bilgileriniz</h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    placeholder="5XX XXX XX XX"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="font-semibold text-slate-800 mb-4">Talep Özeti</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ürün:</span>
                      <span className="font-medium text-slate-800">{formData.product_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Alan:</span>
                      <span className="font-medium text-slate-800">{formData.area_sqm} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Teslimat:</span>
                      <span className="font-medium text-slate-800">
                        {formData.delivery_city}
                        {formData.delivery_district && ` / ${formData.delivery_district}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Hizmet:</span>
                      <span className="font-medium text-slate-800">{formData.service_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft size={20} />
                  Geri
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İleri
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!formData.customer_name || !formData.customer_phone || submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Gönderiliyor...' : 'Teklif Talep Et'}
                  <Check size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
