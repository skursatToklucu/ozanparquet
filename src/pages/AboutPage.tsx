import { Award, Users, Target, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function AboutPage() {
  const values = [
    { icon: Award, title: 'Kalite', desc: 'Avrupa standartlarında premium ürünler' },
    { icon: Users, title: 'Müşteri Memnuniyeti', desc: 'Her zaman müşteri odaklı hizmet' },
    { icon: Target, title: 'Güvenilirlik', desc: 'Söz verdiğimizi zamanında yerine getiriyoruz' },
    { icon: Heart, title: 'Tutku', desc: 'Ahşaba ve doğaya olan sevgimiz' },
  ];

  const timeline = [
    { year: '2003', event: 'Sample Parquet kuruldu' },
    { year: '2008', event: 'İlk showroom açıldı' },
    { year: '2015', event: '10.000+ mutlu müşteri' },
    { year: '2020', event: 'Online satış platformu' },
    { year: '2024', event: 'Türkiye genelinde 50+ bayi' },
  ];

  return (
    <>
      <SEO
        title="Hakkımızda"
        description="20 yılı aşkın tecrübemiz ile premium parke ve zemin kaplama çözümleri. Kalite, güvenilirlik ve müşteri memnuniyeti önceliğimiz."
        canonical="/about"
      />
      <Header currentPage="about" />

      <main className="pt-32 pb-16">
        <section className="bg-gradient-to-br from-amber-600 to-amber-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Hakkımızda</h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              20 yılı aşkın deneyimimiz ile doğal ahşabın sıcaklığını binlerce eve taşıdık
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Hikayemiz</h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>
                    Sample Parquet, 2003 yılında ahşaba olan tutkusu ve kaliteli ürün sunma vizyonu ile kuruldu.
                    Kurucularımızın 30 yılı aşkın ahşap sektöründeki tecrübesi, şirketimizin temelini oluşturdu.
                  </p>
                  <p>
                    İlk günden beri amacımız, müşterilerimize en kaliteli parke ürünlerini en uygun fiyatlarla sunmak
                    ve profesyonel hizmet anlayışımızla sektörde fark yaratmak oldu.
                  </p>
                  <p>
                    Bugün, Türkiye'nin dört bir yanında binlerce mutlu müşterimiz ve 50'den fazla bayimiz ile
                    sektörün öncü firmalarından biri haline geldik.
                  </p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg"
                  alt="Sample Parquet Showroom"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Değerlerimiz</h2>
              <p className="text-slate-600 text-lg">Bizi biz yapan temel prensipler</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                    <value.icon className="text-amber-600" size={32} />
                  </div>
                  <h3 className="font-semibold text-xl text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-slate-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Yolculuğumuz</h2>
              <p className="text-slate-600 text-lg">Başarı dolu yıllarımız</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-amber-300 -translate-x-1/2" />
                <div className="space-y-12">
                  {timeline.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-8 ${
                        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                      }`}
                    >
                      <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                        <div className="bg-white p-6 rounded-xl shadow-md inline-block">
                          <div className="text-2xl font-bold text-amber-600 mb-2">{item.year}</div>
                          <div className="text-slate-700">{item.event}</div>
                        </div>
                      </div>
                      <div className="w-4 h-4 bg-amber-500 rounded-full border-4 border-white shadow-lg z-10" />
                      <div className="flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Sertifikalar ve Ödüller</h2>
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {['ISO 9001', 'CE Belgesi', 'TSE Belgesi', 'Yeşil Bina'].map((cert, index) => (
                <div key={index} className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <Award size={48} className="mx-auto mb-4 text-amber-400" />
                  <div className="font-semibold">{cert}</div>
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
