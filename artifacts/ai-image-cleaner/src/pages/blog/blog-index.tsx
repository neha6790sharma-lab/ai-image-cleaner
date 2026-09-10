import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, ImageIcon, Newspaper } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import {
  fetchPublishedPosts,
  formatDate,
  type BlogPost,
} from '@/lib/blog-data';
import { useEffect } from 'react';
import { setDocumentMeta, resetDocumentMeta } from '@/lib/seo';

function BlogHeader() {
  return (
    <header className="flex items-center justify-between border-b border-[#252f33] px-4 py-4 sm:px-8 lg:px-12">
      <Link href="/" className="group flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0bd5b]/50 bg-[#f0bd5b]/10 text-[#f0bd5b] transition-transform group-hover:rotate-6">
          <Sparkles size={17} strokeWidth={1.8} />
        </span>
        <span className="text-left">
          <span className="block text-[15px] font-bold tracking-[-0.02em] text-[#f5f1e8]">
            cleaner<span className="text-[#f0bd5b]">.</span>
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[.18em] text-[#748487] sm:block">blog</span>
        </span>
      </Link>
      <Link href="/" className="flex items-center gap-2 text-xs font-medium text-[#9eabad] transition-colors hover:text-[#f5f1e8]">
        Back to the tool <ArrowRight size={14} />
      </Link>
    </header>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-[#293337] bg-[#151b1e]/70 transition-colors hover:border-[#f0bd5b]/50"
    >
      {post.featured_image ? (
        <img
          src={post.featured_image}
          alt={post.title}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-[#101517] text-[#4b5a5e]">
          <ImageIcon size={28} strokeWidth={1.5} />
        </div>
      )}
      <div className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#62e4dc]">
          {formatDate(post.published_at)}
        </p>
        <h2 className="mt-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-[#f5f1e8] transition-colors group-hover:text-[#f0bd5b]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#9eabad]">
          {post.excerpt || 'Read the full post.'}
        </p>
      </div>
    </Link>
  );
}

export default function BlogIndexPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['published-posts'],
    queryFn: fetchPublishedPosts,
  });

  useEffect(() => {
    setDocumentMeta('Blog — cleaner.', 'Notes, tips and updates from the cleaner. team.');
    return resetDocumentMeta;
  }, []);

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <BlogHeader />
      <div className="cleaner-grid min-h-[calc(100dvh-73px)]">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8">
          <div className="cleaner-animate-in mb-8">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
              <span className="h-px w-7 bg-[#62e4dc]" /> Latest posts
            </div>
            <h1 className="text-4xl font-bold tracking-[-.06em] sm:text-5xl">
              The{" "}<span className="text-[#f0bd5b]">blog.</span>
            </h1>
            <p className="mt-3 max-w-[520px] text-base leading-7 text-[#9eabad]">
              Notes, tips and updates from the cleaner. team. Newest first.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Spinner className="size-5 text-[#f0bd5b]" />
            </div>
          ) : posts.length === 0 ? (
            <Empty className="border-[#293337] bg-[#151b1e]/40">
              <EmptyMedia variant="icon" className="text-[#f0bd5b]"><Newspaper className="size-5" /></EmptyMedia>
              <EmptyHeader>
                <EmptyTitle className="text-[#f5f1e8]">No posts published yet</EmptyTitle>
                <EmptyDescription className="text-[#9eabad]">
                  Check back soon.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}