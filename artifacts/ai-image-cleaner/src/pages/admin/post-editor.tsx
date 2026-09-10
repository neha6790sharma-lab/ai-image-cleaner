import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  Sparkles,
  Save,
  Eye,
  PencilLine,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import {
  fetchPostById,
  createPost,
  updatePost,
  slugify,
  stripMarkdown,
  formatDate,
  signOut,
  type BlogPostInput,
} from '@/lib/blog-data';
import { ADMIN_DASHBOARD_PATH } from '@/lib/admin-config';
import { AdminHeader } from '@/components/admin/require-admin';

export default function PostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [published, setPublished] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const initializedRef = useRef(false);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin-post', id],
    queryFn: () => fetchPostById(id as string),
    enabled: !isNew,
  });

  useEffect(() => {
    initializedRef.current = false;
    setShowPreview(false);
  }, [id]);

  useEffect(() => {
    if (isNew) {
      if (!initializedRef.current) initializedRef.current = true;
      return;
    }
    if (existing && !initializedRef.current) {
      initializedRef.current = true;
      setTitle(existing.title);
      setSlug(existing.slug);
      setSlugTouched(true);
      setContent(existing.content || '');
      setExcerpt(existing.excerpt || '');
      setFeaturedImage(existing.featured_image || '');
      setMetaDescription(existing.meta_description || '');
      setPublished(existing.status === 'published');
    }
  }, [existing, isNew]);

  const mutation = useMutation({
    mutationFn: () => {
      const trimmedTitle = title.trim();
      const trimmedSlug = slug.trim() || slugify(trimmedTitle);
      const excerptText =
        excerpt.trim() || stripMarkdown(content).slice(0, 160);
      const metaText =
        metaDescription.trim() || stripMarkdown(content).slice(0, 160);

      const input: BlogPostInput = {
        title: trimmedTitle,
        slug: trimmedSlug,
        content,
        excerpt: excerptText,
        featured_image: featuredImage.trim(),
        meta_description: metaText,
        status: published ? 'published' : 'draft',
        published_at:
          published
            ? (existing?.published_at ?? new Date().toISOString())
            : null,
      };
      return isNew ? createPost(input) : updatePost(id, input);
    },
    onSuccess: () => {
      toast({
        title: published ? 'Post published' : 'Post saved as draft',
        description: published
          ? 'It is now live at /blog/' + slug.trim()
          : 'You can publish it from settings later.',
      });
      navigate(ADMIN_DASHBOARD_PATH);
    },
    onError: (err) => {
      toast({
        title: 'Could not save post',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <AdminHeader label="blog editor" onLogout={() => void signOut()} />
      <div className="cleaner-grid min-h-[calc(100dvh-73px)]">
        <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link href={ADMIN_DASHBOARD_PATH}>
                <Button type="button" variant="ghost" size="icon" className="text-[#9eabad]">
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-semibold tracking-[-0.02em]">
                    {isNew ? 'New post' : 'Edit post'}
                  </h1>
                  {!isNew && (
                    <Badge variant={published ? 'secondary' : 'outline'} className={published ? 'bg-[#62e4dc]/15 text-[#62e4dc]' : 'text-[#9eabad]'}>
                      {published ? 'Published' : 'Draft'}
                    </Badge>
                  )}
                </div>
                {!isNew && existing?.published_at && (
                  <p className="font-mono text-[11px] text-[#718082]">
                    Published {formatDate(existing.published_at)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      toast({ title: 'AI Draft Assist is coming soon' })
                    }
                  >
                    <Sparkles className="size-4 text-[#f0bd5b]" /> AI Draft Assist
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Coming soon</TooltipContent>
              </Tooltip>
              <Button type="button" onClick={handleSave} disabled={mutation.isPending}>
                {mutation.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
                Save post
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="size-5 text-[#f0bd5b]" />
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="border-[#293337] bg-[#151b1e]/75">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[15px] text-[#f5f1e8]">Details</CardTitle>
                  <CardDescription className="text-xs text-[#9eabad]">
                    Title and slug define the post URL: /blog/&lt;slug&gt;
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="post-title" className="text-xs text-[#9eabad]">Title</Label>
                    <Input
                      id="post-title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!slugTouched) setSlug(slugify(e.target.value));
                      }}
                      className="border-[#36454a] bg-[#101517] text-[#f5f1e8]"
                      placeholder="How to make images load faster"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="post-slug" className="text-xs text-[#9eabad]">Slug</Label>
                    <Input
                      id="post-slug"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setSlugTouched(true);
                      }}
                      className="border-[#36454a] bg-[#101517] font-mono text-[#f5f1e8]"
                      placeholder="how-to-make-images-load-faster"
                    />
                    <p className="text-[11px] text-[#718082]">
                      Auto-generated from the title. Only use lowercase letters, numbers and dashes.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="post-image" className="text-xs text-[#9eabad]">Featured image URL</Label>
                    <Input
                      id="post-image"
                      type="url"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      className="border-[#36454a] bg-[#101517] text-[#f5f1e8]"
                      placeholder="https://… (optional)"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#293337] bg-[#151b1e]/75">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[15px] text-[#f5f1e8]">Content</CardTitle>
                      <CardDescription className="text-xs text-[#9eabad]">
                        Write in Markdown. Headings, bold, links, images and lists are supported.
                      </CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview((v) => !v)}
                      className="text-[#9eabad]"
                    >
                      {showPreview ? <PencilLine className="size-3.5" /> : <Eye className="size-3.5" />}
                      {showPreview ? 'Write' : 'Preview'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showPreview ? (
                    <div className="min-h-[320px] rounded-xl border border-[#36454a] bg-[#101517] p-5">
                      <article className="prose prose-invert max-w-none prose-headings:text-[#f5f1e8] prose-p:text-[#c6cfca] prose-strong:text-[#f5f1e8] prose-a:text-[#62e4dc] prose-code:text-[#f0bd5b] prose-blockquote:text-[#9eabad] prose-pre:border prose-pre:border-[#36454a] prose-pre:bg-[#151b1e]">
                        {content.trim() ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        ) : (
                          <p className="text-[#718082]">Nothing to preview yet.</p>
                        )}
                      </article>
                    </div>
                  ) : (
                    <Textarea
                      id="post-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={14}
                      className="min-h-[320px] border-[#36454a] bg-[#101517] font-mono text-sm leading-6 text-[#f5f1e8]"
                      placeholder={"## Introduction\n\nStart writing your post in Markdown…"}
                    />
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-[#293337] bg-[#151b1e]/75">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[15px] text-[#f5f1e8]">Excerpt & SEO</CardTitle>
                    <CardDescription className="text-xs text-[#9eabad]">
                      Shown on /blog and in search results. Auto-filled from content if left empty.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="post-excerpt" className="text-xs text-[#9eabad]">Excerpt</Label>
                      <Textarea
                        id="post-excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={3}
                        className="border-[#36454a] bg-[#101517] text-[#f5f1e8]"
                        placeholder="A one-to-two sentence summary of the post."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="post-meta" className="text-xs text-[#9eabad]">Meta description</Label>
                      <Textarea
                        id="post-meta"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        rows={2}
                        maxLength={160}
                        className="border-[#36454a] bg-[#101517] text-[#f5f1e8]"
                        placeholder="Used for the <meta name='description'> tag (max 160 chars)."
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#293337] bg-[#151b1e]/75">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-[15px] text-[#f5f1e8]">Publishing</CardTitle>
                    <CardDescription className="text-xs text-[#9eabad]">
                      Drafts are only visible to you. Published posts appear on the public blog.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between rounded-xl border border-[#293337] bg-[#101517] px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#f5f1e8]">Published</p>
                        <p className="text-[11px] text-[#718082]">
                          Visible at /blog/{slug || 'your-slug'}
                        </p>
                      </div>
                      <Switch
                        checked={published}
                        onCheckedChange={setPublished}
                        aria-label="Toggle published"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full text-[#9eabad]"
                      onClick={() =>
                        toast({ title: 'AI Draft Assist is coming soon' })
                      }
                    >
                      <Sparkles className="size-4 text-[#f0bd5b]" /> Draft with AI (coming soon)
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}