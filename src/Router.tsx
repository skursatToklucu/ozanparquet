import { useState, useEffect } from 'react';
import { useAuth } from './lib/AuthContext';
import { getCurrentPath } from './lib/utils';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import GetQuotePage from './pages/GetQuotePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminQuotesPage from './pages/admin/AdminQuotesPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export default function Router() {
  const [currentPath, setCurrentPath] = useState(getCurrentPath());
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getCurrentPath());
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);

    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      handleLocationChange();
    };

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.href.startsWith(window.location.origin) && !anchor.target) {
        e.preventDefault();
        window.history.pushState({}, '', anchor.href);
        handleLocationChange();
      }
    });

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  if (currentPath === '/' || currentPath === '/index.html') {
    return <HomePage />;
  }

  if (currentPath === '/products') {
    return <ProductsPage />;
  }

  if (currentPath.startsWith('/products/')) {
    const slug = currentPath.split('/products/')[1];
    return <ProductDetailPage slug={slug} />;
  }

  if (currentPath === '/about') {
    return <AboutPage />;
  }

  if (currentPath === '/services') {
    return <ServicesPage />;
  }

  if (currentPath === '/gallery') {
    return <GalleryPage />;
  }

  if (currentPath === '/blog') {
    return <BlogPage />;
  }

  if (currentPath.startsWith('/blog/')) {
    const slug = currentPath.split('/blog/')[1];
    return <BlogDetailPage slug={slug} />;
  }

  if (currentPath === '/faq') {
    return <FAQPage />;
  }

  if (currentPath === '/contact') {
    return <ContactPage />;
  }

  if (currentPath === '/get-quote') {
    return <GetQuotePage />;
  }

  if (currentPath === '/admin/login') {
    return <AdminLoginPage />;
  }

  if (currentPath.startsWith('/admin')) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Yükleniyor...</p>
          </div>
        </div>
      );
    }

    if (!isAdmin) {
      window.history.pushState({}, '', '/admin/login');
      return <AdminLoginPage />;
    }

    if (currentPath === '/admin' || currentPath === '/admin/') {
      return <AdminDashboard />;
    }

    if (currentPath === '/admin/products') {
      return <AdminProductsPage />;
    }

    if (currentPath === '/admin/categories') {
      return <AdminCategoriesPage />;
    }

    if (currentPath === '/admin/quotes') {
      return <AdminQuotesPage />;
    }

    if (currentPath === '/admin/settings') {
      return <AdminSettingsPage />;
    }

    return <AdminDashboard />;
  }

  return <HomePage />;
}
