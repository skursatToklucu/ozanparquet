import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { supabase, Product, Category } from '../../lib/supabase';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    slug: '',
    description: '',
    short_description: '',
    images: [''],
    specifications: {} as Record<string, string>,
    price_range: '',
    thickness: '',
    surface_finish: '',
    color_tone: '',
    in_stock: true,
    featured: false,
    warranty_years: 0,
    box_coverage_sqm: 0,
  });
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');
    if (data) setCategories(data);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        category_id: product.category_id || '',
        name: product.name,
        slug: product.slug,
        description: product.description,
        short_description: product.short_description,
        images: product.images.length > 0 ? product.images : [''],
        specifications: product.specifications,
        price_range: product.price_range,
        thickness: product.thickness,
        surface_finish: product.surface_finish,
        color_tone: product.color_tone,
        in_stock: product.in_stock,
        featured: product.featured,
        warranty_years: product.warranty_years,
        box_coverage_sqm: product.box_coverage_sqm,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        category_id: '',
        name: '',
        slug: '',
        description: '',
        short_description: '',
        images: [''],
        specifications: {},
        price_range: '',
        thickness: '',
        surface_finish: '',
        color_tone: '',
        in_stock: true,
        featured: false,
        warranty_years: 0,
        box_coverage_sqm: 0,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const dataToSave = {
      ...formData,
      images: formData.images.filter(img => img.trim() !== ''),
      slug: formData.slug || generateSlug(formData.name),
    };

    if (editingProduct) {
      await supabase
        .from('products')
        .update(dataToSave)
        .eq('id', editingProduct.id);
    } else {
      await supabase.from('products').insert([dataToSave]);
    }

    setShowModal(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData({
        ...formData,
        specifications: { ...formData.specifications, [specKey]: specValue },
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout currentPage="products">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Ürünler</h1>
          <p className="text-slate-600">{products.length} ürün mevcut</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          <Plus size={20} />
          Yeni Ürün
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Ürün</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Kategori</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Özellikler</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Durum</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.map((product) => {
                const category = categories.find((c) => c.id === product.category_id);
                return (
                  <tr key={product.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium text-slate-800">{product.name}</div>
                          <div className="text-sm text-slate-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{category?.name || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {product.thickness && <div>{product.thickness}</div>}
                        {product.color_tone && <div>{product.color_tone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {product.in_stock ? (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Stokta
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            Tükendi
                          </span>
                        )}
                        {product.featured && (
                          <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                            Öne Çıkan
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) });
                    }}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">Kategori seçin</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kalınlık
                  </label>
                  <input
                    type="text"
                    value={formData.thickness}
                    onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                    placeholder="8mm"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Renk Tonu
                  </label>
                  <input
                    type="text"
                    value={formData.color_tone}
                    onChange={(e) => setFormData({ ...formData, color_tone: e.target.value })}
                    placeholder="Açık Kahve"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Yüzey İşlemi
                  </label>
                  <input
                    type="text"
                    value={formData.surface_finish}
                    onChange={(e) => setFormData({ ...formData, surface_finish: e.target.value })}
                    placeholder="Mat"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fiyat Aralığı
                  </label>
                  <select
                    value={formData.price_range}
                    onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Seçin</option>
                    <option value="Ekonomik">Ekonomik</option>
                    <option value="Orta Segment">Orta Segment</option>
                    <option value="Premium">Premium</option>
                    <option value="Lüks">Lüks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Garanti (Yıl)
                  </label>
                  <input
                    type="number"
                    value={formData.warranty_years}
                    onChange={(e) => setFormData({ ...formData, warranty_years: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kutu Kapsamı (m²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.box_coverage_sqm}
                    onChange={(e) => setFormData({ ...formData, box_coverage_sqm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kısa Açıklama
                  </label>
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Resimler (URL)
                  </label>
                  <div className="space-y-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={img}
                          onChange={(e) => updateImageField(index, e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                        {formData.images.length > 1 && (
                          <button
                            onClick={() => removeImageField(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addImageField}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      + Resim Ekle
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teknik Özellikler
                  </label>
                  <div className="space-y-2 mb-3">
                    {Object.entries(formData.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                        <span className="flex-1 text-sm">
                          <strong>{key}:</strong> {value}
                        </span>
                        <button
                          onClick={() => removeSpecification(key)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={specKey}
                      onChange={(e) => setSpecKey(e.target.value)}
                      placeholder="Anahtar (örn: Boyut)"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={specValue}
                      onChange={(e) => setSpecValue(e.target.value)}
                      placeholder="Değer (örn: 1285 x 192 mm)"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <button
                      onClick={addSpecification}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="in_stock"
                    checked={formData.in_stock}
                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                    className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="in_stock" className="text-sm font-medium text-slate-700">
                    Stokta Var
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700">
                    Öne Çıkan Ürün
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
