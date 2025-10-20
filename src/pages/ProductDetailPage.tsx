import { useState, useEffect } from 'react';
import { CheckCircle, MessageCircle, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { supabase, Product } from '../lib/supabase';
import { getUrl } from '../lib/utils';

interface ProductDetailPageProps {
  slug: string;
}

export default function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      setProduct(data);
      fetchRelatedProducts(data.category_id);
      incrementViewCount(data.id);
    }
  };

  const fetchRelatedProducts = async (categoryId: string) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .neq('slug', slug)
      .limit(3);
    if (data) setRelatedProducts(data);
  };

  const incrementViewCount = async (id: string) => {
    if (product) {
      await supabase
        .from('products')
        .update({ view_count: product.view_count + 1 })
        .eq('id', id);
    }
  };

  if (!product) {
    return (
      <>
        <Header />
        <div className="pt-32 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Ürün Bulunamadı</h1>
            <a href={getUrl('/products')} className="text-amber-600 hover:text-amber-700">
              Ürünlere Dön
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <SEO
        title={product.name}
        description={product.short_description || product.description}
        canonical={`/products/${product.slug}`}
        ogImage={images[0]}
        ogType="product"
      />
      <Header currentPage="products" />

      <main className="pt-32 pb-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <a href={getUrl('/products')} className="text-amber-600 hover:text-amber-700 font-medium">
              ← Ürünlere Dön
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="grid lg:grid-cols-2 gap-8 p-8">
              <div>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  <img
                    src={images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setLightboxOpen(true)}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          idx === currentImageIndex
                            ? 'border-amber-500'
                            : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {product.in_stock ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <CheckCircle size={16} />
                      Stokta
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Stokta Yok
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Öne Çıkan
                    </span>
                  )}
                </div>

                <p className="text-slate-700 text-lg mb-6">{product.description}</p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {product.warranty_years > 0 && (
                      <div>
                        <div className="text-slate-600 mb-1">Garanti</div>
                        <div className="font-semibold text-slate-800">
                          {product.warranty_years} Yıl
                        </div>
                      </div>
                    )}
                    {product.box_coverage_sqm > 0 && (
                      <div>
                        <div className="text-slate-600 mb-1">Kutu Kapsamı</div>
                        <div className="font-semibold text-slate-800">
                          {product.box_coverage_sqm} m²
                        </div>
                      </div>
                    )}
                    {product.price_range && (
                      <div>
                        <div className="text-slate-600 mb-1">Fiyat Segmenti</div>
                        <div className="font-semibold text-slate-800">
                          {product.price_range}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <a
                    href={getUrl('/get-quote')}
                    className="flex-1 bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors text-center"
                  >
                    Teklif Al
                  </a>
                  <a
                    href="https://wa.me/905551234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    WhatsApp
                  </a>
                </div>

                <button
                  onClick={() => {
                    navigator.share?.({
                      title: product.name,
                      text: product.short_description,
                      url: window.location.href,
                    });
                  }}
                  className="w-full border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  Paylaş
                </button>
              </div>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Teknik Özellikler</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">{key}</div>
                      <div className="font-semibold text-slate-800">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Benzer Ürünler</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/20 p-2 rounded-full hover:bg-white/30"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      )}

      <Footer />
    </>
  );
}
