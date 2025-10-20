import { Eye, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { Product } from '../lib/supabase';
import { getUrl } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?w=600';

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={firstImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <a
              href={getUrl(`/products/${product.slug}`)}
              className="flex-1 bg-white text-slate-800 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors"
            >
              <Eye size={16} />
              İncele
            </a>
            <a
              href={getUrl('/get-quote')}
              className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors"
            >
              <ShoppingCart size={16} />
              Teklif Al
            </a>
          </div>
        </div>
        {product.featured && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Öne Çıkan
          </div>
        )}
        <div className="absolute top-4 right-4">
          {product.in_stock ? (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <CheckCircle size={12} />
              Stokta
            </div>
          ) : (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <XCircle size={12} />
              Tükendi
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-slate-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {product.short_description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {product.thickness && (
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
              {product.thickness}
            </span>
          )}
          {product.color_tone && (
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
              {product.color_tone}
            </span>
          )}
          {product.surface_finish && (
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
              {product.surface_finish}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            <span className="font-medium text-amber-600">{product.warranty_years} Yıl</span> Garanti
          </div>
          <div className="text-sm text-slate-600">
            {product.price_range || 'Fiyat'}
          </div>
        </div>
      </div>
    </div>
  );
}
