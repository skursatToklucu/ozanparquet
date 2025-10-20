import { Hammer, Wrench, Sparkles, Phone } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { getUrl } from '../lib/utils';

export default function ServicesPage() {
  const services = [
    {
      icon: Hammer,
      title: 'Profesyonel Montaj',
      desc: 'Uzman ekibimiz ile kusursuz uygulama garantisi',
      features: [
        'Zemin analizi ve hazırlık',
        'Hızlı ve titiz montaj',
        'Montaj sonrası temizlik',
        'Kullanım talimatları',
      ],
    },
    {
      icon: Wrench,
      title: 'Zımparalama ve Vernik',
      desc: 'Eski parkenize yeni hayat',
      features: [
        'Profesyonel zımparalama',
        'Renk düzeltme',
        'UV lake veya yağ uygulaması',
        'Tam koruma garantisi',
      ],
    },
    {
      icon: Sparkles,
      title: 'Bakım ve Onarım',
      desc: 'Parkeniz her zaman yeni gibi',
      features: [
        'Periyodik bakım hizmeti',
        'Çizik ve hasar onarımı',
        'Renk tazeleme',
        'Koruyucu kaplama',
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Hizmetler"
        description="Profesyonel montaj, zımparalama, bakım ve onarım hizmetleri. Uzman ekibimiz ile parkeniz her zaman mükemmel."
        canonical="/services"
      />
      <Header currentPage="services" />

      <main className="pt-32 pb-16">
        <section className="bg-gradient-to-br from-amber-600 to-amber-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Hizmetlerimiz</h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              Satış sonrası profesyonel hizmetlerimiz ile yanınızdayız
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="space-y-16">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                      <service.icon className="text-amber-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">
                      {service.title}
                    </h2>
                    <p className="text-slate-600 text-lg mb-6">{service.desc}</p>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-slate-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={getUrl('/contact')}
                      className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                    >
                      <Phone size={20} />
                      Bilgi Al
                    </a>
                  </div>
                  <div className={`rounded-xl overflow-hidden shadow-2xl ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <img
                      src={`https://images.pexels.com/photos/${
                        index === 0 ? '4107278' : index === 1 ? '1350789' : '1090638'
                      }/pexels-photo-${index === 0 ? '4107278' : index === 1 ? '1350789' : '1090638'}.jpeg`}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">
              Hizmet Sürecimiz
            </h2>
            <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto">
              Başvurudan teslimata kadar her adımda yanınızdayız
            </p>

            <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto">
              {[
                { step: '1', title: 'Başvuru', desc: 'Formu doldurun veya arayın' },
                { step: '2', title: 'Keşif', desc: 'Uzmanımız ücretsiz keşif yapar' },
                { step: '3', title: 'Teklif', desc: 'Detaylı fiyat teklifi alın' },
                { step: '4', title: 'Uygulama', desc: 'Profesyonel ekip işe başlar' },
                { step: '5', title: 'Teslim', desc: 'Temiz teslim ve garanti' },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-amber-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
