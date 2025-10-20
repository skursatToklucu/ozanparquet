import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { supabase, Category } from '../../lib/supabase';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    display_order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        image_url: category.image_url,
        display_order: category.display_order,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        display_order: categories.length,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    const dataToSave = {
      ...formData,
      slug: formData.slug || generateSlug(formData.name),
    };

    if (editingCategory) {
      await supabase
        .from('categories')
        .update(dataToSave)
        .eq('id', editingCategory.id);
    } else {
      await supabase.from('categories').insert([dataToSave]);
    }

    setShowModal(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Bu kategoriye ait ürünler etkilenebilir.')) {
      await supabase.from('categories').delete().eq('id', id);
      fetchCategories();
    }
  };

  return (
    <AdminLayout currentPage="categories">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Kategoriler</h1>
          <p className="text-slate-600">{categories.length} kategori mevcut</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          <Plus size={20} />
          Yeni Kategori
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {category.image_url && (
              <div className="h-40 overflow-hidden bg-slate-200">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500">{category.slug}</p>
                </div>
                <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                  #{category.display_order}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(category)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit size={16} />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kategori Adı *
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
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resim URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sıralama
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
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
