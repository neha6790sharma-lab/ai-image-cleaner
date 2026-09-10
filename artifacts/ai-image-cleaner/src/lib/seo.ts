export const DEFAULT_SITE_TITLE =
  'cleaner. — Free Online Image Editor: Remove Objects, Crop, Compress & More';

export const DEFAULT_SITE_DESCRIPTION =
  'cleaner. — a private image utility in your browser. Remove objects, crop, convert, compress, resize, and enhance images. No account, no cloud storage.';

function findMetaDescription(): HTMLMetaElement | null {
  return document.querySelector('meta[name="description"]');
}

export function setDocumentMeta(title: string, description: string) {
  document.title = title;
  let meta = findMetaDescription();
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
}

export function resetDocumentMeta() {
  document.title = DEFAULT_SITE_TITLE;
  const meta = findMetaDescription();
  if (meta) meta.content = DEFAULT_SITE_DESCRIPTION;
}