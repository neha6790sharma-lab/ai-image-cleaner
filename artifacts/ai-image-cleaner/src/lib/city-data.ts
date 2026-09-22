import citySlugJson from './city-slugs.json';

export type AccentKey =
  | 'gold'
  | 'cyan'
  | 'violet'
  | 'coral'
  | 'teal'
  | 'indigo';

export type HeroVariant =
  | 'spotlight'
  | 'editorial'
  | 'banner'
  | 'split'
  | 'asymmetric'
  | 'mosaic'
  | 'terminal'
  | 'magazine';

export type DecorVariant =
  | 'glow'
  | 'grid'
  | 'dots'
  | 'diagonal'
  | 'rings'
  | 'waves'
  | 'noise'
  | 'none';

export type SectionKey = 'trust' | 'about' | 'uses' | 'cta';

export type TrustStyle = 'cards' | 'strip' | 'list' | 'stack';
export type AboutStyle = 'split' | 'centered' | 'aside' | 'panel';
export type UsesStyle = 'grid' | 'list' | 'numbered' | 'pills';
export type CtaStyle = 'bar' | 'card' | 'split' | 'minimal';

export interface Accent {
  key: AccentKey;
  label: string;
  base: string;
  soft: string;
  ink: string;
  glow: string;
  tint: string;
  tint2: string;
  border: string;
  borderSoft: string;
}

export interface TrustPoint {
  title: string;
  text: string;
}

export interface UseCase {
  title: string;
  text: string;
}

export interface CityConfig {
  slug: string;
  name: string;
  accent: AccentKey;
  hero: HeroVariant;
  decor: DecorVariant;
  order: SectionKey[];
  trustStyle: TrustStyle;
  aboutStyle: AboutStyle;
  usesStyle: UsesStyle;
  ctaStyle: CtaStyle;
  eyebrow: string;
  headlineLead: string;
  headlineAccent: string;
  intro: string[];
  trust: TrustPoint[];
  about: string[];
  useCases: UseCase[];
  ctaHeading: string;
  ctaBody: string;
  closing: string;
  metaTitle: string;
  metaDescription: string;
}

export const CITY_PATH_PREFIX = 'image-editor-in';

export function cityPath(slug: string): string {
  return `/${CITY_PATH_PREFIX}-${slug}`;
}

export const ACCENTS: Record<AccentKey, Accent> = {
  gold: {
    key: 'gold',
    label: 'amber gold',
    base: '#f0bd5b',
    soft: '#f6d38f',
    ink: '#171719',
    glow: 'rgba(240, 189, 91, 0.22)',
    tint: 'rgba(240, 189, 91, 0.12)',
    tint2: 'rgba(240, 189, 91, 0.06)',
    border: 'rgba(240, 189, 91, 0.45)',
    borderSoft: 'rgba(240, 189, 91, 0.24)',
  },
  cyan: {
    key: 'cyan',
    label: 'cyan',
    base: '#62e4dc',
    soft: '#9fe9e3',
    ink: '#102021',
    glow: 'rgba(98, 228, 220, 0.2)',
    tint: 'rgba(98, 228, 220, 0.12)',
    tint2: 'rgba(98, 228, 220, 0.06)',
    border: 'rgba(98, 228, 220, 0.42)',
    borderSoft: 'rgba(98, 228, 220, 0.22)',
  },
  violet: {
    key: 'violet',
    label: 'violet',
    base: '#b79cff',
    soft: '#cdbcff',
    ink: '#171226',
    glow: 'rgba(183, 156, 255, 0.22)',
    tint: 'rgba(183, 156, 255, 0.12)',
    tint2: 'rgba(183, 156, 255, 0.06)',
    border: 'rgba(183, 156, 255, 0.44)',
    borderSoft: 'rgba(183, 156, 255, 0.24)',
  },
  coral: {
    key: 'coral',
    label: 'coral',
    base: '#f1837c',
    soft: '#f7aaa4',
    ink: '#241314',
    glow: 'rgba(241, 131, 124, 0.22)',
    tint: 'rgba(241, 131, 124, 0.12)',
    tint2: 'rgba(241, 131, 124, 0.06)',
    border: 'rgba(241, 131, 124, 0.44)',
    borderSoft: 'rgba(241, 131, 124, 0.24)',
  },
  teal: {
    key: 'teal',
    label: 'teal',
    base: '#4fd1b0',
    soft: '#8fe4cd',
    ink: '#0a201b',
    glow: 'rgba(79, 209, 176, 0.22)',
    tint: 'rgba(79, 209, 176, 0.12)',
    tint2: 'rgba(79, 209, 176, 0.06)',
    border: 'rgba(79, 209, 176, 0.44)',
    borderSoft: 'rgba(79, 209, 176, 0.24)',
  },
  indigo: {
    key: 'indigo',
    label: 'indigo',
    base: '#7ea6ff',
    soft: '#b0c6ff',
    ink: '#0d1424',
    glow: 'rgba(126, 166, 255, 0.22)',
    tint: 'rgba(126, 166, 255, 0.12)',
    tint2: 'rgba(126, 166, 255, 0.06)',
    border: 'rgba(126, 166, 255, 0.44)',
    borderSoft: 'rgba(126, 166, 255, 0.24)',
  },
};

const CITY_CONFIGS: CityConfig[] = [
  {
    slug: 'gurugram',
    name: 'Gurugram',
    accent: 'gold',
    hero: 'spotlight',
    decor: 'glow',
    order: ['trust', 'about', 'uses', 'cta'],
    trustStyle: 'cards',
    aboutStyle: 'split',
    usesStyle: 'grid',
    ctaStyle: 'bar',
    eyebrow: 'Free image editor for Gurugram',
    headlineLead: 'Image editing in Gurugram,',
    headlineAccent: 'without the upload queue.',
    intro: [
      'Gurugram moves fast. Between meetings, listings and launch days, photos need to be cropped, resized and cleaned up on the spot — not queued behind an upload bar. cleaner. opens in your browser and does the work right there on your device.',
      'Drop in a JPG, PNG or WEBP, make the edit and download it. No account form, no watermark, and no copy of your image left behind on someone else\u2019s server.',
    ],
    trust: [
      {
        title: 'Your image never leaves the tab',
        text: 'Editing happens locally in the browser. Close the tab and the file is gone — there is no cloud library holding a copy.',
      },
      {
        title: 'Free, with nothing locked',
        text: 'No trial clock, no paywalled export button and no watermark printed across your download.',
      },
      {
        title: 'No sign-up wall',
        text: 'There is no account to create or password to remember. The editor is ready the moment the page loads.',
      },
    ],
    about: [
      'cleaner. is ten focused image tools on one page. Crop, resize, convert, compress, rotate, watermark and passport sizing all run client-side. Only Remove Object and Remove Background pass their processing step to a private local service, which keeps nothing in memory.',
      'For anyone juggling marketplace listings, property photos or team profiles around a Gurugram workday, the tedious parts — squaring an image, trimming its size, stripping hidden GPS data — are exactly what this toolkit handles in a few clicks.',
    ],
    useCases: [
      {
        title: 'Marketplace and catalog photos',
        text: 'Crop to a tidy square, even out the framing and compress to a file size that uploads cleanly.',
      },
      {
        title: 'Property and listing images',
        text: 'Straighten a tilted shot, lift the brightness and brush out a stray cable or sign before publishing.',
      },
      {
        title: 'Profile and team headshots',
        text: 'Resize, adjust and export a neat profile image without opening a full design application.',
      },
    ],
    ctaHeading: 'Ready to edit your first photo?',
    ctaBody:
      'Ten tools, one upload, and everything stays on your device. Open the editor and try it with a photo of your own.',
    closing: 'No account. No cloud storage. Built to keep a Gurugram workday moving.',
    metaTitle:
      'Free Image Editor in Gurugram — Crop, Compress & Remove Objects | cleaner.',
    metaDescription:
      'A private, browser-based image editor for Gurugram. Crop, compress, convert, resize and remove objects from photos for free — no sign-up, nothing uploaded to the cloud.',
  },
  {
    slug: 'faridabad',
    name: 'Faridabad',
    accent: 'cyan',
    hero: 'editorial',
    decor: 'grid',
    order: ['about', 'trust', 'uses', 'cta'],
    trustStyle: 'strip',
    aboutStyle: 'aside',
    usesStyle: 'list',
    ctaStyle: 'card',
    eyebrow: 'The browser image toolkit for Faridabad',
    headlineLead: 'A quieter way to edit photos',
    headlineAccent: 'in Faridabad.',
    intro: [
      'From trading floors and workshops to family businesses and college desks, Faridabad runs on files that need to look right before they go out. cleaner. handles the everyday edits — crop, compress, convert, clean up — without asking you to sign up or upload anything.',
      'The whole tool works inside the browser tab you already have open. That means no app to install, no queue to wait in, and no copy of your picture sitting on a remote drive.',
    ],
    trust: [
      {
        title: 'Processing stays on your device',
        text: 'The browser does the work, so the image you open is the image only you can see. Shut the tab and it is gone.',
      },
      {
        title: 'Nothing to pay, ever',
        text: 'All ten tools are free to use, with no hidden tier and no watermark on your exports.',
      },
      {
        title: 'No login, no profile',
        text: 'You never create an account or hand over an email. Open the page and start editing.',
      },
    ],
    about: [
      'cleaner. bundles ten practical image tools into a single page that runs client-side. Cropping, format conversion, compression, rotation, text watermarks, privacy-data removal and document-photo presets all happen in your browser; the two AI tools use a private local service that stores nothing.',
      'If your day involves catalogue sheets, quotation images, form attachments or a shop\u2019s social posts, the repetitive cleanup is where this saves the most time.',
    ],
    useCases: [
      {
        title: 'Trading and catalogue sheets',
        text: 'Compress a batch of product photos and convert them to a consistent format before sending them on.',
      },
      {
        title: 'Forms and document photos',
        text: 'Produce a correctly proportioned passport, visa or PAN photo and export it as a ready JPG.',
      },
      {
        title: 'Social and shop posts',
        text: 'Crop, brighten and add a text label to a photo before it goes out to customers.',
      },
    ],
    ctaHeading: 'Open the editor and load a photo',
    ctaBody:
      'Every tool is one upload away. No account, no cloud, and nothing to install on a Faridabad desk.',
    closing: 'Free and private — right in the browser.',
    metaTitle:
      'Free Image Editor in Faridabad — Crop, Compress & Resize Online | cleaner.',
    metaDescription:
      'Edit photos in Faridabad without uploading them. Free browser tools to crop, compress, convert, resize and clean up images — no account and no cloud storage.',
  },
  {
    slug: 'panipat',
    name: 'Panipat',
    accent: 'violet',
    hero: 'banner',
    decor: 'dots',
    order: ['uses', 'about', 'trust', 'cta'],
    trustStyle: 'list',
    aboutStyle: 'centered',
    usesStyle: 'grid',
    ctaStyle: 'split',
    eyebrow: 'cleaner. for Panipat',
    headlineLead: 'Photo cleanup for Panipat,',
    headlineAccent: 'done in your browser.',
    intro: [
      'Panipat\u2019s work is hands-on — looms, workshops, showrooms and the steady flow of product and sample photos that goes with them. cleaner. is built for those quick, practical edits: crop a shot, shrink a file, swap a format, tidy the details.',
      'There is no software to install and no account to keep. The editor lives in the page, and the photos you open stay with you.',
    ],
    trust: [
      {
        title: 'Your photos stay close',
        text: 'The editor works in memory on your own machine. Nothing is uploaded, queued or archived somewhere else.',
      },
      {
        title: 'Completely free',
        text: 'No subscription, no credits and no watermark over your export — every tool is open to everyone.',
      },
      {
        title: 'Start without an account',
        text: 'No registration screen stands between you and the first edit. Just load an image and go.',
      },
    ],
    about: [
      'cleaner. is a single page of ten focused tools. Crop, resize, convert, compress, rotate, watermark, passport size and EXIF cleanup run right in the browser, and the object and background removers use a private local service that retains nothing.',
      'Whether you are shooting samples, prepping a showroom catalogue or sending a photo to a supplier, the small bottlenecks are what this toolkit removes.',
    ],
    useCases: [
      {
        title: 'Sample and showroom photos',
        text: 'Even out the crop and light, then compress a set for quick sharing without losing clarity.',
      },
      {
        title: 'Supplier and buyer files',
        text: 'Convert between JPG, PNG and WEBP so every file opens on the other end.',
      },
      {
        title: 'Document photos',
        text: 'Get a passport, visa or stamp-size image at the right proportions in a single step.',
      },
    ],
    ctaHeading: 'Try the tools on a photo of your own',
    ctaBody:
      'One upload unlocks all ten tools, and nothing leaves the browser. See how it handles your own image.',
    closing: 'Private by design, free to use, and made for everyday work.',
    metaTitle:
      'Free Image Editor in Panipat — Crop, Compress, Convert & Resize | cleaner.',
    metaDescription:
      'A free, private image editor for Panipat. Crop, compress, convert, resize and clean up photos in your browser — no account required and nothing uploaded.',
  },
  {
    slug: 'ambala',
    name: 'Ambala',
    accent: 'coral',
    hero: 'split',
    decor: 'diagonal',
    order: ['trust', 'uses', 'about', 'cta'],
    trustStyle: 'cards',
    aboutStyle: 'centered',
    usesStyle: 'numbered',
    ctaStyle: 'minimal',
    eyebrow: 'Free image tool for Ambala',
    headlineLead: 'Edit images in Ambala —',
    headlineAccent: 'free, private, no account.',
    intro: [
      'Between students filling out forms, families sorting out passport and visa photos, and small businesses keeping their product shots in order, Ambala has plenty of everyday image jobs. cleaner. makes them a browser task, not a software project.',
      'Open the page, choose a tool, and finish the edit before the kettle boils — with no upload step and no sign-up form in the way.',
    ],
    trust: [
      {
        title: 'Nothing is uploaded',
        text: 'Your image is opened and processed on your own device, so there is no server copy to worry about.',
      },
      {
        title: 'Free for every tool',
        text: 'No trial period, no locked features and no watermark added to what you download.',
      },
      {
        title: 'No account needed',
        text: 'There is nothing to register for. The tools are live as soon as the page loads.',
      },
    ],
    about: [
      'cleaner. gathers ten image tools into one browser page. Crop, resize, convert, compress, rotate, watermark, passport presets and metadata cleanup all run client-side; Remove Object and Remove Background use a private local service that stores nothing.',
      'It is the kind of toolkit that suits a form deadline, a shop listing or a student project equally well — quick, focused and free.',
    ],
    useCases: [
      {
        title: 'Passport and visa photos',
        text: 'Crop to the official ratio and export a clean JPG for a form or an application.',
      },
      {
        title: 'Student assignments',
        text: 'Resize and compress images so a project or portal upload accepts them without fuss.',
      },
      {
        title: 'Shop and service listings',
        text: 'Brighten, crop and label a photo so it looks its best in a local listing.',
      },
    ],
    ctaHeading: 'Start editing in the browser',
    ctaBody:
      'Pick a tool, load an image and download the result. No sign-up and nothing uploaded.',
    closing: 'Free, private and ready in the tab you already have open.',
    metaTitle:
      'Free Image Editor in Ambala — Passport Photo, Crop & Compress | cleaner.',
    metaDescription:
      'Edit images in Ambala for free without uploading them. Crop, compress, resize, make passport photos and remove objects — all in your browser, no account.',
  },
  {
    slug: 'karnal',
    name: 'Karnal',
    accent: 'teal',
    hero: 'asymmetric',
    decor: 'rings',
    order: ['about', 'uses', 'trust', 'cta'],
    trustStyle: 'strip',
    aboutStyle: 'panel',
    usesStyle: 'pills',
    ctaStyle: 'card',
    eyebrow: 'cleaner. for Karnal',
    headlineLead: 'Everyday image editing',
    headlineAccent: 'for Karnal.',
    intro: [
      'A teacher preparing slides, a grower photographing a crop, a shop owner updating a catalogue — the image work in Karnal is varied, practical and constant. cleaner. keeps that work simple: load a photo and fix it in the browser.',
      'No install, no login, no upload bar. The tools are already there when the page opens, and your files stay on your side of the screen.',
    ],
    trust: [
      {
        title: 'Kept on your device',
        text: 'The editing happens locally, so your photo is not copied to any cloud library or history feed.',
      },
      {
        title: 'Always free to use',
        text: 'Every tool is open, with no credit system and no watermark stamped across your export.',
      },
      {
        title: 'No sign-up required',
        text: 'Forget registration. There is no account to make and no email to hand over.',
      },
    ],
    about: [
      'cleaner. is one page with ten image tools. Cropping, converting, compressing, rotating, watermarking, resizing and privacy cleanup are processed client-side, while the object and background removers run through a private local service that keeps nothing.',
      'It is designed for the ordinary requests — a photo that needs trimming, a file that is too heavy to send, a document photo at the wrong proportions.',
    ],
    useCases: [
      {
        title: 'Crop and straighten',
        text: 'Fix a tilted or cluttered photo and frame the part that actually matters.',
      },
      {
        title: 'Shrink a heavy file',
        text: 'Compress a photo down to a size that sends easily over messaging or email.',
      },
      {
        title: 'Adjust before sharing',
        text: 'Tune brightness and contrast, or add a simple text caption to a finished image.',
      },
    ],
    ctaHeading: 'Try a tool with your own photo',
    ctaBody:
      'All ten editors are free and run in the browser. Load an image and see the result in seconds.',
    closing: 'Free, private and made for everyday photos.',
    metaTitle:
      'Free Image Editor in Karnal — Crop, Compress & Resize Photos | cleaner.',
    metaDescription:
      'A free browser image editor for Karnal. Crop, compress, resize, convert and clean up photos privately — no account, no cloud storage, no watermark.',
  },
  {
    slug: 'kurukshetra',
    name: 'Kurukshetra',
    accent: 'indigo',
    hero: 'mosaic',
    decor: 'waves',
    order: ['uses', 'trust', 'about', 'cta'],
    trustStyle: 'stack',
    aboutStyle: 'split',
    usesStyle: 'list',
    ctaStyle: 'bar',
    eyebrow: 'The browser image toolkit for Kurukshetra',
    headlineLead: 'Clean up photos in Kurukshetra',
    headlineAccent: 'without installing an app.',
    intro: [
      'Whether it is a student finishing a project, a family putting together a photo for an application, or a visitor organising pictures from a trip, Kurukshetra has a steady supply of small image jobs. cleaner. turns them into a few clicks in the browser.',
      'Nothing needs to be installed and nothing needs to be uploaded. The page simply gives you the tools and keeps your image private.',
    ],
    trust: [
      {
        title: 'Private by default',
        text: 'Images are handled in your browser, not sent to a server for processing. There is no remote copy.',
      },
      {
        title: 'Free with no catch',
        text: 'No charge, no trial and no watermark on your downloads — the tools are simply free.',
      },
      {
        title: 'No account to create',
        text: 'Skip the sign-up entirely. Open the page and load a picture to begin.',
      },
    ],
    about: [
      'cleaner. brings ten image editors together on one page. Crop, resize, convert, compress, rotate, watermark, passport presets and EXIF removal all run client-side, while the object and background tools use a private local service that retains nothing.',
      'It suits the small, frequent edits — a photo that needs a tighter crop, a file that needs to be lighter, a document image that needs the right proportions.',
    ],
    useCases: [
      {
        title: 'Project and study images',
        text: 'Crop, resize and compress figures so they upload cleanly to a report or portal.',
      },
      {
        title: 'Application photos',
        text: 'Create a correctly sized passport or visa photo and export it as a ready file.',
      },
      {
        title: 'Travel and memory photos',
        text: 'Remove a distracting object or an unwanted background from a favourite shot.',
      },
    ],
    ctaHeading: 'Open the editor and try it',
    ctaBody:
      'Ten free tools, one browser tab and nothing leaving your device. Start with any photo.',
    closing: 'Free, private and right in the browser.',
    metaTitle:
      'Free Image Editor in Kurukshetra — Crop, Compress & Remove Background | cleaner.',
    metaDescription:
      'Edit photos in Kurukshetra without uploading them. Free browser tools to crop, compress, resize, remove backgrounds and clean up images — no account needed.',
  },
  {
    slug: 'kaithal',
    name: 'Kaithal',
    accent: 'gold',
    hero: 'terminal',
    decor: 'noise',
    order: ['trust', 'about', 'uses', 'cta'],
    trustStyle: 'list',
    aboutStyle: 'aside',
    usesStyle: 'grid',
    ctaStyle: 'split',
    eyebrow: 'cleaner. for Kaithal',
    headlineLead: 'Image tools for Kaithal,',
    headlineAccent: 'right in the browser.',
    intro: [
      'Kaithal\u2019s image jobs are the everyday kind: a shop listing that needs a cleaner photo, a form that needs the right size, a picture that is too large to send. cleaner. handles all of it without a download, an install or an account.',
      'Load an image and the ten tools are ready. Your photo is processed on your own device and never sent to a cloud library.',
    ],
    trust: [
      {
        title: 'Runs on your machine',
        text: 'The edit is done in your browser tab, so your image never travels to someone else\u2019s server.',
      },
      {
        title: 'No cost at all',
        text: 'Every tool is free, with no premium gate and no watermark over the result.',
      },
      {
        title: 'No registration',
        text: 'There is no account, no email and no password — just the tools, ready to use.',
      },
    ],
    about: [
      'cleaner. is a compact suite of ten image tools on a single page. Crop, convert, compress, rotate, resize, watermark, passport sizing and metadata cleanup happen client-side, and the two AI removers use a private local service that stores nothing.',
      'It is built for the ordinary tasks that come up again and again, so they take seconds rather than a trip to a desktop application.',
    ],
    useCases: [
      {
        title: 'Listing and catalogue photos',
        text: 'Crop to a consistent frame and compress so every image loads quickly.',
      },
      {
        title: 'Documents and forms',
        text: 'Get passport, visa or stamp-size photos at the exact proportions required.',
      },
      {
        title: 'Quick fixes',
        text: 'Straighten, brighten or strip hidden location data before you share a picture.',
      },
    ],
    ctaHeading: 'Load a photo and start',
    ctaBody:
      'All ten tools, free and browser-based. Nothing is uploaded and no account is needed.',
    closing: 'Private, free and ready to go.',
    metaTitle:
      'Free Image Editor in Kaithal — Compress, Crop & Resize Photos | cleaner.',
    metaDescription:
      'A free, private image editor for Kaithal. Crop, compress, convert, resize and clean up images in your browser — no account, no uploads, no watermark.',
  },
  {
    slug: 'hisar',
    name: 'Hisar',
    accent: 'cyan',
    hero: 'magazine',
    decor: 'glow',
    order: ['about', 'trust', 'uses', 'cta'],
    trustStyle: 'cards',
    aboutStyle: 'centered',
    usesStyle: 'numbered',
    ctaStyle: 'minimal',
    eyebrow: 'Free image editor for Hisar',
    headlineLead: 'Image editing for Hisar —',
    headlineAccent: 'free and private.',
    intro: [
      'Hisar has a busy student and research crowd, alongside businesses and families who all need photos to fit a specific size, format or limit. cleaner. puts the tools for that in the browser, so there is nothing to install and nothing to sign up for.',
      'Open the page, load a JPG, PNG or WEBP, and finish the edit on your own device. The image is never uploaded and the download carries no watermark.',
    ],
    trust: [
      {
        title: 'Your file stays with you',
        text: 'Processing happens in the browser, so the only copy of your photo is the one on your own machine.',
      },
      {
        title: 'Free for everyone',
        text: 'No trial, no credits and no watermark on the export — every tool is fully open.',
      },
      {
        title: 'No account, no form',
        text: 'There is nothing to register. The editor is usable the second it loads.',
      },
    ],
    about: [
      'cleaner. is ten image tools gathered on one page. Crop, resize, convert, compress, rotate, watermark, passport presets and privacy-data removal all run client-side, while Remove Object and Remove Background use a private local service that keeps nothing.',
      'For project figures, presentation slides, shop photos or an application image, it covers the small edits that would otherwise stall a task.',
    ],
    useCases: [
      {
        title: 'Reports and presentations',
        text: 'Resize and compress figures so they fit a slide or a portal\u2019s upload limit.',
      },
      {
        title: 'Study and project images',
        text: 'Crop to a clean frame and convert to a format that opens everywhere.',
      },
      {
        title: 'Shop and service photos',
        text: 'Brighten, label and tidy a picture before it goes into a listing.',
      },
    ],
    ctaHeading: 'Try the tools on your own image',
    ctaBody:
      'One page, ten editors, no account and no cloud. Load a photo and see how fast it is.',
    closing: 'Free, private and built for everyday editing.',
    metaTitle:
      'Free Image Editor in Hisar — Crop, Compress & Convert Photos Online | cleaner.',
    metaDescription:
      'Edit images in Hisar for free and privately. Crop, compress, convert, resize and clean up photos in your browser — no sign-up, no uploads, no watermark.',
  },
  {
    slug: 'rohtak',
    name: 'Rohtak',
    accent: 'violet',
    hero: 'spotlight',
    decor: 'dots',
    order: ['uses', 'about', 'trust', 'cta'],
    trustStyle: 'strip',
    aboutStyle: 'split',
    usesStyle: 'pills',
    ctaStyle: 'card',
    eyebrow: 'cleaner. for Rohtak',
    headlineLead: 'Photo editing in Rohtak,',
    headlineAccent: 'no account required.',
    intro: [
      'Rohtak keeps a brisk mix of coaching classes, clinics, shops and property listings, and each of them leans on photos that need to look right. cleaner. handles the routine edits in the browser, so a quick fix never turns into a software errand.',
      'There is no upload step and no registration. Load an image, use the tool and download the result — all on your own device.',
    ],
    trust: [
      {
        title: 'Stays in the browser',
        text: 'Your image is edited locally and never posted to a cloud library or history feed.',
      },
      {
        title: 'Free with no strings',
        text: 'No subscription, no credit pack and no watermark across your download.',
      },
      {
        title: 'No sign-up screen',
        text: 'There is no account to create, so nothing stands between you and the first edit.',
      },
    ],
    about: [
      'cleaner. is a single page holding ten focused image tools. Crop, resize, convert, compress, rotate, watermark, passport sizing and EXIF cleanup are processed client-side; the object and background removers use a private local service that retains nothing.',
      'It is made for the quick, frequent jobs — squaring a listing photo, shrinking a file, preparing a document image — that come up across a Rohtak day.',
    ],
    useCases: [
      {
        title: 'Listing and clinic photos',
        text: 'Crop, brighten and compress images so they look sharp and load quickly.',
      },
      {
        title: 'Coaching and study material',
        text: 'Resize figures and clean up scans for notes, slides or assignments.',
      },
      {
        title: 'Document photos',
        text: 'Export a passport, visa or PAN photo at the exact proportions required.',
      },
    ],
    ctaHeading: 'Open the editor and load a photo',
    ctaBody:
      'Ten free tools in the browser, no account and no uploads. Try it with an image of your own.',
    closing: 'Private, free and ready in your browser.',
    metaTitle:
      'Free Image Editor in Rohtak — Crop, Compress & Passport Photos | cleaner.',
    metaDescription:
      'A private browser image editor for Rohtak. Crop, compress, convert, resize and make passport photos for free — no account and nothing uploaded.',
  },
  {
    slug: 'sonipat',
    name: 'Sonipat',
    accent: 'coral',
    hero: 'editorial',
    decor: 'diagonal',
    order: ['trust', 'uses', 'about', 'cta'],
    trustStyle: 'stack',
    aboutStyle: 'panel',
    usesStyle: 'list',
    ctaStyle: 'bar',
    eyebrow: 'The browser image toolkit for Sonipat',
    headlineLead: 'Fast image edits',
    headlineAccent: 'for Sonipat.',
    intro: [
      'Sonipat sits close enough to the capital that everything moves quickly — commuters, students, factories and the shops that serve them. cleaner. keeps image editing just as quick by doing it in the browser, with no install and no account.',
      'The photo you open is processed on your own device and never uploaded. Make the edit, download it and move on.',
    ],
    trust: [
      {
        title: 'Nothing leaves your device',
        text: 'Editing runs locally in the tab, so there is no server copy and no cloud history.',
      },
      {
        title: 'Free for all ten tools',
        text: 'No trial, no locked export and no watermark added to what you download.',
      },
      {
        title: 'No account at all',
        text: 'Skip registration — the tools work the moment the page opens.',
      },
    ],
    about: [
      'cleaner. collects ten image tools on one page. Crop, resize, convert, compress, rotate, watermark, passport presets and metadata removal run client-side, while the two AI removers use a private local service that keeps nothing.',
      'It handles the small, constant jobs: an image that is the wrong size, a file that is too heavy, a photo that needs a cleaner crop before it goes out.',
    ],
    useCases: [
      {
        title: 'Job and form photos',
        text: 'Resize and clean up a photo for an application, ID or portal upload.',
      },
      {
        title: 'Industrial and shop listings',
        text: 'Crop to a consistent frame and compress for a faster-loading catalogue.',
      },
      {
        title: 'Commuter quick fixes',
        text: 'Trim, straighten and convert an image in the time it takes to send a message.',
      },
    ],
    ctaHeading: 'Start with a photo of your own',
    ctaBody:
      'All ten tools are free and run in the browser. No account, no cloud, nothing to install.',
    closing: 'Fast, free and private — right in the browser.',
    metaTitle:
      'Free Image Editor in Sonipat — Crop, Compress & Convert Photos | cleaner.',
    metaDescription:
      'Edit photos in Sonipat for free without uploading them. Crop, compress, convert, resize and clean up images in your browser — no account required.',
  },
  {
    slug: 'panchkula',
    name: 'Panchkula',
    accent: 'teal',
    hero: 'banner',
    decor: 'rings',
    order: ['about', 'uses', 'trust', 'cta'],
    trustStyle: 'cards',
    aboutStyle: 'aside',
    usesStyle: 'grid',
    ctaStyle: 'split',
    eyebrow: 'cleaner. for Panchkula',
    headlineLead: 'A private image editor',
    headlineAccent: 'for Panchkula.',
    intro: [
      'Panchkula\u2019s residents tend to know exactly what they want from a tool: it should be quick, tidy and not ask for personal details. cleaner. answers all three. It edits images in the browser, needs no account and stores nothing in the cloud.',
      'Whether it is a photograph for a form, a family picture that needs a cleaner background, or an image for a listing, the work is done on your own device.',
    ],
    trust: [
      {
        title: 'Discreet by design',
        text: 'Your image is opened in the browser and never uploaded, logged or saved elsewhere.',
      },
      {
        title: 'Free to the last tool',
        text: 'No subscription, no credits and no watermark on your export — the whole suite is open.',
      },
      {
        title: 'No account required',
        text: 'There is no registration step and no email to give. The tools are simply there.',
      },
    ],
    about: [
      'cleaner. is one page with ten image tools. Cropping, resizing, converting, compressing, rotating, watermarking, passport presets and EXIF cleanup run client-side, while the object and background removers use a private local service that retains nothing.',
      'It is built for calm, everyday tasks — preparing a document photo, tidying a picture before sharing it, or trimming a file down to a sensible size.',
    ],
    useCases: [
      {
        title: 'Forms and official photos',
        text: 'Produce a correctly sized passport, visa or stamp photo as a ready JPG.',
      },
      {
        title: 'Family and event pictures',
        text: 'Remove a distraction or an unwanted background and keep the shot you like.',
      },
      {
        title: 'Listings and notices',
        text: 'Crop, brighten and compress an image so it looks clean wherever it is posted.',
      },
    ],
    ctaHeading: 'Try the editor in your browser',
    ctaBody:
      'Ten free, private tools — no account, no uploads and no watermark. Load a photo and begin.',
    closing: 'Quiet, private and free — the way a tool should be.',
    metaTitle:
      'Free Image Editor in Panchkula — Crop, Compress & Remove Objects | cleaner.',
    metaDescription:
      'A private, no-account image editor for Panchkula. Crop, compress, convert, resize and remove objects from photos in your browser — nothing is uploaded.',
  },
  {
    slug: 'yamunanagar',
    name: 'Yamunanagar',
    accent: 'indigo',
    hero: 'split',
    decor: 'waves',
    order: ['uses', 'trust', 'about', 'cta'],
    trustStyle: 'list',
    aboutStyle: 'centered',
    usesStyle: 'numbered',
    ctaStyle: 'minimal',
    eyebrow: 'Free image tool for Yamunanagar',
    headlineLead: 'Edit images in Yamunanagar',
    headlineAccent: 'in seconds.',
    intro: [
      'Yamunanagar\u2019s workshops, timber and paper trades, shops and colleges all generate a steady stream of photos that need a small fix. cleaner. makes those fixes a browser task: crop, compress, convert, clean up, done.',
      'There is nothing to install and nothing to sign up for, and your image is processed on your own device rather than sent away.',
    ],
    trust: [
      {
        title: 'Your image stays local',
        text: 'The browser does the processing, so no copy of your photo ends up in a cloud library.',
      },
      {
        title: 'Free, with no watermark',
        text: 'Every tool is open and your download comes out clean — no trial, no paywall.',
      },
      {
        title: 'No sign-up needed',
        text: 'Forget accounts and passwords. The editor is ready as soon as it loads.',
      },
    ],
    about: [
      'cleaner. bundles ten image tools onto a single page. Crop, resize, convert, compress, rotate, watermark, passport sizing and privacy cleanup are handled client-side, while Remove Object and Remove Background use a private local service that keeps nothing.',
      'It fits the quick, practical jobs — a product photo for a listing, a scan that needs straightening, a file that needs to be lighter before it is sent.',
    ],
    useCases: [
      {
        title: 'Trade and factory photos',
        text: 'Crop, straighten and compress product or site photos for quick sharing.',
      },
      {
        title: 'Document and ID photos',
        text: 'Prepare a passport, visa or stamp-size image at the correct proportions.',
      },
      {
        title: 'Everyday clean-ups',
        text: 'Adjust light, remove a small object and strip hidden location data.',
      },
    ],
    ctaHeading: 'Open the editor and try a tool',
    ctaBody:
      'One upload, ten free tools and nothing leaving your browser. Start with any image.',
    closing: 'Free, private and quick — right in the browser.',
    metaTitle:
      'Free Image Editor in Yamunanagar — Crop, Compress & Resize | cleaner.',
    metaDescription:
      'Edit images in Yamunanagar for free in your browser. Crop, compress, convert, resize and remove objects from photos — no account, no cloud, no watermark.',
  },
  {
    slug: 'sirsa',
    name: 'Sirsa',
    accent: 'gold',
    hero: 'asymmetric',
    decor: 'noise',
    order: ['about', 'trust', 'uses', 'cta'],
    trustStyle: 'stack',
    aboutStyle: 'panel',
    usesStyle: 'pills',
    ctaStyle: 'card',
    eyebrow: 'cleaner. for Sirsa',
    headlineLead: 'Image cleanup for Sirsa,',
    headlineAccent: 'free in your browser.',
    intro: [
      'In Sirsa the image tasks are often practical ones — a cropped photo for a form, a listing picture that needs tidying, a family shot with something to remove. cleaner. keeps all of it in the browser, with no download and no account.',
      'Load a JPG, PNG or WEBP and the tools are ready. Your picture is processed on your own device and never uploaded.',
    ],
    trust: [
      {
        title: 'Kept on your device',
        text: 'Editing happens locally, so your image never reaches a server or a cloud history.',
      },
      {
        title: 'Free with no catch',
        text: 'No charge, no trial window and no watermark over your download.',
      },
      {
        title: 'No registration',
        text: 'There is no account to create and no email to give — just the tools.',
      },
    ],
    about: [
      'cleaner. puts ten image tools on one page. Crop, resize, convert, compress, rotate, watermark, passport presets and metadata cleanup run client-side, while the AI removers use a private local service that stores nothing.',
      'It is suited to the frequent, ordinary edits — trimming a photo, shrinking a file, preparing a document image — that otherwise need a heavier app.',
    ],
    useCases: [
      {
        title: 'Crop and prepare photos',
        text: 'Trim a cluttered shot and export a clean, correctly sized image.',
      },
      {
        title: 'Lighten heavy files',
        text: 'Compress a photo so it sends easily without looking washed out.',
      },
      {
        title: 'Document photos',
        text: 'Get passport, visa or stamp-size output at the exact ratio.',
      },
    ],
    ctaHeading: 'Try a free tool on your photo',
    ctaBody:
      'All ten editors run in the browser with no account and no cloud storage. See it for yourself.',
    closing: 'Private, free and made for everyday images.',
    metaTitle:
      'Free Image Editor in Sirsa — Crop, Compress & Passport Photos | cleaner.',
    metaDescription:
      'A free browser image editor for Sirsa. Crop, compress, convert, resize and clean up photos privately — no account needed and nothing uploaded.',
  },
  {
    slug: 'bhiwani',
    name: 'Bhiwani',
    accent: 'cyan',
    hero: 'mosaic',
    decor: 'grid',
    order: ['uses', 'about', 'trust', 'cta'],
    trustStyle: 'strip',
    aboutStyle: 'split',
    usesStyle: 'list',
    ctaStyle: 'bar',
    eyebrow: 'The browser image toolkit for Bhiwani',
    headlineLead: 'Photo tools for Bhiwani,',
    headlineAccent: 'right in the browser.',
    intro: [
      'Students, shops and families in Bhiwani all run into the same small image problems: a picture that needs the right size, a file that is too big to send, a photo that needs a tidy crop. cleaner. solves them without an install or an account.',
      'Everything happens in the browser tab, so your image stays on your device and the download comes out without a watermark.',
    ],
    trust: [
      {
        title: 'Nothing gets uploaded',
        text: 'The editor works locally in your browser, so there is no remote copy of your picture.',
      },
      {
        title: 'Free for every tool',
        text: 'No subscription, no credits and no watermark on the result — all ten tools are open.',
      },
      {
        title: 'No account needed',
        text: 'There is no sign-up step. The tools appear the moment the page loads.',
      },
    ],
    about: [
      'cleaner. gathers ten image tools on one page. Crop, resize, convert, compress, rotate, watermark, passport sizing and EXIF cleanup all run client-side; the object and background removers use a private local service that retains nothing.',
      'It covers the everyday requests — a cleaner crop, a lighter file, a document photo at the right proportions — in a few quick steps.',
    ],
    useCases: [
      {
        title: 'School and college images',
        text: 'Resize and compress photos and figures for projects and portal uploads.',
      },
      {
        title: 'Shop and stall listings',
        text: 'Crop, brighten and label a product photo before it goes online.',
      },
      {
        title: 'Everyday pictures',
        text: 'Straighten, adjust and remove small distractions from a photo.',
      },
    ],
    ctaHeading: 'Load a photo and give it a try',
    ctaBody:
      'Ten free tools, no account and no cloud storage — all in your browser. Start with any image.',
    closing: 'Free, private and ready to use.',
    metaTitle:
      'Free Image Editor in Bhiwani — Crop, Compress & Resize Photos | cleaner.',
    metaDescription:
      'Edit photos in Bhiwani for free and privately. Crop, compress, convert, resize and clean up images in your browser — no sign-up and nothing uploaded.',
  },
  {
    slug: 'rewari',
    name: 'Rewari',
    accent: 'coral',
    hero: 'terminal',
    decor: 'glow',
    order: ['trust', 'about', 'uses', 'cta'],
    trustStyle: 'cards',
    aboutStyle: 'centered',
    usesStyle: 'grid',
    ctaStyle: 'split',
    eyebrow: 'cleaner. for Rewari',
    headlineLead: 'A browser image editor',
    headlineAccent: 'for Rewari.',
    intro: [
      'Rewari\u2019s workshops, traders and students all need photos to behave — the right size, the right format, a lighter file. cleaner. hands you the tools in the browser so those jobs take seconds instead of a software detour.',
      'No install, no account, no upload. Load an image, make the change and download it straight from your own device.',
    ],
    trust: [
      {
        title: 'Processed on your device',
        text: 'Editing runs in the browser, so your image is never sent to a server or kept in a cloud library.',
      },
      {
        title: 'Free without limits',
        text: 'No trial, no locked features and no watermark stamped on your export.',
      },
      {
        title: 'No login required',
        text: 'There is no account to make. Open the page and the tools are ready.',
      },
    ],
    about: [
      'cleaner. is ten image tools on a single page. Crop, resize, convert, compress, rotate, watermark, passport presets and privacy cleanup happen client-side, while Remove Object and Remove Background use a private local service that keeps nothing.',
      'It is designed for the steady, practical edits — a product shot, a form photo, a file that needs trimming before it is shared.',
    ],
    useCases: [
      {
        title: 'Workshop and part photos',
        text: 'Crop, straighten and compress images for quotes, listings or records.',
      },
      {
        title: 'Form and ID photos',
        text: 'Export a passport, visa or stamp-size image at the required proportions.',
      },
      {
        title: 'Quick sharing fixes',
        text: 'Resize a picture and clean the metadata before you send it on.',
      },
    ],
    ctaHeading: 'Open the editor and try it',
    ctaBody:
      'All ten tools are free, browser-based and private. No account and no uploads — just load a photo.',
    closing: 'Private, free and built for quick work.',
    metaTitle:
      'Free Image Editor in Rewari — Crop, Compress & Convert Photos | cleaner.',
    metaDescription:
      'A free, private browser image editor for Rewari. Crop, compress, convert, resize and clean up photos — no account, no cloud storage, no watermark.',
  },
  {
    slug: 'jind',
    name: 'Jind',
    accent: 'teal',
    hero: 'magazine',
    decor: 'rings',
    order: ['about', 'uses', 'trust', 'cta'],
    trustStyle: 'list',
    aboutStyle: 'aside',
    usesStyle: 'numbered',
    ctaStyle: 'minimal',
    eyebrow: 'cleaner. for Jind',
    headlineLead: 'Image editing for Jind,',
    headlineAccent: 'kept private.',
    intro: [
      'From farms and mandis to schools and small shops, Jind has a constant supply of photos that need a modest fix. cleaner. keeps those fixes in the browser: crop, compress, convert, tidy up — free and without an account.',
      'The image you open is handled on your own device and never uploaded, so the only copy is the one you started with.',
    ],
    trust: [
      {
        title: 'Stays on your device',
        text: 'The browser does the work, so your photo is never copied to a server or a cloud history.',
      },
      {
        title: 'Free with no strings',
        text: 'No charges, no credits and no watermark across your download — every tool is open.',
      },
      {
        title: 'No account to make',
        text: 'Skip the sign-up entirely. The tools are live as soon as the page opens.',
      },
    ],
    about: [
      'cleaner. collects ten image tools on one page. Crop, resize, convert, compress, rotate, watermark, passport sizing and metadata cleanup run client-side, while the object and background removers use a private local service that retains nothing.',
      'It handles the frequent small jobs — a photo that needs a tighter frame, a file that needs to be lighter, a document image that needs the right shape.',
    ],
    useCases: [
      {
        title: 'Market and produce photos',
        text: 'Crop and compress images so they share quickly and look clean.',
      },
      {
        title: 'School and form photos',
        text: 'Resize a photo and prepare a correctly proportioned document image.',
      },
      {
        title: 'Family pictures',
        text: 'Brighten, crop and remove small distractions before saving.',
      },
    ],
    ctaHeading: 'Try a tool with your own photo',
    ctaBody:
      'Ten free, private editors in the browser. No account and nothing uploaded — start in seconds.',
    closing: 'Free, private and right in your browser.',
    metaTitle:
      'Free Image Editor in Jind — Crop, Compress & Resize Photos | cleaner.',
    metaDescription:
      'Edit photos in Jind for free without uploading them. Crop, compress, convert, resize and clean up images in your browser — no account and no watermark.',
  },
];

const CITY_BY_SLUG: Record<string, CityConfig> = Object.fromEntries(
  CITY_CONFIGS.map((city) => [city.slug, city]),
);

export const CITY_SLUGS: string[] = citySlugJson as string[];

export const CITIES: CityConfig[] = CITY_SLUGS.map((slug) => {
  const city = CITY_BY_SLUG[slug];
  if (!city) {
    throw new Error(`Missing city configuration for slug "${slug}".`);
  }
  return city;
});

export function getCity(slug: string): CityConfig | undefined {
  return CITY_BY_SLUG[slug];
}

export function accentFor(city: CityConfig): Accent {
  return ACCENTS[city.accent];
}
