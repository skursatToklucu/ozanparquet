import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  Image,
  MessageSquare,
  HelpCircle,
  Mail,
  FileQuestion,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage?: string;
}

export default function AdminLayout({ children, currentPage = 'dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminUser, signOut } = useAuth();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { id: 'products', name: 'Ürünler', href: '/admin/products', icon: Package },
    { id: 'categories', name: 'Kategoriler', href: '/admin/categories', icon: FolderTree },
    { id: 'blog', name: 'Blog', href: '/admin/blog', icon: FileText },
    { id: 'gallery', name: 'Galeri', href: '/admin/gallery', icon: Image },
    { id: 'testimonials', name: 'Yorumlar', href: '/admin/testimonials', icon: MessageSquare },
    { id: 'faq', name: 'SSS', href: '/admin/faq', icon: HelpCircle },
    { id: 'contacts', name: 'İletişim', href: '/admin/contacts', icon: Mail },
    { id: 'quotes', name: 'Teklif Talepleri', href: '/admin/quotes', icon: FileQuestion },
    { id: 'settings', name: 'Site Ayarları', href: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    window.history.pushState({}, '', '/admin/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <div className="font-bold text-lg">Sample Parquet</div>
            <div className="text-xs text-slate-400">Admin Panel</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3 px-2">
            <div>
              <div className="text-sm font-medium">{adminUser?.full_name}</div>
              <div className="text-xs text-slate-400">{adminUser?.email}</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>Çıkış</span>
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-800"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-600 hover:text-amber-600 transition-colors"
              >
                Siteyi Görüntüle →
              </a>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
