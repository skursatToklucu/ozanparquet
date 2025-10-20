import { useState, useEffect } from 'react';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { supabase, BlogPost } from '../lib/supabase';
import { getUrl } from '../lib/utils';

interface BlogDetailPageProps {
  slug: string;
}

export default function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (data) {
      setPost(data);
      fetchRelatedPosts(data.tags);
    }
  };

  const fetchRelatedPosts = async (tags: string[]) => {
    if (!tags || tags.length === 0) return;

    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .neq('slug', slug)
      .limit(3);

    if (data) setRelatedPosts(data);
  };

  if (!post) {
    return (
      <>
        <Header />
        <div className="pt-32 pb-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Yazı Bulunamadı</h1>
            <a href={getUrl('/blog')} className="text-amber-600 hover:text-amber-700">
              Blog'a Dön
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.summary}
        canonical={`/blog/${post.slug}`}
        ogImage={post.cover_image}
        ogType="article"
      />
      <Header currentPage="blog" />

      <main className="pt-32 pb-16 bg-slate-50">
        <article className="container mx-auto px-4 max-w-4xl">
          <a
            href={getUrl('/blog')}
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Blog'a Dön
          </a>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="aspect-[21/9] overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  {new Date(post.published_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <span>•</span>
                <span>{post.author}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                {post.title}
              </h1>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="prose prose-slate max-w-none
                  prose-headings:font-bold prose-headings:text-slate-800
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-amber-600 prose-a:no-underline hover:prose-a:text-amber-700
                  prose-strong:text-slate-800 prose-strong:font-semibold
                  prose-ul:my-4 prose-li:text-slate-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">İlgili Yazılar</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relPost) => (
                  <a
                    key={relPost.id}
                    href={`/blog/${relPost.slug}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relPost.cover_image}
                        alt={relPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-2">
                        {relPost.title}
                      </h3>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
}
