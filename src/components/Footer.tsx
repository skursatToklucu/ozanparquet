import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { getUrl } from '../lib/utils';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-amber-600 to-amber-800 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="9" height="9" rx="1" />
                  <rect x="13" y="2" width="9" height="9" rx="1" />
                  <rect x="2" y="13" width="9" height="9" rx="1" />
                  <rect x="13" y="13" width="9" height="9" rx="1" />
                </svg>
              </div>
              <div className="font-bold text-lg">Sample Parquet</div>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Premium kalitede parke ve zemin kaplama çözümleri. Doğal ahşabın sıcaklığını evinize taşıyoruz.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-sm">
              <li><a href={getUrl('/about')} className="text-slate-400 hover:text-amber-400 transition-colors">Hakkımızda</a></li>
              <li><a href={getUrl('/products')} className="text-slate-400 hover:text-amber-400 transition-colors">Ürünler</a></li>
              <li><a href={getUrl('/services')} className="text-slate-400 hover:text-amber-400 transition-colors">Hizmetler</a></li>
              <li><a href={getUrl('/gallery')} className="text-slate-400 hover:text-amber-400 transition-colors">Galeri</a></li>
              <li><a href={getUrl('/blog')} className="text-slate-400 hover:text-amber-400 transition-colors">Blog</a></li>
              <li><a href={getUrl('/faq')} className="text-slate-400 hover:text-amber-400 transition-colors">Sıkça Sorulan Sorular</a></li>
              <li><a href={getUrl('/contact')} className="text-slate-400 hover:text-amber-400 transition-colors">İletişim</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Ürün Kategorileri</h3>
            <ul className="space-y-2 text-sm">
              <li><a href={getUrl('/products?category=laminat-parke')} className="text-slate-400 hover:text-amber-400 transition-colors">Laminat Parke</a></li>
              <li><a href={getUrl('/products?category=masif-parke')} className="text-slate-400 hover:text-amber-400 transition-colors">Masif Parke</a></li>
              <li><a href={getUrl('/products?category=muhendislik-parke')} className="text-slate-400 hover:text-amber-400 transition-colors">Mühendislik Parke</a></li>
              <li><a href={getUrl('/products?category=vinil-parke')} className="text-slate-400 hover:text-amber-400 transition-colors">Vinil Parke</a></li>
              <li><a href={getUrl('/products?category=supurgelik')} className="text-slate-400 hover:text-amber-400 transition-colors">Süpürgelik</a></li>
              <li><a href={getUrl('/products?category=dis-mekan-deck')} className="text-slate-400 hover:text-amber-400 transition-colors">Dış Mekan Deck</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">Örnek Mahallesi, Parke Sokak No:123<br />İstanbul, Türkiye</span>
              </li>
              <li>
                <a href="tel:+905551234567" className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors">
                  <Phone size={18} className="text-amber-500" />
                  +90 555 123 45 67
                </a>
              </li>
              <li>
                <a href="mailto:info@sampleparquet.com" className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors">
                  <Mail size={18} className="text-amber-500" />
                  info@sampleparquet.com
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-sm">Çalışma Saatleri</h4>
              <p className="text-slate-400 text-sm">Pazartesi - Cumartesi<br />09:00 - 18:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <div>
            © {currentYear} Sample Parquet. Tüm hakları saklıdır.
          </div>
          <div className="flex gap-6">
            <a href={getUrl('/privacy')} className="hover:text-amber-400 transition-colors">Gizlilik Politikası</a>
            <a href={getUrl('/terms')} className="hover:text-amber-400 transition-colors">Kullanım Koşulları</a>
            <a href={getUrl('/kvkk')} className="hover:text-amber-400 transition-colors">KVKK</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
