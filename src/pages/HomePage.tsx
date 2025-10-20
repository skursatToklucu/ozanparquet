import { useState, useEffect } from 'react';
import { Star, ArrowRight, CheckCircle, Trophy, Users, Clock, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { supabase, Product, Category, BlogPost, Testimonial } from '../lib/supabase';
import { getUrl } from '../lib/utils';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroTitle, setHeroTitle] = useState('Premium Parke ve Laminat');
  const [heroSubtitle, setHeroSubtitle] = useState('Mekanlarınıza değer katan, kaliteli ve şık zemin kaplamaları');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (heroImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages]);

  const fetchData = async () => {
    const [productsRes, categoriesRes, blogRes, testimonialsRes, settingsRes] = await Promise.all([
      supabase.from('products').select('*').eq('featured', true).limit(6),
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(3),
      supabase.from('testimonials').select('*').eq('approved', true).order('display_order').limit(6),
      supabase.from('site_settings').select('*').in('setting_key', ['carousel_images', 'hero_title', 'hero_subtitle']),
    ]);

    if (productsRes.data) setFeaturedProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (blogRes.data) setBlogPosts(blogRes.data);
    if (testimonialsRes.data) setTestimonials(testimonialsRes.data);

    if (settingsRes.data) {
      const carouselSetting = settingsRes.data.find(s => s.setting_key === 'carousel_images');
      const titleSetting = settingsRes.data.find(s => s.setting_key === 'hero_title');
      const subtitleSetting = settingsRes.data.find(s => s.setting_key === 'hero_subtitle');

      if (carouselSetting?.setting_value) {
        setHeroImages(carouselSetting.setting_value);
      }
      if (titleSetting?.setting_value) {
        setHeroTitle(titleSetting.setting_value);
      }
      if (subtitleSetting?.setting_value) {
        setHeroSubtitle(subtitleSetting.setting_value);
      }
    }
  };

  const whyUs = [
    { icon: Trophy, title: 'Premium Kalite', desc: 'Avrupa standartlarında üretim ve seçkin ürün yelpazesi' },
    { icon: CheckCircle, title: 'Uzun Garanti', desc: '10-30 yıl arası garanti seçenekleri ile güvence' },
    { icon: Users, title: 'Uzman Ekip', desc: 'Alanında deneyimli montaj ve danışmanlık ekibi' },
    { icon: Clock, title: 'Hızlı Teslimat', desc: '3-7 iş günü içinde kapınızda' },
  ];

  return (
    <>
      <SEO
        title="Ana Sayfa"
        description="Premium kalitede laminat, masif ve mühendislik parke çözümleri. Uzun garanti, profesyonel montaj ve rekabetçi fiyatlarla Sample Parquet."
        canonical="/"
      />
      <Header currentPage="home" />

      <main className="pt-32">
        <section className="relative h-[600px] overflow-hidden">
          {heroImages.length > 0 ? heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`${heroTitle} ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
                      {heroTitle}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-slate-200">
                      {heroSubtitle}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href={getUrl('/products')}
                        className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors inline-flex items-center gap-2 shadow-lg"
                      >
                        Ürünleri İncele
                        <ArrowRight size={20} />
                      </a>
                      <a
                        href={getUrl('/get-quote')}
                        className="bg-white text-slate-800 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors shadow-lg"
                      >
                        Hemen Teklif Al
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-slate-200" />
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 text-center">
                  <h1 className="text-5xl md:text-6xl font-bold mb-4 text-slate-800">{heroTitle}</h1>
                  <p className="text-xl md:text-2xl mb-8 text-slate-600">{heroSubtitle}</p>
                </div>
              </div>
            </div>
          )}

          {heroImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-amber-500 w-8' : 'bg-white/50'
                }`}
              />
              ))}
            </div>
          )}
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Ürün Kategorileri
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                İhtiyacınıza uygun geniş ürün yelpazesi ile kusursuz zemin çözümleri
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={getUrl(`/products?category=${category.slug}`)}
                  className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <img
                    src={category.image_url || 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-slate-200 text-sm mb-3">{category.description}</p>
                    <div className="inline-flex items-center gap-2 text-amber-400 font-medium">
                      Keşfet
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Neden Sample Parquet?
              </h2>
              <p className="text-slate-600 text-lg">
                Sektörde 20 yılı aşkın tecrübemiz ile fark yaratan hizmet
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyUs.map((item, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:bg-amber-50 transition-colors"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                    <item.icon className="text-amber-600" size={32} />
                  </div>
                  <h3 className="font-semibold text-xl text-slate-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Öne Çıkan Ürünler
              </h2>
              <p className="text-slate-600 text-lg">
                En çok tercih edilen premium parke modellerimiz
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <a
                href={getUrl('/products')}
                className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Tüm Ürünleri Görüntüle
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Müşteri Yorumları
              </h2>
              <p className="text-slate-600 text-lg">
                Binlerce mutlu müşterimizin deneyimleri
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-slate-50 p-6 rounded-xl border border-slate-200"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.customer_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">
                        {testimonial.customer_name}
                      </div>
                      <div className="text-sm text-slate-600">
                        {testimonial.location} - {testimonial.project_type}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Blog & Öneriler
              </h2>
              <p className="text-slate-600 text-lg">
                Parke seçimi ve bakımı hakkında faydalı bilgiler
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {blogPosts.map((post) => (
                <a
                  key={post.id}
                  href={getUrl(`/blog/${post.slug}`)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                      {post.summary}
                    </p>
                    <div className="text-sm text-slate-500">
                      {new Date(post.published_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <div className="text-center">
              <a
                href={getUrl('/blog')}
                className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
              >
                Tüm Yazılar
                <ArrowRight size={20} />
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-amber-600 to-amber-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <MessageSquare size={48} className="mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ücretsiz Danışmanlık ve Teklif
            </h2>
            <p className="text-xl mb-8 text-amber-100 max-w-2xl mx-auto">
              Uzman ekibimiz size en uygun ürünü seçmenizde yardımcı olmak için hazır. Hemen iletişime geçin!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={getUrl('/get-quote')}
                className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-colors shadow-lg"
              >
                Online Teklif Al
              </a>
              <a
                href={getUrl('/contact')}
                className="bg-amber-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-900 transition-colors shadow-lg"
              >
                İletişime Geç
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
