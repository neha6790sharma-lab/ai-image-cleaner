import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  Plus,
  PenLine,
  Trash2,
  Save,
  FileText,
  Pill,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
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
  formatDate,
  signOut,
  type BlogPost,
} from '@/lib/blog-data';
import { AdminHeader } from '@/components/admin/require-admin';

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

function BlogPostsSection() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: fetchAllPosts,
  });

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

  const list = posts ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-[#f5f1e8]">Blog posts</h2>
          <p className="text-xs text-[#9eabad]">{list.length} post{list.length === 1 ? '' : 's'} · drafts are only visible to you</p>
        </div>
        <Link href={ADMIN_POST_NEW_PATH}>
          <Button type="button" size="sm">
            <Plus className="size-4" /> New post
          </Button>
        </Link>
      </div>

      {list.length === 0 ? (
        <Empty className="border-[#293337] bg-[#151b1e]/40">
          <EmptyMedia variant="icon" className="text-[#f0bd5b]"><FileText className="size-5" /></EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-[#f5f1e8]">No posts yet</EmptyTitle>
            <EmptyDescription className="text-[#9eabad]">
              Create your first post from the <span className="text-[#62e4dc]">New post</span> button above.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card className="overflow-hidden border-[#293337] bg-[#151b1e]/75">
          <Table>
            <TableHeader>
              <TableRow className="border-[#293337] hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider text-[#718082]">Title</TableHead>
                <TableHead className="hidden text-[11px] uppercase tracking-wider text-[#718082] md:table-cell">Status</TableHead>
                <TableHead className="hidden text-[11px] uppercase tracking-wider text-[#718082] lg:table-cell">Published</TableHead>
                <TableHead className="text-right text-[11px] uppercase tracking-wider text-[#718082]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((post) => (
                <TableRow key={post.id} className="border-[#293337]">
                  <TableCell>
                    <p className="max-w-[280px] truncate text-sm font-medium text-[#f5f1e8]">{post.title}</p>
                    <p className="max-w-[280px] truncate font-mono text-[11px] text-[#718082]">/{post.slug}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell"><PostStatusBadge status={post.status} /></TableCell>
                  <TableCell className="hidden text-xs text-[#9eabad] lg:table-cell">
                    {post.status === 'published' ? formatDate(post.published_at) : '—'}
                  </TableCell>
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
        </Card>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <AdminHeader label="dashboard" onLogout={() => void signOut()} />
      <div className="cleaner-grid min-h-[calc(100dvh-73px)]">
        <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="w-full border border-[#293337] bg-[#151b1e] sm:w-auto">
              <TabsTrigger value="settings" className="data-[state=active]:bg-[#f0bd5b]/15 data-[state=active]:text-[#f0bd5b]">
                <Pill className="mr-1.5 h-3.5 w-3.5" /> Site settings
              </TabsTrigger>
              <TabsTrigger value="posts" className="data-[state=active]:bg-[#62e4dc]/15 data-[state=active]:text-[#62e4dc]">
                <FileText className="mr-1.5 h-3.5 w-3.5" /> Blog posts
              </TabsTrigger>
            </TabsList>
            <TabsContent value="settings" className="pt-5">
              <SiteSettingsSection />
            </TabsContent>
            <TabsContent value="posts" className="pt-5">
              <BlogPostsSection />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}