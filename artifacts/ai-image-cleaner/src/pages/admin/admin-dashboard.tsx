import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Plus,
  PenLine,
  Trash2,
  Save,
  FileText,
  Pill,
  LayoutDashboard,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { useToast } from '@/hooks/use-toast';
import {
  ADMIN_POST_NEW_PATH,
  ADMIN_POST_EDIT_PATH,
} from '@/lib/admin-config';
import {
  fetchSiteSettings,
  fetchAllPosts,
  saveSiteSettings,
  deletePost,
  updatePost,
  signOut,
  BLOG_CATEGORIES,
  type BlogPost,
} from '@/lib/blog-data';
import { AdminHeader } from '@/components/admin/require-admin';

type AdminSection = 'dashboard' | 'blogs' | 'settings';

const PAGE_SIZE = 6;

function SiteSettingsSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: fetchSiteSettings,
  });
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setTitle(settings.homepage_title ?? '');
      setTagline(settings.homepage_tagline ?? '');
    }
  }, [settings]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  const mutation = useMutation({
    mutationFn: () =>
      saveSiteSettings({
        homepage_title: title,
        homepage_tagline: tagline,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      setSaved(true);
      toast({ title: 'Settings saved', description: 'The live site is now showing these values.' });
    },
    onError: (err) => {
      toast({
        title: 'Could not save settings',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-5 text-[#f0bd5b]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-[#293337] bg-[#151b1e]/75">
        <CardHeader>
          <CardTitle className="text-[15px] text-[#f5f1e8]">Homepage content</CardTitle>
          <CardDescription className="text-xs text-[#9eabad]">
            Saved here, shown on the live site immediately - no code changes needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="setting-title" className="text-xs text-[#9eabad]">Homepage title</Label>
            <Input
              id="setting-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-[#36454a] bg-[#101517] text-[#f5f1e8]"
              placeholder="Make your image just right."
            />
            <p className="text-[11px] text-[#718082]">
              Wrap the words shown in gold in |pipes|, e.g. Make your image |just right.|
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="setting-tagline" className="text-xs text-[#9eabad]">Homepage tagline</Label>
            <Textarea
              id="setting-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              rows={3}
              className="border-[#36454a] bg-[#101517] text-[#f5f1e8]"
              placeholder="A short description shown under the title."
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
              Save settings
            </Button>
            {saved && (
              <span className="text-xs font-medium text-[#62e4dc]">
                Saved. Live now.
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PostStatusBadge({ status }: { status: BlogPost['status'] }) {
  return status === 'published' ? (
    <Badge variant="secondary" className="bg-[#62e4dc]/15 text-[#62e4dc]">
      Published
    </Badge>
  ) : (
    <Badge variant="outline" className="text-[#9eabad]">Draft</Badge>
  );
}

function PublishToggle({ post }: { post: BlogPost }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (publish: boolean) =>
      updatePost(post.id, {
        status: publish ? 'published' : 'draft',
        published_at: publish ? (post.published_at ?? new Date().toISOString()) : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-posts'] });
      toast({ title: post.status === 'published' ? 'Post unpublished' : 'Post published' });
    },
    onError: (err) => {
      toast({
        title: 'Could not update post',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={post.status === 'published'}
        onCheckedChange={(checked) => mutation.mutate(checked)}
        disabled={mutation.isPending}
        aria-label="Toggle published"
      />
      <span className="text-xs text-[#718082]">{post.status === 'published' ? 'On' : 'Off'}</span>
    </div>
  );
}

function PaginationBar({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        {pages.map((number) => (
          <PaginationItem key={number}>
            <PaginationLink
              href="#"
              isActive={number === page}
              onClick={(e) => {
                e.preventDefault();
                onPage(number);
              }}
              className={number === page ? 'border-[#f0bd5b]/40 text-[#f0bd5b]' : 'text-[#9eabad]'}
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}

function BlogPostsSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: fetchAllPosts,
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const list = posts ?? [];
    return list.filter((post) => {
      if (category !== 'all' && post.category !== category) return false;
      if (!normalized) return true;
      return (
        post.title.toLowerCase().includes(normalized) ||
        post.slug.toLowerCase().includes(normalized) ||
        post.excerpt.toLowerCase().includes(normalized)
      );
    });
  }, [posts, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagePosts = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const post of posts ?? []) {
      if (post.category) seen.add(post.category);
    }
    for (const cat of BLOG_CATEGORIES) seen.add(cat);
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['published-posts'] });
      toast({ title: 'Post deleted' });
    },
    onError: (err) => {
      toast({
        title: 'Could not delete post',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-5 text-[#f0bd5b]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-[#f5f1e8]">Blog posts</h2>
          <p className="text-xs text-[#9eabad]">{filtered.length} post{filtered.length === 1 ? '' : 's'} · drafts are only visible to you</p>
        </div>
        <Link href={ADMIN_POST_NEW_PATH}>
          <Button type="button" size="sm">
            <Plus className="size-4" /> New
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718082]" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search posts…"
            className="border-[#36454a] bg-[#101517] pl-9 text-[#f5f1e8]"
          />
        </div>
        <div className="sm:w-48">
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="border-[#36454a] bg-[#101517] text-[#f5f1e8]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="border-[#293337] bg-[#151b1e] text-[#f5f1e8]">
              <SelectItem value="all" className="focus:bg-[#f0bd5b]/15 focus:text-[#f0bd5b]">
                All categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="focus:bg-[#f0bd5b]/15 focus:text-[#f0bd5b]">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Empty className="border-[#293337] bg-[#151b1e]/40">
          <EmptyMedia variant="icon" className="text-[#f0bd5b]"><FileText className="size-5" /></EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-[#f5f1e8]">{search || category !== 'all' ? 'No matching posts' : 'No posts yet'}</EmptyTitle>
            <EmptyDescription className="text-[#9eabad]">
              {search || category !== 'all'
                ? 'Try a different search or category.'
                : 'Create your first post from the New button above.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card className="overflow-hidden border-[#293337] bg-[#151b1e]/75">
          <Table>
            <TableHeader>
              <TableRow className="border-[#293337] hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider text-[#718082]">Title</TableHead>
                <TableHead className="hidden text-[11px] uppercase tracking-wider text-[#718082] md:table-cell">Category</TableHead>
                <TableHead className="hidden text-[11px] uppercase tracking-wider text-[#718082] lg:table-cell">Status</TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-[#718082]">Publish</TableHead>
                <TableHead className="text-right text-[11px] uppercase tracking-wider text-[#718082]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagePosts.map((post) => (
                <TableRow key={post.id} className="border-[#293337]">
                  <TableCell>
                    <p className="max-w-[240px] truncate text-sm font-medium text-[#f5f1e8]">{post.title}</p>
                    <p className="max-w-[240px] truncate font-mono text-[11px] text-[#718082]">/{post.slug}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="border-[#293337] text-[#9eabad]">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell"><PostStatusBadge status={post.status} /></TableCell>
                  <TableCell><PublishToggle post={post} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`${ADMIN_POST_EDIT_PATH.replace(':id', post.id)}`}>
                        <Button type="button" variant="outline" size="sm" className="text-[#9eabad]">
                          <PenLine className="size-3.5" /> Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="text-[#9eabad] hover:text-[#f0a497]">
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-[#293337] bg-[#151b1e] text-[#f5f1e8]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete “{post.title}”?</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#9eabad]">
                              This permanently removes the post and its URL. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-[#36454a] bg-transparent text-[#f5f1e8]">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-[#c24545] text-white hover:brightness-110"
                              onClick={(e) => {
                                e.preventDefault();
                                deleteMutation.mutate(post.id);
                              }}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationBar page={safePage} totalPages={totalPages} onPage={setPage} />
        </Card>
      )}
    </div>
  );
}

function DashboardSection({ onNavigate }: { onNavigate: (section: AdminSection) => void }) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: fetchAllPosts,
  });

  const total = posts?.length ?? 0;
  const published = posts?.filter((p) => p.status === 'published').length ?? 0;
  const drafts = total - published;

  const actions = [
    {
      label: 'Create new',
      description: 'Write and publish a brand new blog post.',
      icon: Plus,
      accent: 'bg-[#f0bd5b]/12 text-[#f0bd5b] border-[#f0bd5b]/25',
      onClick: () => onNavigate('blogs'),
      href: ADMIN_POST_NEW_PATH,
    },
    {
      label: 'Edit posts',
      description: 'Update, toggle or organise existing posts.',
      icon: PenLine,
      accent: 'bg-[#62e4dc]/12 text-[#62e4dc] border-[#62e4dc]/25',
      onClick: () => onNavigate('blogs'),
      href: null,
    },
    {
      label: 'Settings',
      description: 'Change the homepage title and tagline.',
      icon: Pill,
      accent: 'bg-[#b79cff]/12 text-[#b79cff] border-[#b79cff]/25',
      onClick: () => onNavigate('settings'),
      href: null,
    },
  ];

  const stats = [
    { label: 'Total posts', value: total, color: 'text-[#f5f1e8]' },
    { label: 'Published', value: published, color: 'text-[#62e4dc]' },
    { label: 'Drafts', value: drafts, color: 'text-[#9eabad]' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[15px] font-semibold text-[#f5f1e8]">Dashboard</h2>
        <p className="text-xs text-[#9eabad]">Quick access to your most common admin tasks.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#293337] bg-[#151b1e]/50 p-4">
                <Spinner className="size-4 text-[#f0bd5b]" />
              </div>
            ))
          : stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[#293337] bg-[#151b1e]/60 p-4">
                <p className={`text-2xl font-bold tracking-[-0.03em] ${stat.color}`}>{stat.value}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[.14em] text-[#718082]">{stat.label}</p>
              </div>
            ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const inner = (
            <>
              <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border ${action.accent}`}>
                <Icon className="size-4" />
              </span>
              <h3 className="text-sm font-semibold text-[#f5f1e8]">{action.label}</h3>
              <p className="mt-1 text-xs leading-5 text-[#9eabad]">{action.description}</p>
            </>
          );
          return (
            <div key={action.label}>
              {action.href ? (
                <Link href={action.href} className="block h-full rounded-2xl border border-[#293337] bg-[#151b1e]/60 p-4 transition-colors hover:border-[#f0bd5b]/30">
                  {inner}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={action.onClick}
                  className="flex h-full w-full flex-col rounded-2xl border border-[#293337] bg-[#151b1e]/60 p-4 text-left transition-colors hover:border-[#f0bd5b]/30"
                >
                  {inner}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminSidebar({
  active,
  onSelect,
}: {
  active: AdminSection;
  onSelect: (section: AdminSection) => void;
}) {
  const items: { key: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'blogs', label: 'Blogs', icon: FileText },
    { key: 'settings', label: 'Settings', icon: Pill },
  ];

  return (
    <aside className="w-full shrink-0 lg:w-52">
      <nav className="flex gap-1 lg:flex-col" aria-label="Admin sections">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'border border-[#f0bd5b]/40 bg-[#f0bd5b]/12 text-[#f0bd5b]'
                  : 'border border-transparent text-[#9eabad] hover:bg-[#151b1e]/60 hover:text-[#f5f1e8]'
              }`}
            >
              <Icon className="size-4" />
              <span className="lg:inline">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default function AdminDashboardPage() {
  const [section, setSection] = useState<AdminSection>('dashboard');

  return (
    <div className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <AdminHeader label="dashboard" onLogout={() => void signOut()} />
      <div className="cleaner-grid min-h-[calc(100dvh-73px)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-8 lg:flex-row lg:items-start">
          <AdminSidebar active={section} onSelect={setSection} />
          <main className="min-w-0 flex-1">
            {section === 'dashboard' && <DashboardSection onNavigate={setSection} />}
            {section === 'blogs' && <BlogPostsSection />}
            {section === 'settings' && <SiteSettingsSection />}
          </main>
        </div>
      </div>
    </div>
  );
}