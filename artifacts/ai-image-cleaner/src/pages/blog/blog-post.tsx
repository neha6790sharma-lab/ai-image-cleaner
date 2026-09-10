import { useEffect } from 'react';
import { Link, useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, ArrowLeft, ArrowRight, FileQuestion, ShieldCheck, CalendarDays } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { fetchPostBySlug, formatDate } from '@/lib/blog-data';
import { setDocumentMeta, resetDocumentMeta } from '@/lib/seo';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ['published-post', slug],
    queryFn: () => fetchPostBySlug(slug as string),
    enabled: Boolean(slug),
  });

  useEffect(() => {
    if (!post) return;
    setDocumentMeta(
      `${post.title} — cleaner.`,
      post.meta_description || post.excerpt || post.title,
    );
    return resetDocumentMeta;
  }, [post]);

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <header className="flex items-center justify-between border-b border-[#252f33] px-4 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0bd5b]/50 bg-[#f0bd5b]/10 text-[#f0bd5b] transition-transform group-hover:rotate-6">
            <Sparkles size={17} strokeWidth={1.8} />
          </span>
          <span className="block text-[15px] font-bold tracking-[-0.02em] text-[#f5f1e8]">
            cleaner<span className="text-[#f0bd5b]">.</span>
          </span>
        </Link>
        <Link href="/blog" className="flex items-center gap-2 text-xs font-medium text-[#9eabad] transition-colors hover:text-[#f5f1e8]">
          <ArrowLeft size={14} /> All posts
        </Link>
      </header>

      <div className="cleaner-grid min-h-[calc(100dvh-73px)]">
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
    </main>
  );
}