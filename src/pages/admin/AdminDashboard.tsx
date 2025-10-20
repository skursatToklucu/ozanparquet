import { useEffect, useState } from 'react';
import { Package, FileText, Image, MessageSquare, Mail, FileQuestion, TrendingUp } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { supabase } from '../../lib/supabase';
import { getUrl } from '../../lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    blog_posts: 0,
    gallery_items: 0,
    testimonials: 0,
    contact_submissions: 0,
    quote_requests: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [products, blog, gallery, testimonials, contacts, quotes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('gallery_items').select('id', { count: 'exact', head: true }),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
      supabase.from('quote_requests').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      products: products.count || 0,
      blog_posts: blog.count || 0,
      gallery_items: gallery.count || 0,
      testimonials: testimonials.count || 0,
      contact_submissions: contacts.count || 0,
      quote_requests: quotes.count || 0,
    });
  };

  const cards = [
    { title: 'Ürünler', value: stats.products, icon: Package, color: 'bg-blue-500', href: '/admin/products' },
    { title: 'Blog Yazıları', value: stats.blog_posts, icon: FileText, color: 'bg-green-500', href: '/admin/blog' },
    { title: 'Galeri', value: stats.gallery_items, icon: Image, color: 'bg-purple-500', href: '/admin/gallery' },
    { title: 'Yorumlar', value: stats.testimonials, icon: MessageSquare, color: 'bg-yellow-500', href: '/admin/testimonials' },
    { title: 'İletişim', value: stats.contact_submissions, icon: Mail, color: 'bg-red-500', href: '/admin/contacts' },
    { title: 'Teklif Talepleri', value: stats.quote_requests, icon: FileQuestion, color: 'bg-amber-500', href: '/admin/quotes' },
  ];

  return (
    <AdminLayout currentPage="dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-600">Yönetim paneline hoş geldiniz</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a
              key={card.title}
              href={card.href}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">{card.value}</div>
              <div className="text-slate-600 text-sm">{card.title}</div>
            </a>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Hızlı Erişim</h2>
          <div className="space-y-3">
            <a
              href={getUrl('/admin/products')}
              className="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="font-medium text-slate-800">Yeni Ürün Ekle</div>
              <div className="text-sm text-slate-600">Ürün kataloğuna yeni ürün ekleyin</div>
            </a>
            <a
              href={getUrl('/admin/blog')}
              className="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="font-medium text-slate-800">Yeni Blog Yazısı</div>
              <div className="text-sm text-slate-600">Blog'a yeni içerik ekleyin</div>
            </a>
            <a
              href={getUrl('/admin/gallery')}
              className="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="font-medium text-slate-800">Galeri Yönetimi</div>
              <div className="text-sm text-slate-600">Proje fotoğraflarını yönetin</div>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Yardım</h2>
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <div className="font-medium text-slate-800 mb-1">Ürün Ekleme</div>
              <p>Ürünler sayfasından yeni ürün ekleyebilir, mevcut ürünleri düzenleyebilir veya silebilirsiniz.</p>
            </div>
            <div>
              <div className="font-medium text-slate-800 mb-1">Resim Yükleme</div>
              <p>Resim URL'lerini doğrudan girebilir veya harici bir resim barındırma hizmeti kullanabilirsiniz.</p>
            </div>
            <div>
              <div className="font-medium text-slate-800 mb-1">Kategori Yönetimi</div>
              <p>Kategoriler sayfasından ürün kategorilerini düzenleyebilirsiniz.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
