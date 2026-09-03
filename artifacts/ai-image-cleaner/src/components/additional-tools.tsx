import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  ArrowLeft,
  Download,
  EyeOff,
  FileArchive,
  FlipHorizontal2,
  FlipVertical2,
  RotateCw,
  Scissors,
  ShieldCheck,
  SlidersHorizontal,
  Type,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionFor(mime: string) {
  return mime === 'image/jpeg' ? 'jpg' : mime.split('/')[1];
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('This image could not be read.'));
    image.src = url;
  });
}

function canvasBlob(canvas: HTMLCanvasElement, type: OutputFormat, quality = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Your browser could not export this image.'))), type, quality);
  });
}

function EditorHeader({ id, onBack, icon: Icon, accent, label }: { id: string; onBack: () => void; icon: LucideIcon; accent: 'gold' | 'cyan'; label: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <button type="button" data-testid={`button-back-tools-${id}`} onClick={onBack} className="flex items-center gap-2 text-xs font-semibold text-[#9eabad] transition-colors hover:text-[#f5f1e8]"><ArrowLeft size={15} /> Tools</button>
      <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] ${accent === 'gold' ? 'border-[#f0bd5b]/25 bg-[#f0bd5b]/[.07] text-[#e2bf77]' : 'border-[#62e4dc]/25 bg-[#62e4dc]/[.07] text-[#9fe9e3]'}`}><Icon size={13} /> {label}</div>
    </div>
  );
}

function PreviewFrame({ url, label, className = '' }: { url: string; label: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#2a3539] bg-[#121719] ${className}`}>
      <img src={url} alt={label} className="h-full w-full object-contain" />
      <span className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-[#111719]/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#bec7c4]">{label}</span>
    </div>
  );
}

function SectionButton({ active, children, testId, onClick }: { active?: boolean; children: React.ReactNode; testId?: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
        active
          ? 'border-[#f0bd5b] bg-[#29251c] text-[#e2bf77]'
          : 'border-[#334145] text-[#bcc7c4] hover:border-[#617277] hover:text-[#f5f1e8]'
      }`}
    >
      {children}
    </button>
  );
}

function RotateFlipEditor({ sourceUrl, onBack }: { sourceUrl: string; onBack: () => void }) {
  const [currentUrl, setCurrentUrl] = useState(sourceUrl);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const generatedRef = useRef('');
  const currentUrlRef = useRef(sourceUrl);

  useEffect(() => () => { if (generatedRef.current) URL.revokeObjectURL(generatedRef.current); }, []);

  const runOp = async (op: (image: HTMLImageElement) => HTMLCanvasElement) => {
    setBusy(true);
    setNotice('');
    try {
      const image = await loadImage(currentUrlRef.current);
      const canvas = op(image);
      const blob = await canvasBlob(canvas, 'image/png');
      const next = URL.createObjectURL(blob);
      if (generatedRef.current) URL.revokeObjectURL(generatedRef.current);
      generatedRef.current = next;
      currentUrlRef.current = next;
      setCurrentUrl(next);
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Rotation failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const rotate = (angle: 90 | -90) => runOp((image) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalHeight;
    canvas.height = image.naturalWidth;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable in this browser.');
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((angle * Math.PI) / 180);
    context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
    return canvas;
  });

  const flip = (mode: 'h' | 'v') => runOp((image) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable in this browser.');
    context.translate(mode === 'h' ? canvas.width : 0, mode === 'v' ? canvas.height : 0);
    context.scale(mode === 'h' ? -1 : 1, mode === 'v' ? -1 : 1);
    context.drawImage(image, 0, 0);
    return canvas;
  });

  const download = async () => {
    setBusy(true);
    setNotice('');
    try {
      const image = await loadImage(currentUrlRef.current);
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable in this browser.');
      context.drawImage(image, 0, 0);
      const blob = await canvasBlob(canvas, 'image/png');
      downloadBlob(blob, 'rotated.png');
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Download failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="cleaner-animate-in">
      <EditorHeader id="rotate" onBack={onBack} icon={RotateCw} accent="cyan" label="Rotate & flip" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <PreviewFrame url={currentUrl} label="Preview" className="min-h-[290px] lg:min-h-[470px]" />
        <aside className="flex flex-col rounded-2xl border border-[#293337] bg-[#171d20] p-5">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Transform</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" data-testid="button-rotate-left" disabled={busy} onClick={() => rotate(-90)} className="rounded-xl border border-[#334145] py-2.5 text-xs font-semibold text-[#bcc7c4] transition-colors hover:border-[#617277] hover:text-[#f5f1e8] disabled:opacity-50">⟲ Rotate Left 90°</button>
            <button type="button" data-testid="button-rotate-right" disabled={busy} onClick={() => rotate(90)} className="rounded-xl border border-[#334145] py-2.5 text-xs font-semibold text-[#bcc7c4] transition-colors hover:border-[#617277] hover:text-[#f5f1e8] disabled:opacity-50">⟳ Rotate Right 90°</button>
            <button type="button" data-testid="button-flip-horizontal" disabled={busy} onClick={() => flip('h')} className="flex items-center justify-center gap-2 rounded-xl border border-[#334145] py-2.5 text-xs font-semibold text-[#bcc7c4] transition-colors hover:border-[#617277] hover:text-[#f5f1e8] disabled:opacity-50"><FlipHorizontal2 size={14} /> Flip Horizontal</button>
            <button type="button" data-testid="button-flip-vertical" disabled={busy} onClick={() => flip('v')} className="flex items-center justify-center gap-2 rounded-xl border border-[#334145] py-2.5 text-xs font-semibold text-[#bcc7c4] transition-colors hover:border-[#617277] hover:text-[#f5f1e8] disabled:opacity-50"><FlipVertical2 size={14} /> Flip Vertical</button>
          </div>
          <div className="my-6 h-px bg-[#293337]" />
          <p className="text-[10px] leading-4 text-[#718082]">Actions stack — rotate and flip again for more.</p>
          {notice && <p data-testid="text-rotate-error" className="mt-4 text-xs leading-4 text-[#f1837c]">{notice}</p>}
          <button type="button" data-testid="button-download-rotate" disabled={busy} onClick={download} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#62e4dc] px-4 py-3 text-sm font-bold text-[#102021] transition-all hover:-translate-y-0.5 disabled:opacity-60"><Download size={16} /> Download</button>
        </aside>
      </div>
    </div>
  );
}

function AdjustEditor({ sourceUrl, onBack }: { sourceUrl: string; onBack: () => void }) {
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [preset, setPreset] = useState<'normal' | 'bw' | 'sepia'>('normal');
  const [format, setFormat] = useState<OutputFormat>('image/png');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  const filter = useMemo(() => {
    const parts = [
      `brightness(${(100 + brightness) / 100})`,
      `contrast(${(100 + contrast) / 100})`,
      `saturate(${(100 + saturation) / 100})`,
    ];
    if (preset === 'bw') parts.push('grayscale(1)');
    if (preset === 'sepia') parts.push('sepia(1)');
    return parts.join(' ');
  }, [brightness, contrast, saturation, preset]);

  const reset = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setPreset('normal');
  };

  const download = async () => {
    setBusy(true);
    setNotice('');
    try {
      const image = await loadImage(sourceUrl);
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable in this browser.');
      if (format === 'image/jpeg') {
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.filter = filter;
      context.drawImage(image, 0, 0);
      context.filter = 'none';
      const blob = await canvasBlob(canvas, format, format === 'image/jpeg' ? 0.92 : 0.9);
      downloadBlob(blob, `adjusted.${extensionFor(format)}`);
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Adjust export failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const sliders: Array<{ label: string; value: number; testId: string; onChange: (value: number) => void }> = [
    { label: 'Brightness', value: brightness, testId: 'input-brightness', onChange: setBrightness },
    { label: 'Contrast', value: contrast, testId: 'input-contrast', onChange: setContrast },
    { label: 'Saturation', value: saturation, testId: 'input-saturation', onChange: setSaturation },
  ];
  const presets: Array<{ id: 'normal' | 'bw' | 'sepia'; label: string; testId: string }> = [
    { id: 'normal', label: 'Normal', testId: 'button-filter-normal' },
    { id: 'bw', label: 'B & W', testId: 'button-filter-bw' },
    { id: 'sepia', label: 'Sepia', testId: 'button-filter-sepia' },
  ];

  return (
    <div className="cleaner-animate-in">
      <EditorHeader id="adjust" onBack={onBack} icon={SlidersHorizontal} accent="gold" label="Adjust & filters" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="rounded-2xl border border-[#293337] bg-[#121719] p-2 sm:p-3">
          <div className="relative overflow-hidden rounded-xl bg-[#0d1113]" style={{ minHeight: 470 }}>
            <img src={sourceUrl} alt="Adjustment preview" style={{ filter }} className="mx-auto block h-auto max-h-[62vh] w-full" />
          </div>
          <p className="px-2 pb-1 pt-3 text-xs text-[#8f9da0]">Preview updates live — the downloaded file matches it exactly.</p>
        </div>
        <aside className="rounded-2xl border border-[#293337] bg-[#171d20] p-5">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Filter preset</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {presets.map((item) => (
              <SectionButton key={item.id} active={preset === item.id} testId={item.testId} onClick={() => setPreset(item.id)}>{item.label}</SectionButton>
            ))}
          </div>
          <div className="my-6 h-px bg-[#293337]" />
          <div className="space-y-5">
            {sliders.map((slider) => (
              <div key={slider.label}>
                <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">{slider.label}</p><span className="font-mono text-xs text-[#e2bf77]">{slider.value > 0 ? `+${slider.value}` : slider.value}</span></div>
                <input data-testid={slider.testId} type="range" min="-100" max="100" value={slider.value} onChange={(event) => slider.onChange(Number(event.target.value))} className="mt-4 w-full accent-[#f0bd5b]" />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Format</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <SectionButton active={format === 'image/png'} testId="button-adjust-png" onClick={() => setFormat('image/png')}>PNG</SectionButton>
              <SectionButton active={format === 'image/jpeg'} testId="button-adjust-jpg" onClick={() => setFormat('image/jpeg')}>JPG</SectionButton>
            </div>
          </div>
          {notice && <p data-testid="text-adjust-error" className="mt-4 text-xs leading-4 text-[#f1837c]">{notice}</p>}
          <button type="button" data-testid="button-reset-adjust" onClick={reset} className="mt-6 w-full rounded-xl border border-[#334145] py-2.5 text-xs font-semibold text-[#bcc7c4] transition-colors hover:border-[#617277] hover:text-[#f5f1e8]">Reset to normal</button>
          <button type="button" data-testid="button-download-adjust" disabled={busy} onClick={download} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f0bd5b] px-4 py-3 text-sm font-bold text-[#171719] transition-all hover:-translate-y-0.5 disabled:opacity-60"><Download size={16} /> Download</button>
        </aside>
      </div>
    </div>
  );
}

function CompressEditor({ sourceUrl, imageFile, onBack }: { sourceUrl: string; imageFile: File; onBack: () => void }) {
  const [quality, setQuality] = useState(72);
  const [maxWidth, setMaxWidth] = useState(0);
  const [output, setOutput] = useState<{ size: number; width: number; height: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const loadedRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    loadedRef.current = null;
    void estimate(72, 0);
    return () => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); };
  }, [sourceUrl]);

  const renderCompressed = (image: HTMLImageElement, max = 0) => {
    let width = image.naturalWidth;
    let height = image.naturalHeight;
    if (max > 0 && width > max) {
      height = Math.round((height * max) / width);
      width = max;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable in this browser.');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return canvas;
  };

  const estimate = async (q: number, maxWidthValue: number) => {
    try {
      const image = loadedRef.current ?? await loadImage(sourceUrl);
      loadedRef.current = image;
      const canvas = renderCompressed(image, maxWidthValue);
      const blob = await canvasBlob(canvas, 'image/jpeg', q / 100);
      setOutput({ size: blob.size, width: canvas.width, height: canvas.height });
    } catch {
      // Best-effort estimate; the download flow surfaces real errors.
    }
  };

  const scheduleEstimate = (q: number, maxWidthValue: number) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => { void estimate(q, maxWidthValue); }, 120);
  };

  const handleQuality = (value: number) => {
    setQuality(value);
    scheduleEstimate(value, maxWidth);
  };
  const handleMaxWidth = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    setMaxWidth(value);
    scheduleEstimate(quality, value);
  };

  const download = async () => {
    setBusy(true);
    setNotice('');
    try {
      const image = loadedRef.current ?? await loadImage(sourceUrl);
      loadedRef.current = image;
      const canvas = renderCompressed(image, maxWidth);
      const blob = await canvasBlob(canvas, 'image/jpeg', quality / 100);
      const base = imageFile.name.replace(/\.[^.]+$/, '');
      downloadBlob(blob, `${base}-compressed.jpg`);
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Compression export failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const widthOptions = [
    { value: '0', label: 'Original' },
    { value: '1920', label: '1920 px' },
    { value: '1280', label: '1280 px' },
    { value: '800', label: '800 px' },
  ];

  return (
    <div className="cleaner-animate-in">
      <EditorHeader id="compress" onBack={onBack} icon={FileArchive} accent="gold" label="Compress image" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <PreviewFrame url={sourceUrl} label="Original" className="min-h-[290px] lg:min-h-[470px]" />
        <aside className="flex flex-col rounded-2xl border border-[#293337] bg-[#171d20] p-5">
          <div className="rounded-xl border border-[#334145] bg-[#121719] px-3 py-2.5 text-[11px] leading-4 text-[#8f9da0]">
            <span className="block"><span className="text-[#cfd7d0]">{imageFile.name}</span></span>
            <span className="mt-0.5 block font-mono text-[10px] text-[#718082]">{formatBytes(imageFile.size)} original</span>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Quality</p><span data-testid="text-compress-quality" className="font-mono text-xs text-[#e2bf77]">{quality}%</span></div>
            <input data-testid="input-compress-quality" type="range" min="10" max="100" value={quality} onChange={(event) => handleQuality(Number(event.target.value))} className="mt-4 w-full accent-[#f0bd5b]" />
            <p className="mt-2 text-[10px] leading-4 text-[#718082]">Lower quality shrinks the file. Export is always JPG.</p>
          </div>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Max width</p>
            <select data-testid="select-compress-width" value={String(maxWidth)} onChange={handleMaxWidth} className="mt-3 w-full cursor-pointer rounded-xl border border-[#334145] bg-[#121719] px-3 py-2.5 text-sm text-[#f5f1e8] outline-none transition-colors focus:border-[#f0bd5b]">
              {widthOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <p className="mt-2 text-[10px] leading-4 text-[#718082]">Resizing down first also cuts the file size.</p>
          </div>
          <div className="mt-6 h-px bg-[#293337]" />
          <div className="mt-4 rounded-xl border border-[#62e4dc]/20 bg-[#62e4dc]/[.07] px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#9fe9e3]">Estimated output</p>
            <p data-testid="text-compress-size" className="mt-1 font-mono text-sm text-[#cfd7d0]">
              {output ? <>{formatBytes(output.size)} · {output.width} × {output.height}px</> : 'Measuring…'}
            </p>
          </div>
          {notice && <p data-testid="text-compress-error" className="mt-4 text-xs leading-4 text-[#f1837c]">{notice}</p>}
          <button type="button" data-testid="button-download-compress" disabled={busy} onClick={download} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#f0bd5b] px-4 py-3 text-sm font-bold text-[#171719] transition-all hover:-translate-y-0.5 disabled:opacity-60"><Download size={16} /> Download compressed</button>
        </aside>
      </div>
    </div>
  );
}

type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
type WatermarkSettings = { text: string; size: number; color: string; opacity: number; position: WatermarkPosition };

const POSITIONS: Array<{ id: WatermarkPosition; label: string }> = [
  { id: 'top-left', label: 'Top left' },
  { id: 'top-right', label: 'Top right' },
  { id: 'bottom-left', label: 'Bottom left' },
  { id: 'bottom-right', label: 'Bottom right' },
  { id: 'center', label: 'Center' },
];

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function paintWatermark(canvas: HTMLCanvasElement, image: HTMLImageElement, settings: WatermarkSettings) {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable in this browser.');
  context.drawImage(image, 0, 0);
  const text = settings.text.trim();
  if (!text) return;
  const padding = Math.round(settings.size * 0.4);
  context.font = `700 ${settings.size}px 'Space Grotesk', 'DM Mono', monospace, sans-serif`;
  context.fillStyle = hexToRgba(settings.color, settings.opacity / 100);
  const width = canvas.width;
  const height = canvas.height;
  switch (settings.position) {
    case 'top-left':
      context.textAlign = 'left';
      context.textBaseline = 'top';
      context.fillText(text, padding, padding);
      break;
    case 'top-right':
      context.textAlign = 'right';
      context.textBaseline = 'top';
      context.fillText(text, width - padding, padding);
      break;
    case 'bottom-left':
      context.textAlign = 'left';
      context.textBaseline = 'bottom';
      context.fillText(text, padding, height - padding);
      break;
    case 'bottom-right':
      context.textAlign = 'right';
      context.textBaseline = 'bottom';
      context.fillText(text, width - padding, height - padding);
      break;
    case 'center':
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(text, width / 2, height / 2);
      break;
  }
}

function WatermarkEditor({ sourceUrl, onBack }: { sourceUrl: string; onBack: () => void }) {
  const [text, setText] = useState('Your watermark');
  const [size, setSize] = useState(48);
  const [color, setColor] = useState('#f5f1e8');
  const [opacity, setOpacity] = useState(70);
  const [position, setPosition] = useState<WatermarkPosition>('bottom-right');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const settings = useMemo<WatermarkSettings>(
    () => ({ text, size, color, opacity, position }),
    [text, size, color, opacity, position],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let alive = true;
    loadImage(sourceUrl)
      .then((image) => { if (alive) paintWatermark(canvas, image, settings); })
      .catch(() => { /* Preview is best-effort until the image is readable. */ });
    return () => { alive = false; };
  }, [sourceUrl, settings]);

  const download = async () => {
    setBusy(true);
    setNotice('');
    try {
      const image = await loadImage(sourceUrl);
      const canvas = document.createElement('canvas');
      paintWatermark(canvas, image, settings);
      const blob = await canvasBlob(canvas, 'image/png');
      downloadBlob(blob, 'watermarked.png');
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Watermark export failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="cleaner-animate-in">
      <EditorHeader id="watermark" onBack={onBack} icon={Type} accent="cyan" label="Watermark / add text" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="rounded-2xl border border-[#293337] bg-[#121719] p-2 sm:p-3">
          <div className="relative overflow-hidden rounded-xl bg-[#0d1113]">
            <canvas ref={canvasRef} data-testid="canvas-watermark" className="mx-auto block h-auto max-h-[62vh] w-full" aria-label="Watermark preview" />
          </div>
          <p className="px-2 pb-1 pt-3 text-xs text-[#8f9da0]">Live preview — the downloaded file matches it.</p>
        </div>
        <aside className="flex flex-col rounded-2xl border border-[#293337] bg-[#171d20] p-5">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Watermark text</p>
          <input data-testid="input-watermark-text" type="text" value={text} onChange={(event) => setText(event.target.value)} maxLength={60} className="mt-3 w-full rounded-xl border border-[#334145] bg-[#121719] px-3 py-2.5 text-sm text-[#f5f1e8] outline-none transition-colors focus:border-[#62e4dc]" placeholder="Type your watermark" />
          <div className="my-6 h-px bg-[#293337]" />
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Font size</p><span className="font-mono text-xs text-[#9fe9e3]">{size}px</span></div>
              <input data-testid="input-watermark-size" type="range" min="14" max="140" value={size} onChange={(event) => setSize(Number(event.target.value))} className="mt-4 w-full accent-[#62e4dc]" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Color</p>
              <span className="flex items-center gap-2"><input data-testid="input-watermark-color" type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-8 w-11 cursor-pointer rounded-lg border border-[#334145] bg-[#121719] p-1" /><span className="font-mono text-[10px] text-[#8f9da0]">{color}</span></span>
            </div>
            <div>
              <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Opacity</p><span className="font-mono text-xs text-[#9fe9e3]">{opacity}%</span></div>
              <input data-testid="input-watermark-opacity" type="range" min="5" max="100" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} className="mt-4 w-full accent-[#62e4dc]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Position</p>
              <select data-testid="select-watermark-position" value={position} onChange={(event) => setPosition(event.target.value as WatermarkPosition)} className="mt-3 w-full cursor-pointer rounded-xl border border-[#334145] bg-[#121719] px-3 py-2.5 text-sm text-[#f5f1e8] outline-none transition-colors focus:border-[#62e4dc]">
                {POSITIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </div>
          </div>
          {notice && <p data-testid="text-watermark-error" className="mt-4 text-xs leading-4 text-[#f1837c]">{notice}</p>}
          <button type="button" data-testid="button-download-watermark" disabled={busy} onClick={download} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#62e4dc] px-4 py-3 text-sm font-bold text-[#102021] transition-all hover:-translate-y-0.5 disabled:opacity-60"><Download size={16} /> Download</button>
        </aside>
      </div>
    </div>
  );
}

function PrivacyEditor({ sourceUrl, imageFile, onBack }: { sourceUrl: string; imageFile: File; onBack: () => void }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [doneUrl, setDoneUrl] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => () => { if (doneUrl) URL.revokeObjectURL(doneUrl); }, [doneUrl]);

  const cleanAndDownload = async () => {
    setBusy(true);
    setNotice('');
    try {
      const image = await loadImage(sourceUrl);
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable in this browser.');
      context.drawImage(image, 0, 0);
      const blob = await canvasBlob(canvas, 'image/png');
      const base = imageFile.name.replace(/\.[^.]+$/, '');
      downloadBlob(blob, `${base}-no-metadata.png`);
      setDoneUrl((previous) => { if (previous) URL.revokeObjectURL(previous); return URL.createObjectURL(blob); });
      setDone(true);
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Metadata removal failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="cleaner-animate-in">
      <EditorHeader id="privacy" onBack={onBack} icon={EyeOff} accent="gold" label="Remove privacy data" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        {done ? (
          <PreviewFrame url={doneUrl} label="Cleaned" className="min-h-[290px] lg:min-h-[470px]" />
        ) : (
          <PreviewFrame url={sourceUrl} label="Original" className="min-h-[290px] lg:min-h-[470px]" />
        )}
        <aside className="flex flex-col rounded-2xl border border-[#293337] bg-[#171d20] p-5">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0bd5b]/10 text-[#f0bd5b]"><ShieldCheck size={19} /></div>
            <p className="text-xs leading-5 text-[#8f9da0]">Photos keep hidden data — GPS location, device model and capture date. This tool re-draws the image so all of it is dropped.</p>
          </div>
          {done && (
            <p data-testid="text-privacy-done" className="mt-5 flex items-center gap-2 rounded-xl border border-[#62e4dc]/20 bg-[#62e4dc]/[.07] px-3 py-2.5 text-xs text-[#9fe9e3]"><ShieldCheck size={14} /> Metadata removed. Location, device info and date are gone from the exported file.</p>
          )}
          {notice && <p data-testid="text-privacy-error" className="mt-4 text-xs leading-4 text-[#f1837c]">{notice}</p>}
          <button type="button" data-testid="button-clean-privacy" disabled={busy} onClick={cleanAndDownload} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#f0bd5b] px-4 py-3 text-sm font-bold text-[#171719] transition-all hover:-translate-y-0.5 disabled:opacity-60">
            {busy ? <>Cleaning</> : <><EyeOff size={16} /> Clean & download</>}
          </button>
          {done && <p className="mt-3 text-center text-[10px] leading-4 text-[#718082]">Running it again is harmless — it just exports another clean copy.</p>}
        </aside>
      </div>
    </div>
  );
}

function BackgroundEditor({ sourceUrl, imageFile, onBack }: { sourceUrl: string; imageFile: File; onBack: () => void }) {
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [background, setBackground] = useState<'transparent' | 'white'>('transparent');
  const [notice, setNotice] = useState('');
  const transparentRef = useRef<Blob | null>(null);
  const whiteRef = useRef<Blob | null>(null);

  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  const compositeWhite = async (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    try {
      const image = await loadImage(url);
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable in this browser.');
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
      return await canvasBlob(canvas, 'image/png');
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const remove = async () => {
    setProcessing(true);
    setNotice('');
    try {
      const formData = new FormData();
      formData.append('image', imageFile, imageFile.name);
      const response = await fetch('/api/remove-background', { method: 'POST', body: formData });
      if (!response.ok) {
        let message = 'The local background-removal service is unavailable.';
        try {
          const payload = await response.json() as { error?: string };
          message = payload.error || message;
        } catch {
          // Keep the friendly fallback when the service returns a non-JSON error.
        }
        throw new Error(message);
      }
      const blob = await response.blob();
      transparentRef.current = blob;
      whiteRef.current = null;
      setBackground('transparent');
      setResultUrl((previous) => { if (previous) URL.revokeObjectURL(previous); return URL.createObjectURL(blob); });
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Background removal failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const applyMode = async (mode: 'transparent' | 'white') => {
    const source = transparentRef.current;
    if (!source) return;
    setProcessing(true);
    setNotice('');
    try {
      let target = source;
      if (mode === 'white') {
        if (!whiteRef.current) whiteRef.current = await compositeWhite(source);
        target = whiteRef.current;
      }
      setBackground(mode);
      setResultUrl((previous) => { if (previous) URL.revokeObjectURL(previous); return URL.createObjectURL(target); });
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Could not rebuild the background. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const download = async () => {
    const source = transparentRef.current;
    if (!source) return;
    setProcessing(true);
    setNotice('');
    try {
      let target = source;
      if (background === 'white') {
        if (!whiteRef.current) whiteRef.current = await compositeWhite(source);
        target = whiteRef.current;
      }
      const base = imageFile.name.replace(/\.[^.]+$/, '');
      downloadBlob(target, `${base}-no-background.png`);
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Download failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="cleaner-animate-in">
      <EditorHeader id="background" onBack={onBack} icon={Scissors} accent="cyan" label="Remove background" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="space-y-4">
          <PreviewFrame url={sourceUrl} label="Original" className="min-h-[200px] lg:min-h-[260px]" />
          <div className={`relative overflow-hidden rounded-2xl border border-[#2a3539] ${background === 'white' ? 'bg-white' : 'checker'} min-h-[200px] lg:min-h-[260px]`}>
            {resultUrl ? (
              <img src={resultUrl} alt="Background removed" className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-center px-4">
                <WandSparkles size={20} className="text-[#647477]" />
                <p className="text-xs text-[#647477]">Removed background will appear here.</p>
              </div>
            )}
            <span className="absolute bottom-3 right-3 rounded-md border border-white/10 bg-[#111719]/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#bec7c4]">Result</span>
          </div>
        </div>
        <aside className="flex flex-col rounded-2xl border border-[#293337] bg-[#171d20] p-5">
          {!resultUrl ? (
            <>
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#62e4dc]/10 text-[#62e4dc]"><Scissors size={19} /></div>
                <p className="text-xs leading-5 text-[#8f9da0]">A free local AI model removes the background and keeps a transparent PNG. It downloads a small model once on first use — this can take a few seconds.</p>
              </div>
              {notice && <p data-testid="text-background-error" className="mt-4 text-xs leading-4 text-[#f1837c]">{notice}</p>}
              <button type="button" data-testid="button-remove-background" disabled={processing} onClick={remove} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#62e4dc] px-4 py-3 text-sm font-bold text-[#102021] transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70">
                {processing ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#102021]/30 border-t-[#102021]" /> Removing background…</> : <><WandSparkles size={16} /> Remove background</>}
              </button>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Result background</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <SectionButton active={background === 'transparent'} testId="button-bg-transparent" onClick={() => void applyMode('transparent')}>Transparent</SectionButton>
                <SectionButton active={background === 'white'} testId="button-bg-white" onClick={() => void applyMode('white')}>White</SectionButton>
              </div>
              <p className="mt-3 text-[10px] leading-4 text-[#718082]">White helps for passport-style photos.</p>
              {notice && <p data-testid="text-background-error" className="mt-4 text-xs leading-4 text-[#f1837c]">{notice}</p>}
              <button type="button" data-testid="button-download-background" disabled={processing} onClick={download} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-[#62e4dc] px-4 py-3 text-sm font-bold text-[#102021] transition-all hover:-translate-y-0.5 disabled:opacity-60"><Download size={16} /> Download</button>
              <p className="mt-3 text-center text-[10px] leading-4 text-[#718082]">Exported as PNG. Nothing is stored on the server.</p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

export { RotateFlipEditor, AdjustEditor, CompressEditor, WatermarkEditor, PrivacyEditor, BackgroundEditor };