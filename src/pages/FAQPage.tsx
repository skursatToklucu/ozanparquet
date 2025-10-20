import { useState, useEffect } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { supabase, FAQItem } from '../lib/supabase';
import { getUrl } from '../lib/utils';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    const { data } = await supabase
      .from('faq_items')
      .select('*')
      .order('display_order');

    if (data) setFaqs(data);
  };

  const categories = Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)));

  return (
    <>
      <SEO
        title="Sıkça Sorulan Sorular"
        description="Parke seçimi, montaj, bakım ve garanti hakkında en çok sorulan sorular ve cevapları."
        canonical="/faq"
      />
      <Header currentPage="faq" />

      <main className="pt-32 pb-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Sıkça Sorulan Sorular
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            {categories.map((category) => (
              <div key={category} className="mb-8">
                {category && (
                  <h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-amber-500">
                    {category}
                  </h2>
                )}
                <div className="space-y-3">
                  {faqs
                    .filter((faq) => faq.category === category)
                    .map((faq) => {
                      const globalIndex = faqs.findIndex((f) => f.id === faq.id);
                      const isOpen = openIndex === globalIndex;

                      return (
                        <div
                          key={faq.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                            className="w-full px-6 py-4 text-left flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                          >
                            <span className="font-semibold text-slate-800 flex-1">
                              {faq.question}
                            </span>
                            <ChevronDown
                              size={20}
                              className={`flex-shrink-0 text-amber-600 transition-transform mt-1 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4 text-slate-700 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-xl p-8 text-center">
            <MessageCircle size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Sorunuzu Bulamadınız mı?</h2>
            <p className="text-amber-100 mb-6">
              Uzman ekibimiz size yardımcı olmaktan mutluluk duyar
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={getUrl('/contact')}
                className="bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
              >
                İletişime Geç
              </a>
              <a
                href="tel:+905551234567"
                className="bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-900 transition-colors"
              >
                Hemen Ara
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
