import { useState, useEffect } from 'react';
import { FileQuestion, Search, Mail, Phone, Calendar, Package, Trash2, CheckCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { supabase } from '../../lib/supabase';

interface QuoteRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  product_name: string | null;
  quantity: string | null;
  message: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  created_at: string;
}

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      alert('Teklif talepleri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id: string, status: QuoteRequest['status']) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
      alert('Durum güncellendi');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Durum güncellenirken hata oluştu');
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm('Bu teklif talebini silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuotes(quotes.filter(q => q.id !== id));
      setSelectedQuote(null);
      alert('Teklif talebi silindi');
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Silme işlemi başarısız oldu');
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch =
      quote.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.product_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: QuoteRequest['status']) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-purple-100 text-purple-800',
      closed: 'bg-slate-100 text-slate-800'
    };

    const labels = {
      new: 'Yeni',
      contacted: 'İletişimde',
      quoted: 'Teklif Verildi',
      closed: 'Kapandı'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout currentPage="quotes">
        <div className="flex justify-center items-center h-64">
          <div className="text-slate-600">Yükleniyor...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="quotes">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileQuestion className="text-amber-600" />
              Teklif Talepleri
            </h1>
            <p className="text-slate-600 mt-1">
              Toplam {quotes.length} teklif talebi
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="İsim, email, şirket veya ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="new">Yeni</option>
              <option value="contacted">İletişimde</option>
              <option value="quoted">Teklif Verildi</option>
              <option value="closed">Kapandı</option>
            </select>
          </div>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <FileQuestion size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              Teklif talebi bulunamadı
            </h3>
            <p className="text-slate-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Arama kriterlerinize uygun teklif talebi bulunamadı.'
                : 'Henüz hiç teklif talebi alınmamış.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className={`bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedQuote?.id === quote.id
                      ? 'border-amber-500 ring-2 ring-amber-200'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">{quote.full_name}</h3>
                      {quote.company_name && (
                        <p className="text-sm text-slate-600">{quote.company_name}</p>
                      )}
                    </div>
                    {getStatusBadge(quote.status)}
                  </div>

                  {quote.product_name && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                      <Package size={16} />
                      <span>{quote.product_name}</span>
                      {quote.quantity && <span className="text-slate-400">• {quote.quantity}</span>}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar size={16} />
                    <span>{formatDate(quote.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              {selectedQuote ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{selectedQuote.full_name}</h2>
                      {selectedQuote.company_name && (
                        <p className="text-slate-600 mt-1">{selectedQuote.company_name}</p>
                      )}
                    </div>
                    {getStatusBadge(selectedQuote.status)}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                      <Mail size={20} className="text-slate-400 flex-shrink-0" />
                      <a href={`mailto:${selectedQuote.email}`} className="hover:text-amber-600 break-all">
                        {selectedQuote.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700">
                      <Phone size={20} className="text-slate-400 flex-shrink-0" />
                      <a href={`tel:${selectedQuote.phone}`} className="hover:text-amber-600">
                        {selectedQuote.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700">
                      <Calendar size={20} className="text-slate-400 flex-shrink-0" />
                      <span>{formatDate(selectedQuote.created_at)}</span>
                    </div>

                    {selectedQuote.product_name && (
                      <div className="pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-3 text-slate-700">
                          <Package size={20} className="text-slate-400 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{selectedQuote.product_name}</div>
                            {selectedQuote.quantity && (
                              <div className="text-sm text-slate-500">Miktar: {selectedQuote.quantity}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-2">Mesaj</h3>
                    <p className="text-slate-600 whitespace-pre-wrap">{selectedQuote.message}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-800 mb-3">Durum Güncelle</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updateQuoteStatus(selectedQuote.id, 'new')}
                        disabled={selectedQuote.status === 'new'}
                        className="px-3 py-2 text-sm rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Yeni
                      </button>
                      <button
                        onClick={() => updateQuoteStatus(selectedQuote.id, 'contacted')}
                        disabled={selectedQuote.status === 'contacted'}
                        className="px-3 py-2 text-sm rounded-lg border border-yellow-300 text-yellow-700 hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        İletişimde
                      </button>
                      <button
                        onClick={() => updateQuoteStatus(selectedQuote.id, 'quoted')}
                        disabled={selectedQuote.status === 'quoted'}
                        className="px-3 py-2 text-sm rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Teklif Verildi
                      </button>
                      <button
                        onClick={() => updateQuoteStatus(selectedQuote.id, 'closed')}
                        disabled={selectedQuote.status === 'closed'}
                        className="px-3 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Kapandı
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={() => deleteQuote(selectedQuote.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                      <span>Teklif Talebini Sil</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 rounded-xl p-12 text-center">
                  <FileQuestion size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600">
                    Detayları görmek için bir teklif talebi seçin
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
