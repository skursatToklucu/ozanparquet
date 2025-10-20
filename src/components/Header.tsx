import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';
import { supabase, Category } from '../lib/supabase';
import { getUrl } from '../lib/utils';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = 'home' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [companyName, setCompanyName] = useState('Sample Parquet');
  const [companyTagline, setCompanyTagline] = useState('Premium Zemin Kaplamaları');
  const [logoUrl, setLogoUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('info@sampleparquet.com');
  const [contactPhone, setContactPhone] = useState('+90 555 123 45 67');

  useEffect(() => {
    fetchCategories();
    fetchSettings();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');
    if (data) setCategories(data);
  };

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .in('setting_key', ['company_name', 'company_tagline', 'logo_url', 'contact_email', 'contact_phone']);

    if (data) {
      data.forEach(setting => {
        if (setting.setting_key === 'company_name') setCompanyName(setting.setting_value);
        if (setting.setting_key === 'company_tagline') setCompanyTagline(setting.setting_value);
        if (setting.setting_key === 'logo_url') setLogoUrl(setting.setting_value);
        if (setting.setting_key === 'contact_email') setContactEmail(setting.setting_value);
        if (setting.setting_key === 'contact_phone') setContactPhone(setting.setting_value);
      });
    }
  };

  const navigation = [
    { name: 'Ana Sayfa', href: getUrl('/'), id: 'home' },
    { name: 'Ürünler', href: getUrl('/products'), id: 'products', hasSubmenu: true },
    { name: 'Hakkımızda', href: getUrl('/about'), id: 'about' },
    { name: 'Hizmetler', href: getUrl('/services'), id: 'services' },
    { name: 'Galeri', href: getUrl('/gallery'), id: 'gallery' },
    { name: 'Blog', href: getUrl('/blog'), id: 'blog' },
    { name: 'SSS', href: getUrl('/faq'), id: 'faq' },
    { name: 'İletişim', href: getUrl('/contact'), id: 'contact' },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="bg-slate-800 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <Phone size={14} />
              <span className="hidden sm:inline">{contactPhone}</span>
            </a>
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              <Mail size={14} />
              <span className="hidden md:inline">{contactEmail}</span>
            </a>
          </div>
          <div className="text-xs hidden md:block">
            Pazartesi - Cumartesi: 09:00 - 18:00
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <a href={getUrl('/')} className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="h-12 object-contain" />
            ) : (
              <>
                <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-2 rounded-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="9" height="9" rx="1" />
                    <rect x="13" y="2" width="9" height="9" rx="1" />
                    <rect x="2" y="13" width="9" height="9" rx="1" />
                    <rect x="13" y="13" width="9" height="9" rx="1" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-xl text-slate-800">{companyName}</div>
                  <div className="text-xs text-slate-600">{companyTagline}</div>
                </div>
              </>
            )}
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div key={item.id} className="relative group">
                <a
                  href={item.href}
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    currentPage === item.id
                      ? 'text-amber-600'
                      : 'text-slate-700 hover:text-amber-600'
                  }`}
                  onMouseEnter={() => item.hasSubmenu && setProductsMenuOpen(true)}
                >
                  {item.name}
                  {item.hasSubmenu && <ChevronDown size={16} />}
                </a>

                {item.hasSubmenu && productsMenuOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-4 border border-slate-200"
                    onMouseEnter={() => setProductsMenuOpen(true)}
                    onMouseLeave={() => setProductsMenuOpen(false)}
                  >
                    <div className="px-4 pb-2 text-xs font-semibold text-slate-500 uppercase">
                      Kategoriler
                    </div>
                    {categories.map((category) => (
                      <a
                        key={category.id}
                        href={getUrl(`/products?category=${category.slug}`)}
                        className="block px-4 py-2 text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      >
                        {category.name}
                      </a>
                    ))}
                    <div className="border-t border-slate-200 mt-2 pt-2">
                      <a
                        href={getUrl('/products')}
                        className="block px-4 py-2 text-amber-600 font-medium hover:bg-amber-50 transition-colors"
                      >
                        Tüm Ürünler
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:block">
            <a
              href={getUrl('/get-quote')}
              className="bg-amber-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
            >
              Teklif Al
            </a>
          </div>

          <button
            className="lg:hidden text-slate-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            {navigation.map((item) => (
              <div key={item.id}>
                <a
                  href={item.href}
                  className={`block py-3 font-medium ${
                    currentPage === item.id
                      ? 'text-amber-600'
                      : 'text-slate-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
                {item.hasSubmenu && (
                  <div className="pl-4 space-y-2 pb-2">
                    {categories.map((category) => (
                      <a
                        key={category.id}
                        href={getUrl(`/products?category=${category.slug}`)}
                        className="block py-2 text-sm text-slate-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              href={getUrl('/get-quote')}
              className="block text-center bg-amber-600 text-white px-6 py-3 rounded-lg font-medium mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Teklif Al
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
