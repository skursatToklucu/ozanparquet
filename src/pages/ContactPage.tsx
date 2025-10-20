import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const { error: submitError } = await supabase
      .from('contact_submissions')
      .insert([formData]);

    if (submitError) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      setSubmitting(false);
    } else {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <SEO
        title="İletişim"
        description="Sample Parquet ile iletişime geçin. Showroom adresimiz, telefon numaramız ve online iletişim formu."
        canonical="/contact"
      />
      <Header currentPage="contact" />

      <main className="pt-32 pb-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              İletişim
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Size en iyi şekilde hizmet verebilmek için buradayız
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div>
              <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">İletişim Bilgileri</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Adres</h3>
                      <p className="text-slate-600">
                        Örnek Mahallesi, Parke Sokak No:123
                        <br />
                        Kadıköy, İstanbul 34000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Telefon</h3>
                      <a
                        href="tel:+905551234567"
                        className="text-slate-600 hover:text-amber-600 transition-colors"
                      >
                        +90 555 123 45 67
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">E-posta</h3>
                      <a
                        href="mailto:info@sampleparquet.com"
                        className="text-slate-600 hover:text-amber-600 transition-colors"
                      >
                        info@sampleparquet.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Çalışma Saatleri</h3>
                      <p className="text-slate-600">
                        Pazartesi - Cuma: 09:00 - 18:00
                        <br />
                        Cumartesi: 09:00 - 16:00
                        <br />
                        Pazar: Kapalı
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden h-64">
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <MapPin size={48} />
                  <span className="ml-2">Harita Yer Tutucusu</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Mesaj Gönderin</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    Mesajınız Gönderildi!
                  </h3>
                  <p className="text-slate-600 mb-6">
                    En kısa sürede size geri dönüş yapacağız.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Yeni Mesaj Gönder
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        E-posta *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Konu
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Mesajınız *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>İşleniyor...</>
                    ) : (
                      <>
                        <Send size={20} />
                        Gönder
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
