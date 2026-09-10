import { getSupabase } from '@/lib/supabase';

export type PostStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  meta_description: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogPostInput = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  meta_description: string;
  status: PostStatus;
  published_at: string | null;
};

export const SITE_SETTING_KEYS = {
  homepageTitle: 'homepage_title',
  homepageTagline: 'homepage_tagline',
} as const;

export const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  homepage_title: 'Make your image |just right.|',
  homepage_tagline:
    'A small set of useful image tools for the moments when "good enough" is not. Quick edits, kept close.',
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>#-]/g, ' ')
    .replace(/--+/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function humanError(error: { message?: string } | null): string | null {
  if (!error?.message) return 'Something went wrong. Please try again.';
  const m = error.message;
  if (/invalid login credentials/i.test(m)) return 'Wrong email or password.';
  if (/rate limit/i.test(m)) return 'Too many attempts - slow down and try again in a minute.';
  if (/row-level security|new row violates|permission denied|insufficient/i.test(m))
    return 'You do not have permission to do that (make sure you are signed in as an admin).';
  return m;
}

/* ---------------------------------- Auth ---------------------------------- */

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw new Error(humanError(error) ?? 'Unable to sign in.');
}

export async function signOut(): Promise<void> {
  await getSupabase().auth.signOut();
}

/* ------------------------------ Site settings ----------------------------- */

export async function fetchSiteSettings(): Promise<Record<string, string>> {
  try {
    const { data, error } = await getSupabase()
      .from('site_settings')
      .select('key, value');
    if (error) {
      if (/row-level security|new row violates|permission denied/i.test(error.message))
        return { ...DEFAULT_SITE_SETTINGS };
      throw error;
    }
    const settings: Record<string, string> = {};
    for (const row of data ?? []) {
      settings[row.key as string] = row.value as string;
    }
    return { ...DEFAULT_SITE_SETTINGS, ...settings };
  } catch {
    return { ...DEFAULT_SITE_SETTINGS };
  }
}

export async function saveSiteSettings(values: Record<string, string>): Promise<void> {
  const rows = Object.entries(values).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await getSupabase().from('site_settings').upsert(rows);
  if (error) throw new Error(humanError(error) ?? 'Unable to save settings.');
}

/* -------------------------------- Blog posts ------------------------------ */

export async function fetchAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await getSupabase()
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(humanError(error) ?? 'Unable to load posts.');
  return (data ?? []) as BlogPost[];
}

export async function fetchPublishedPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await getSupabase()
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false });
    if (error) throw error;
    return (data ?? []) as BlogPost[];
  } catch {
    return [];
  }
}

export async function fetchPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await getSupabase()
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(humanError(error) ?? 'Unable to load post.');
  return (data as BlogPost) ?? null;
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await getSupabase()
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return (data as BlogPost) ?? null;
  } catch {
    return null;
  }
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const { data, error } = await getSupabase()
    .from('blog_posts')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(humanError(error) ?? 'Unable to create post.');
  return data as BlogPost;
}

export async function updatePost(id: string, input: Partial<BlogPostInput>): Promise<BlogPost> {
  const { data, error } = await getSupabase()
    .from('blog_posts')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(humanError(error) ?? 'Unable to update post.');
  return data as BlogPost;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await getSupabase().from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(humanError(error) ?? 'Unable to delete post.');
}

export function formatDate(value: string | null): string {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}