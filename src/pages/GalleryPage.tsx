import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { supabase, GalleryItem } from '../lib/supabase';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  const fetchGallery = async () => {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('display_order');

    if (data) {
      setItems(data);
      setFilteredItems(data);
      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.category).filter(Boolean))
      );
      setCategories(uniqueCategories);
    }
  };

  return (
    <>
      <SEO
        title="Galeri"
        description="Başarılı projelerimizden örnekler. Konut ve ticari mekanlardan parke uygulama fotoğrafları."
        canonical="/gallery"
      />
      <Header currentPage="gallery" />

      <main className="pt-32 pb-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Proje Galerimiz
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Başarı ile tamamladığımız projelerden örnekler
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Tümü
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setLightboxImage(item.image_url)}
              >
                <img
                  src={item.thumbnail_url || item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    {item.location && (
                      <p className="text-sm text-slate-200">{item.location}</p>
                    )}
                  </div>
                </div>
                {item.category && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {item.category}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <X size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Görsel Bulunamadı
              </h3>
              <p className="text-slate-600">
                Bu kategoride henüz proje görseli bulunmamaktadır.
              </p>
            </div>
          )}
        </div>
      </main>

      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImage}
            alt="Gallery"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </>
  );
}
