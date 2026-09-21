import { useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowRight, FileQuestion, ShieldCheck, CalendarDays } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { AboutSection } from '@/components/sections/about';
import { fetchPostBySlug, formatDate, stripMarkdown } from '@/lib/blog-data';
import {
  setDocumentMeta,
  resetDocumentMeta,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  type PageMeta,
} from '@/lib/seo';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ['published-post', slug],
    queryFn: () => fetchPostBySlug(slug as string),
    enabled: Boolean(slug),
  });

  useEffect(() => {
    let meta: PageMeta;
    if (post) {
      const description =
        post.meta_description || post.excerpt || stripMarkdown(post.content).slice(0, 150) || post.title;
      const postUrl = `${SITE_URL}/blog/${post.slug}`;
      const ogImage = post.featured_image || DEFAULT_OG_IMAGE;
      const title = `${post.title} — cleaner.`;
      meta = {
        title,
        description,
        canonical: postUrl,
        og: {
          type: 'article',
          title,
          description,
          url: postUrl,
          image: ogImage,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          image: ogImage,
        },
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
          headline: post.title,
          description,
          image: ogImage,
          url: postUrl,
          datePublished: post.published_at || post.created_at,
          dateModified: post.updated_at,
          author: { '@type': 'Organization', name: 'cleaner.' },
        },
      };
    } else if (!isLoading) {
      meta = {
        title: 'Post not found — cleaner.',
        description: 'This post does not exist or has not been published yet.',
      };
    } else {
      return resetDocumentMeta;
    }
    setDocumentMeta(meta);
    return resetDocumentMeta;
  }, [post, isLoading]);

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <SiteNavbar />

      <div className="cleaner-grid">
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Spinner className="size-5 text-[#f0bd5b]" />
            </div>
          ) : !post ? (
            <div className="cleaner-animate-in text-center">
              <FileQuestion className="mx-auto mb-5 size-10 text-[#4b5a5e]" />
              <h1 className="text-2xl font-semibold tracking-[-0.03em]">Post not found</h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#9eabad]">
                This post does not exist or has not been published yet.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link href="/blog">
                  <Button type="button" variant="outline" className="text-[#9eabad]">Back to blog</Button>
                </Link>
                <Link href="/">
                  <Button type="button">Back to the tool</Button>
                </Link>
              </div>
            </div>
          ) : (
            <article className="cleaner-animate-in">
              <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
                <CalendarDays size={13} />
                {formatDate(post.published_at)}
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-[-.05em] sm:text-5xl">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-5 border-l-2 border-[#f0bd5b]/60 pl-4 text-base leading-7 text-[#c6cfca]">
                  {post.excerpt}
                </p>
              )}
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="mt-8 aspect-[16/9] w-full rounded-2xl border border-[#293337] object-cover"
                />
              )}
              <div className="mt-8 border-t border-[#293337] pt-8">
                <article className="prose prose-invert max-w-none prose-headings:text-[#f5f1e8] prose-p:text-[#c6cfca] prose-strong:text-[#f5f1e8] prose-a:text-[#62e4dc] prose-code:text-[#f0bd5b] prose-blockquote:text-[#9eabad] prose-pre:border prose-pre:border-[#36454a] prose-pre:bg-[#151b1e] prose-img:rounded-xl">
                  {post.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                  ) : (
                    <p className="text-[#718082]">This post has no content yet.</p>
                  )}
                </article>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#293337] pt-6">
                <p className="text-xs text-[#718082]">
                  Published {formatDate(post.published_at)}
                </p>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-xs font-medium text-[#9eabad] transition-colors hover:text-[#f5f1e8]"
                >
                  More posts <ArrowRight size={14} />
                </Link>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#293337] bg-[#151b1e]/70 px-4 py-3 text-xs text-[#718082]">
                <ShieldCheck size={14} className="shrink-0 text-[#62e4dc]" />
                Everything on this site runs in your browser - no account, no cloud library.
              </div>
            </article>
          )}
        </div>
      </div>

      <AboutSection />
      <SiteFooter />
    </main>
  );
}