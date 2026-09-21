import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ImageIcon, Newspaper, ArrowRight } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { SiteNavbar } from '@/components/site-navbar';
import { SiteFooter } from '@/components/site-footer';
import { FaqSection } from '@/components/sections/faq';
import {
  fetchPublishedPosts,
  formatDate,
  type BlogPost,
} from '@/lib/blog-data';
import { useEffect } from 'react';
import { setDocumentMeta, resetDocumentMeta, SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';

const TOOL_LINES = [
  'Remove Object — brush away photobombers, cables, and blemishes while local AI fills in the gap.',
  'Crop and Resize — reframe a photo or trim the edges before you post or print.',
  'Convert Format — move between JPG, PNG, and WEBP with a quality slider.',
  'Passport Size — exact presets for passport, visa, PAN, and stamp-size photos.',
  'Rotate / Flip — straighten scans and mirror images, stacked as often as you like.',
  'Adjust & Filters — brightness, contrast, and saturation with one-tap B&W and sepia.',
  'Compress Image — shrink file size for email, forms, and the web.',
  'Watermark / Add Text — stamp text in any corner at the size and opacity you choose.',
  'Remove Privacy Data — drop the GPS, device info, and dates hidden in your photos.',
  'Remove Background — a free local AI model cuts out the subject to a transparent PNG.',
];

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

  const BLOG_DESCRIPTION =
    'Practical, no-fluff guides to everyday image problems — removing photobombers, cropping, compressing, passport sizing, and keeping photos private in your browser.';

  useEffect(() => {
    setDocumentMeta({
      title: 'Blog — cleaner.',
      description: BLOG_DESCRIPTION,
      canonical: `${SITE_URL}/blog`,
      og: {
        type: 'website',
        title: 'Blog — cleaner.',
        description: BLOG_DESCRIPTION,
        url: `${SITE_URL}/blog`,
        image: DEFAULT_OG_IMAGE,
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog — cleaner.',
        description: BLOG_DESCRIPTION,
        image: DEFAULT_OG_IMAGE,
      },
    });
    return resetDocumentMeta;
  }, []);

  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <SiteNavbar />
      <div className="cleaner-grid">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8">
          <div className="cleaner-animate-in mb-8">
            <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
              <span className="h-px w-7 bg-[#62e4dc]" /> Latest posts
            </div>
            <h1 className="text-4xl font-bold tracking-[-.06em] sm:text-5xl">
              The <span className="text-[#f0bd5b]">blog.</span>
            </h1>
            <p className="mt-3 max-w-[520px] text-base leading-7 text-[#9eabad]">
              Notes, tips and updates from the cleaner. team. Newest first.
            </p>
          </div>

          <div className="cleaner-animate-in cleaner-delay-1 mb-10 max-w-3xl rounded-2xl border border-[#293337] bg-[#151b1e]/70 p-6 sm:p-8">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#f5f1e8]">
              Short guides for pictures you only get one shot at
            </h2>
            <div className="mt-3 space-y-4 text-sm leading-7 text-[#9eabad]">
              <p>
                Most people search for "how to remove an object from a photo", land on a page buried in banner ads, and give
                up within a minute. This blog is the opposite of that. It is written for everyday image problems — a group
                photo with a photobomber, a scan that arrived sideways, a screenshot that is too big to email, a passport
                photo with the wrong proportions.
              </p>
              <p>
                Every guide here is grounded in tools that actually run on this site, in your browser, for free. When a trick
                needs a desktop application or a paid subscription, we say so plainly and show you a cleaner alternative if
                one exists. We keep the posts practical, focused on the how, and short enough to act on immediately.
              </p>
              <p>
                New posts appear here as we explore the craft of quick, private image editing. You do not need an account to
                read any of it — and you can try every technique on this site without uploading a single file to a server.
              </p>
            </div>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#f0bd5b] px-4 py-2.5 text-sm font-bold text-[#171719] shadow-[0_5px_0_#9a7031] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#9a7031] active:translate-y-0 active:shadow-[0_2px_0_#9a7031]"
            >
              Try a tool for yourself <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Spinner className="size-5 text-[#f0bd5b]" />
            </div>
          ) : posts.length === 0 ? (
            <Empty className="border-[#293337] bg-[#151b1e]/40">
              <EmptyMedia variant="icon" className="text-[#f0bd5b]">
                <Newspaper className="size-5" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle className="text-[#f5f1e8]">No posts published yet</EmptyTitle>
                <EmptyDescription className="text-[#9eabad]">
                  Check back soon. In the meantime, the tools are all here and free to use.
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

      <section className="border-t border-[#252f33] bg-[#121719]/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:items-start">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]">
                <span className="h-px w-7 bg-[#62e4dc]" /> The short version
              </div>
              <h2 className="text-2xl font-bold tracking-[-.05em] text-[#f5f1e8] sm:text-3xl">
                What cleaner. actually is
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[#9eabad]">
                <p>
                  cleaner. is a free image utility that runs in your browser. You open the page, drop in a JPG, PNG, or WEBP
                  file, and every everyday edit — cropping, converting, compressing, rotating, watermarking, passport sizing,
                  and cleaning up privacy data — happens in the tab you already have open. There is no app to install and no
                  account to create.
                </p>
                <p>
                  Your files never reach a cloud library. The two AI-heavy tools, Remove Object and Remove Background, hand
                  their processing step to a private local service that keeps nothing in memory. When you close the tab, your
                  photo is gone. That is the entire privacy model, and it covers every tool on the list.
                </p>
                <p>
                  It is also free. No trials, no watermark stamped across exports, and no paywall hiding the "export" button.
                  Whatever a tool promises, it does — that is the point of the site.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#293337] bg-[#151b1e]/70 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[.14em] text-[#62e4dc]">The ten tools</h3>
              <ul className="mt-4 space-y-3">
                {TOOL_LINES.map((line) => (
                  <li key={line} className="text-[13px] leading-5 text-[#9eabad]">
                    <span className="mr-2 text-[#f0bd5b]">—</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
      <SiteFooter />
    </main>
  );
}