import { useState, useEffect } from 'react';
import { Calendar, Tag } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { supabase, BlogPost } from '../lib/supabase';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (data) setPosts(data);
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Parke seçimi, bakımı ve dekorasyon hakkında faydalı bilgiler. Uzman ekibimizden ipuçları ve öneriler."
        canonical="/blog"
      />
      <Header currentPage="blog" />

      <main className="pt-32 pb-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Blog & Öneriler
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Parke ve zemin kaplama hakkında bilmeniz gereken her şey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(post.published_at).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <h2 className="font-bold text-xl text-slate-800 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-slate-600 mb-4 line-clamp-3">{post.summary}</p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium"
                        >
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
