import { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { supabase, Product, Category } from '../lib/supabase';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    thickness: '',
    surface: '',
    inStock: false,
    priceRange: '',
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*, categories(name, slug)');

    if (filters.category) {
      const category = categories.find((c) => c.slug === filters.category);
      if (category) {
        query = query.eq('category_id', category.id);
      }
    }

    if (filters.color) {
      query = query.ilike('color_tone', `%${filters.color}%`);
    }

    if (filters.thickness) {
      query = query.eq('thickness', filters.thickness);
    }

    if (filters.surface) {
      query = query.ilike('surface_finish', `%${filters.surface}%`);
    }

    if (filters.inStock) {
      query = query.eq('in_stock', true);
    }

    if (filters.priceRange) {
      query = query.eq('price_range', filters.priceRange);
    }

    const { data } = await query.order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      color: '',
      thickness: '',
      surface: '',
      inStock: false,
      priceRange: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '' && v !== false);

  return (
    <>
      <SEO
        title="Ürünler"
        description="Laminat, masif, mühendislik ve vinil parke modellerimizi keşfedin. Geniş renk ve desen seçenekleri ile hayalinizdeki zemini bulun."
        canonical="/products"
      />
      <Header currentPage="products" />

      <main className="pt-32 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Tüm Ürünler</h1>
            <p className="text-slate-600 text-lg">
              {products.length} ürün bulundu
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className={`lg:w-80 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-36">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <SlidersHorizontal size={20} />
                    Filtreler
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Temizle
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Tümü</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Renk Tonu
                    </label>
                    <select
                      value={filters.color}
                      onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Tümü</option>
                      <option value="Açık">Açık Tonlar</option>
                      <option value="Kahve">Kahve Tonları</option>
                      <option value="Koyu">Koyu Tonlar</option>
                      <option value="Gri">Gri Tonları</option>
                      <option value="Doğal">Doğal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kalınlık
                    </label>
                    <select
                      value={filters.thickness}
                      onChange={(e) => setFilters({ ...filters, thickness: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Tümü</option>
                      <option value="5mm">5mm</option>
                      <option value="8mm">8mm</option>
                      <option value="10mm">10mm</option>
                      <option value="12mm">12mm</option>
                      <option value="14mm">14mm</option>
                      <option value="15mm">15mm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Yüzey
                    </label>
                    <select
                      value={filters.surface}
                      onChange={(e) => setFilters({ ...filters, surface: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Tümü</option>
                      <option value="Mat">Mat</option>
                      <option value="Dokulu">Dokulu</option>
                      <option value="Cilalı">Cilalı</option>
                      <option value="Lake">Lake</option>
                      <option value="Yağlı">Yağlı</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fiyat Aralığı
                    </label>
                    <select
                      value={filters.priceRange}
                      onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Tümü</option>
                      <option value="Ekonomik">Ekonomik</option>
                      <option value="Orta Segment">Orta Segment</option>
                      <option value="Premium">Premium</option>
                      <option value="Lüks">Lüks</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                        className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Sadece Stokta Olanlar
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="w-full bg-white text-slate-800 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 border border-slate-300"
                >
                  <Filter size={20} />
                  {filtersOpen ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
                </button>
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                    >
                      <div className="aspect-[4/3] bg-slate-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-6 bg-slate-200 rounded" />
                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                        <div className="flex gap-2">
                          <div className="h-6 bg-slate-200 rounded w-16" />
                          <div className="h-6 bg-slate-200 rounded w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <X size={48} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    Ürün Bulunamadı
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Seçtiğiniz filtrelere uygun ürün bulunmamaktadır.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
