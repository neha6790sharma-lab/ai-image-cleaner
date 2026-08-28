import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { useHealth } from '@workspace/api-client-react';
import {
  ArrowLeft,
  Check,
  CircleHelp,
  Download,
  Eraser,
  FileImage,
  LockKeyhole,
  Maximize2,
  MousePointer2,
  RefreshCw,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  Undo2,
  WandSparkles,
  X,
} from 'lucide-react';

type ToolId = 'remove' | 'crop' | 'convert' | 'passport';
type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';
type CropInteraction = 'move' | 'nw' | 'ne' | 'sw' | 'se';

type CropRect = { x: number; y: number; w: number; h: number };
type Preset = { id: string; name: string; note: string; width: number; height: number };

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const TOOLS: Array<{ id: ToolId; label: string; description: string; icon: typeof Eraser; accent: string }> = [
  { id: 'remove', label: 'Remove Object', description: 'Paint it out. Let the pixels fill themselves in.', icon: Eraser, accent: 'gold' },
  { id: 'crop', label: 'Crop', description: 'Frame the part that matters.', icon: Maximize2, accent: 'cyan' },
  { id: 'convert', label: 'Convert Format', description: 'JPG, PNG, or WEBP. Your call.', icon: RefreshCw, accent: 'gold' },
  { id: 'passport', label: 'Passport Size', description: 'India-ready document photo presets.', icon: ScanLine, accent: 'cyan' },
];

const PRESETS: Preset[] = [
  { id: 'passport', name: 'Passport Photo', note: '2 × 2 in / 51 × 51 mm', width: 600, height: 600 },
  { id: 'visa', name: 'Visa / Passport', note: '35 × 45 mm', width: 413, height: 531 },
  { id: 'pan', name: 'PAN Card', note: '25 × 35 mm', width: 295, height: 413 },
  { id: 'stamp', name: 'Stamp Size', note: '20 × 25 mm', width: 236, height: 295 },
];

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

function imageCanvas(image: HTMLImageElement, width = image.naturalWidth, height = image.naturalHeight) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable in this browser.');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return canvas;
}

function ToolCard({ tool, selected, onClick }: { tool: (typeof TOOLS)[number]; selected: boolean; onClick: () => void }) {
  const Icon = tool.icon;
  return (
    <button
      type="button"
      data-testid={`button-tool-${tool.id}`}
      onClick={onClick}
      className={`group relative flex min-h-[142px] flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200 ${
        selected
          ? 'border-[#f0bd5b] bg-[#29251c] shadow-[0_0_0_1px_rgba(240,189,91,.15)]'
          : 'border-[#293337] bg-[#171d20] hover:-translate-y-0.5 hover:border-[#53666c] hover:bg-[#1c2427]'
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tool.accent === 'gold' ? 'bg-[#f0bd5b]/12 text-[#f0bd5b]' : 'bg-[#62e4dc]/10 text-[#62e4dc]'}`}>
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span>
        <span className="mt-3 block text-[15px] font-semibold tracking-[-0.01em] text-[#f5f1e8]">{tool.label}</span>
        <span className="mt-1 block text-xs leading-4 text-[#8f9da0]">{tool.description}</span>
      </span>
      {selected && <Check className="absolute right-3 top-3 text-[#f0bd5b]" size={15} />}
    </button>
  );
}

function Header({ hasImage, onReset }: { hasImage: boolean; onReset: () => void }) {
  const health = useHealth();
  const isHealthy = health.data?.status === 'ok' || health.data?.status === 'healthy';
  return (
    <header className="flex items-center justify-between border-b border-[#252f33] px-4 py-4 sm:px-8 lg:px-12">
      <button type="button" data-testid="button-brand-reset" onClick={onReset} className="group flex items-center gap-3">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#f0bd5b]/50 bg-[#f0bd5b]/10 text-[#f0bd5b] transition-transform group-hover:rotate-6">
          <Sparkles size={17} strokeWidth={1.8} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#62e4dc]" />
        </span>
        <span className="text-left">
          <span className="block text-[15px] font-bold tracking-[-0.02em] text-[#f5f1e8]">cleaner<span className="text-[#f0bd5b]">.</span></span>
          <span className="hidden text-[10px] uppercase tracking-[.18em] text-[#748487] sm:block">private image utility</span>
        </span>
      </button>
      <div className="flex items-center gap-3">
        {hasImage && (
          <button type="button" data-testid="button-change-image" onClick={onReset} className="hidden items-center gap-2 text-xs font-medium text-[#9eabad] transition-colors hover:text-[#f5f1e8] sm:flex">
            <RotateCcw size={14} /> Change image
          </button>
        )}
        <div data-testid="status-health" className="flex items-center gap-2 rounded-full border border-[#293337] bg-[#171d20] px-3 py-1.5 text-[11px] text-[#9eabad]">
          <span className={`h-1.5 w-1.5 rounded-full ${health.isLoading ? 'bg-[#f0bd5b] animate-pulse' : isHealthy ? 'bg-[#62e4dc]' : 'bg-[#718082]'}`} />
          <span className="hidden sm:inline">{health.isLoading ? 'Checking local service' : isHealthy ? 'Local service ready' : 'Runs in your browser'}</span>
          <span className="sm:hidden">Local</span>
        </div>
      </div>
    </header>
  );
}

function UploadZone({ onFile, error, inputRef }: { onFile: (file: File) => void; error: string; inputRef: RefObject<HTMLInputElement | null> }) {
  const [dragging, setDragging] = useState(false);
  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };
  return (
    <div
      data-testid="dropzone-upload"
      onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => { event.preventDefault(); setDragging(false); handleFiles(event.dataTransfer.files); }}
      className={`relative flex min-h-[330px] cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed px-6 text-center transition-all duration-200 sm:min-h-[390px] ${
        dragging ? 'border-[#62e4dc] bg-[#62e4dc]/[.07]' : 'border-[#53666c] bg-[#151b1e]/80 hover:border-[#f0bd5b]/70 hover:bg-[#1b2224]'
      }`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        data-testid="input-upload-file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => { handleFiles(event.target.files); event.currentTarget.value = ''; }}
      />
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] border border-[#f0bd5b]/35 bg-[#f0bd5b]/10 text-[#f0bd5b] shadow-[0_12px_35px_rgba(240,189,91,.08)]">
        <Upload size={27} strokeWidth={1.5} />
      </span>
      <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#f5f1e8] sm:text-2xl">Drop an image here</h2>
      <p className="mt-2 max-w-[280px] text-sm leading-5 text-[#8f9da0]">Or choose a file from your device. Nothing leaves this tab.</p>
      <span className="mt-7 rounded-xl bg-[#f0bd5b] px-5 py-2.5 text-sm font-bold text-[#171719] shadow-[0_5px_0_#9a7031] transition-all hover:-translate-y-0.5 hover:shadow-[0_7px_0_#9a7031] active:translate-y-0 active:shadow-[0_2px_0_#9a7031]">Choose image</span>
      <span className="mt-5 font-mono text-[10px] uppercase tracking-[.14em] text-[#647477]">JPG · PNG · WEBP &nbsp;/&nbsp; 15 MB max</span>
      {error && <p data-testid="text-upload-error" className="absolute bottom-4 left-4 right-4 text-xs font-medium text-[#f1837c]">{error}</p>}
    </div>
  );
}

function ImageFrame({ url, label, className = '' }: { url: string; label: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[#2a3539] bg-[#121719] ${className}`}>
      <img data-testid={`img-${label.toLowerCase().replaceAll(' ', '-')}`} src={url} alt={label} className="h-full w-full object-contain" />
      <span className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-[#111719]/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#bec7c4]">{label}</span>
    </div>
  );
}

function BeforeAfterSlider({ beforeUrl, afterUrl }: { beforeUrl: string; afterUrl: string }) {
  const [reveal, setReveal] = useState(50);
  return (
    <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-[#2a3539] bg-[#121719] md:min-h-[520px]">
      <img src={beforeUrl} alt="Before cleanup" className="absolute inset-0 h-full w-full object-contain" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}>
        <img src={afterUrl} alt="After cleanup" className="absolute inset-0 h-full w-full object-contain" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[#f5f1e8]" style={{ left: `${reveal}%` }}>
        <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#f5f1e8]/70 bg-[#171719]/90 text-xs font-bold text-[#f5f1e8] shadow-lg">↔</span>
      </div>
      <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-md border border-white/10 bg-[#111719]/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#bec7c4]">Before</span>
      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-md border border-[#f0bd5b]/30 bg-[#111719]/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#e2bf77]">After</span>
      <input
        data-testid="input-before-after"
        aria-label="Drag to compare before and after"
        type="range"
        min="0"
        max="100"
        value={reveal}
        onChange={(event) => setReveal(Number(event.target.value))}
        className="absolute inset-x-0 bottom-3 z-20 mx-auto w-[calc(100%-2rem)] cursor-ew-resize accent-[#f0bd5b]"
      />
    </div>
  );
}

function RemoveEditor({ sourceUrl, imageFile, onDone, onBack }: { sourceUrl: string; imageFile: File; onDone: (blob: Blob) => void; onBack: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<ImageData[]>([]);
  const maskHistoryRef = useRef<ImageData[]>([]);
  const drawingRef = useRef(false);
  const [brushSize, setBrushSize] = useState(46);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [processing, setProcessing] = useState(false);
  const [notice, setNotice] = useState('');

  const setupCanvases = (image: HTMLImageElement) => {
    setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
    const overlay = overlayCanvasRef.current;
    const mask = maskCanvasRef.current;
    if (!overlay || !mask) return;
    overlay.width = image.naturalWidth;
    overlay.height = image.naturalHeight;
    mask.width = image.naturalWidth;
    mask.height = image.naturalHeight;
    const overlayContext = overlay.getContext('2d');
    const maskContext = mask.getContext('2d');
    overlayContext?.clearRect(0, 0, overlay.width, overlay.height);
    if (maskContext) {
      maskContext.fillStyle = '#000';
      maskContext.fillRect(0, 0, mask.width, mask.height);
    }
    historyRef.current = [];
    maskHistoryRef.current = [];
  };

  const snapshot = () => {
    const overlay = overlayCanvasRef.current;
    const mask = maskCanvasRef.current;
    if (overlay && mask) {
      const overlayContext = overlay.getContext('2d');
      const maskContext = mask.getContext('2d');
      if (overlayContext && maskContext) {
        historyRef.current.push(overlayContext.getImageData(0, 0, overlay.width, overlay.height));
        maskHistoryRef.current.push(maskContext.getImageData(0, 0, mask.width, mask.height));
      }
    }
  };

  const paint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    const mask = maskCanvasRef.current;
    if (!canvas || !mask || !stageRef.current) return;
    const bounds = canvas.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * canvas.width;
    const y = ((event.clientY - bounds.top) / bounds.height) * canvas.height;
    const scale = canvas.width / bounds.width;
    const visibleContext = canvas.getContext('2d');
    const maskContext = mask.getContext('2d');
    if (!visibleContext || !maskContext) return;
    visibleContext.beginPath();
    visibleContext.arc(x, y, (brushSize * scale) / 2, 0, Math.PI * 2);
    visibleContext.fillStyle = 'rgba(240, 189, 91, .7)';
    visibleContext.fill();
    maskContext.beginPath();
    maskContext.arc(x, y, (brushSize * scale) / 2, 0, Math.PI * 2);
    maskContext.fillStyle = '#fff';
    maskContext.fill();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    snapshot();
    drawingRef.current = true;
    paint(event);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (drawingRef.current) paint(event);
  };
  const handlePointerUp = () => { drawingRef.current = false; };
  const undo = () => {
    const previous = historyRef.current.pop();
    const maskPrevious = maskHistoryRef.current.pop();
    const overlay = overlayCanvasRef.current;
    const mask = maskCanvasRef.current;
    if (previous && maskPrevious && overlay && mask) {
      overlay.getContext('2d')?.putImageData(previous, 0, 0);
      mask.getContext('2d')?.putImageData(maskPrevious, 0, 0);
    }
  };
  const clear = () => {
    const overlay = overlayCanvasRef.current;
    const mask = maskCanvasRef.current;
    if (!overlay || !mask) return;
    snapshot();
    overlay.getContext('2d')?.clearRect(0, 0, overlay.width, overlay.height);
    const maskContext = mask.getContext('2d');
    if (maskContext) {
      maskContext.fillStyle = '#000';
      maskContext.fillRect(0, 0, mask.width, mask.height);
    }
  };
  // The editor keeps the image bytes in memory and creates the multipart payload here.
  const processWithSource = async () => {
    const mask = maskCanvasRef.current;
    if (!mask) return;
    setProcessing(true);
    setNotice('');
    try {
      const maskBlob = await new Promise<Blob>((resolve, reject) =>
        mask.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Mask export failed.')), 'image/png'),
      );
      const formData = new FormData();
      formData.append('image', imageFile, imageFile.name);
      formData.append('mask', maskBlob, 'mask.png');
      const response = await fetch('/api/inpaint', { method: 'POST', body: formData });
      if (!response.ok) {
        let message = 'The local cleanup service is unavailable.';
        try {
          const payload = await response.json() as { error?: string; detail?: string };
          message = payload.error || payload.detail || message;
        } catch {
          // Keep the friendly fallback when the service returns a non-JSON error.
        }
        throw new Error(message);
      }
      onDone(await response.blob());
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Could not reach the local cleanup service. Try again in a moment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="cleaner-animate-in">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" data-testid="button-back-tools-remove" onClick={onBack} className="flex items-center gap-2 text-xs font-semibold text-[#9eabad] transition-colors hover:text-[#f5f1e8]"><ArrowLeft size={15} /> Tools</button>
        <div className="flex items-center gap-2 rounded-full border border-[#f0bd5b]/25 bg-[#f0bd5b]/[.07] px-3 py-1.5 text-[11px] text-[#e2bf77]"><Eraser size={13} /> Remove Object</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="rounded-2xl border border-[#293337] bg-[#121719] p-2 sm:p-3">
          <div ref={stageRef} className="relative mx-auto w-full overflow-hidden rounded-xl bg-[#0d1113]" style={{ aspectRatio: imageSize.width && imageSize.height ? `${imageSize.width}/${imageSize.height}` : '4/3' }}>
            <img src={sourceUrl} alt="Source being edited" className="absolute inset-0 h-full w-full object-contain" onLoad={(event) => setupCanvases(event.currentTarget)} />
            <canvas
              ref={overlayCanvasRef}
              data-testid="canvas-mask-editor"
              className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
          </div>
          <canvas ref={maskCanvasRef} className="hidden" aria-hidden="true" />
          <div className="flex items-center justify-between px-2 pb-1 pt-3">
            <p className="flex items-center gap-2 text-xs text-[#8f9da0]"><MousePointer2 size={14} className="text-[#f0bd5b]" /> Paint over anything you want gone.</p>
            <span className="font-mono text-[10px] text-[#647477]">{imageSize.width ? `${imageSize.width} × ${imageSize.height}` : 'Loading image'}</span>
          </div>
        </div>
        <aside className="flex flex-col rounded-2xl border border-[#293337] bg-[#171d20] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Brush size</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#526267] bg-[#121719]" style={{ transform: `scale(${Math.max(.45, brushSize / 70)})` }} />
              <input data-testid="input-brush-size" type="range" min="12" max="120" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} className="accent-[#f0bd5b] flex-1" />
              <span data-testid="text-brush-size" className="w-8 text-right font-mono text-xs text-[#c9d0cb]">{brushSize}</span>
            </div>
          </div>
          <div className="my-6 h-px bg-[#293337]" />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" data-testid="button-undo-mask" onClick={undo} disabled={!historyRef.current.length} className="flex items-center justify-center gap-2 rounded-xl border border-[#334145] py-2.5 text-xs font-semibold text-[#bcc7c4] transition-colors hover:border-[#617277] hover:text-[#f5f1e8] disabled:cursor-not-allowed disabled:opacity-35"><Undo2 size={14} /> Undo</button>
            <button type="button" data-testid="button-clear-mask" onClick={clear} className="flex items-center justify-center gap-2 rounded-xl border border-[#334145] py-2.5 text-xs font-semibold text-[#bcc7c4] transition-colors hover:border-[#f1837c]/60 hover:text-[#f1837c]"><X size={14} /> Clear</button>
          </div>
          <div className="mt-auto pt-8">
            {notice && <p data-testid="text-inpaint-error" className="mb-3 text-xs leading-4 text-[#f1837c]">{notice}</p>}
            <button type="button" data-testid="button-process-image" onClick={processWithSource} disabled={processing} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#f0bd5b] px-4 py-3 text-sm font-bold text-[#171719] transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70">
              {processing ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#171719]/30 border-t-[#171719]" /> Cleaning pixels</> : <><WandSparkles size={16} /> Remove object</>}
            </button>
            <p className="mt-3 text-center text-[10px] leading-4 text-[#718082]">Processing happens on this device session.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CropEditor({ sourceUrl, onDone, onBack }: { sourceUrl: string; onDone: (blob: Blob) => void; onBack: () => void }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const cropStageRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<CropRect>({ x: 8, y: 8, w: 84, h: 84 });
  const [dragging, setDragging] = useState<CropInteraction | null>(null);
  const [notice, setNotice] = useState('');
  const startRef = useRef({ x: 0, y: 0, rect });
  const getPoint = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = cropStageRef.current?.getBoundingClientRect();
    if (!bounds) return { x: 0, y: 0 };
    return { x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 };
  };
  const begin = (event: ReactPointerEvent<HTMLElement>, mode: CropInteraction) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = getPoint(event);
    startRef.current = { x: point.x, y: point.y, rect };
    setDragging(mode);
  };
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const point = getPoint(event);
    const dx = point.x - startRef.current.x;
    const dy = point.y - startRef.current.y;
    const origin = startRef.current.rect;
    if (dragging === 'move') setRect({ ...origin, x: Math.min(100 - origin.w, Math.max(0, origin.x + dx)), y: Math.min(100 - origin.h, Math.max(0, origin.y + dy)) });
    else {
      const next = { ...origin };
      if (dragging.includes('e')) next.w = Math.min(100 - origin.x, Math.max(8, origin.w + dx));
      if (dragging.includes('s')) next.h = Math.min(100 - origin.y, Math.max(8, origin.h + dy));
      if (dragging.includes('w')) {
        const nextX = Math.min(origin.x + origin.w - 8, Math.max(0, origin.x + dx));
        next.x = nextX;
        next.w = origin.w + origin.x - nextX;
      }
      if (dragging.includes('n')) {
        const nextY = Math.min(origin.y + origin.h - 8, Math.max(0, origin.y + dy));
        next.y = nextY;
        next.h = origin.h + origin.y - nextY;
      }
      setRect(next);
    }
  };
  const exportCrop = async () => {
    const image = imageRef.current;
    if (!image) return;
    setNotice('');
    try {
      const canvas = document.createElement('canvas');
      const sx = (rect.x / 100) * image.naturalWidth;
      const sy = (rect.y / 100) * image.naturalHeight;
      canvas.width = Math.max(40, Math.round((rect.w / 100) * image.naturalWidth));
      canvas.height = Math.max(40, Math.round((rect.h / 100) * image.naturalHeight));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable in this browser.');
      context.drawImage(image, sx, sy, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
      onDone(await canvasBlob(canvas, 'image/png'));
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Crop export failed. Please try again.');
    }
  };
  return (
    <div className="cleaner-animate-in">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" data-testid="button-back-tools-crop" onClick={onBack} className="flex items-center gap-2 text-xs font-semibold text-[#9eabad] hover:text-[#f5f1e8]"><ArrowLeft size={15} /> Tools</button>
        <div className="flex items-center gap-2 rounded-full border border-[#62e4dc]/25 bg-[#62e4dc]/[.07] px-3 py-1.5 text-[11px] text-[#9fe9e3]"><Maximize2 size={13} /> Crop image</div>
      </div>
      <div className="rounded-2xl border border-[#293337] bg-[#121719] p-2 sm:p-3">
        <div ref={cropStageRef} className="relative mx-auto max-w-3xl overflow-hidden rounded-xl bg-[#0d1113]" onPointerMove={move} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)}>
          <img ref={imageRef} src={sourceUrl} alt="Source to crop" className="block max-h-[62vh] w-full object-contain" />
          <div className="absolute inset-0 bg-[#081012]/45">
            <div className="absolute border-2 border-[#f0bd5b] shadow-[0_0_0_9999px_rgba(8,16,18,.5)]" style={{ left: `${rect.x}%`, top: `${rect.y}%`, width: `${rect.w}%`, height: `${rect.h}%` }} onPointerDown={(event) => begin(event, 'move')}>
              <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, index) => <span key={index} className="border border-[#f0bd5b]/25" />)}
              </div>
              {([
                ['nw', '-left-2 -top-2 cursor-nwse-resize'],
                ['ne', '-right-2 -top-2 cursor-nesw-resize'],
                ['sw', '-bottom-2 -left-2 cursor-nesw-resize'],
                ['se', '-bottom-2 -right-2 cursor-nwse-resize'],
              ] as const).map(([handle, position]) => (
                <button
                  key={handle}
                  type="button"
                  aria-label={`Resize crop area ${handle}`}
                  data-testid={`button-resize-crop-${handle}`}
                  onPointerDown={(event) => { event.stopPropagation(); begin(event, handle); }}
                  className={`absolute h-4 w-4 rounded-full border-2 border-[#171719] bg-[#f0bd5b] shadow-md ${position}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-1 pt-4">
          <p className="flex items-center gap-2 text-xs text-[#8f9da0]"><MousePointer2 size={14} className="text-[#62e4dc]" /> Drag the frame, or pull the corner to resize.</p>
          <div className="flex gap-2">
            <button type="button" data-testid="button-reset-crop" onClick={() => setRect({ x: 8, y: 8, w: 84, h: 84 })} className="flex items-center gap-2 rounded-xl border border-[#334145] px-3 py-2 text-xs font-semibold text-[#bcc7c4] hover:text-[#f5f1e8]"><RotateCcw size={14} /> Reset</button>
            <button type="button" data-testid="button-export-crop" onClick={exportCrop} className="flex items-center gap-2 rounded-xl bg-[#62e4dc] px-4 py-2 text-xs font-bold text-[#102021] hover:brightness-105"><Download size={14} /> Crop & download</button>
          </div>
        </div>
        {notice && <p data-testid="text-crop-error" className="px-2 pt-3 text-xs text-[#f1837c]">{notice}</p>}
      </div>
    </div>
  );
}

function ConvertEditor({ sourceUrl, onDone, onBack }: { sourceUrl: string; onDone: (blob: Blob) => void; onBack: () => void }) {
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [quality, setQuality] = useState(88);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const convert = async () => {
    setBusy(true);
    setNotice('');
    try {
      const image = await loadImage(sourceUrl);
      const canvas = imageCanvas(image);
      onDone(await canvasBlob(canvas, format, quality / 100));
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Format conversion failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  const formats: Array<{ id: OutputFormat; label: string; description: string }> = [
    { id: 'image/jpeg', label: 'JPG', description: 'Small, universal' },
    { id: 'image/png', label: 'PNG', description: 'Lossless, crisp' },
    { id: 'image/webp', label: 'WEBP', description: 'Modern, compact' },
  ];
  return (
    <div className="cleaner-animate-in">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" data-testid="button-back-tools-convert" onClick={onBack} className="flex items-center gap-2 text-xs font-semibold text-[#9eabad] hover:text-[#f5f1e8]"><ArrowLeft size={15} /> Tools</button>
        <div className="flex items-center gap-2 rounded-full border border-[#f0bd5b]/25 bg-[#f0bd5b]/[.07] px-3 py-1.5 text-[11px] text-[#e2bf77]"><RefreshCw size={13} /> Convert format</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <ImageFrame url={sourceUrl} label="Original" className="min-h-[290px] lg:min-h-[470px]" />
        <aside className="rounded-2xl border border-[#293337] bg-[#171d20] p-5">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Output format</p>
          <div className="mt-3 space-y-2">
            {formats.map((item) => (
              <button type="button" key={item.id} data-testid={`button-format-${item.label.toLowerCase()}`} onClick={() => setFormat(item.id)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors ${format === item.id ? 'border-[#f0bd5b] bg-[#29251c]' : 'border-[#334145] hover:border-[#617277]'}`}>
                <span><span className="block text-sm font-bold text-[#f5f1e8]">{item.label}</span><span className="mt-0.5 block text-[10px] text-[#8f9da0]">{item.description}</span></span>
                {format === item.id && <Check size={15} className="text-[#f0bd5b]" />}
              </button>
            ))}
          </div>
          <div className={`mt-6 transition-opacity ${format === 'image/png' ? 'opacity-35' : 'opacity-100'}`}>
            <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Quality</p><span data-testid="text-quality" className="font-mono text-xs text-[#e2bf77]">{quality}%</span></div>
            <input data-testid="input-quality" disabled={format === 'image/png'} type="range" min="40" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="mt-4 w-full accent-[#f0bd5b]" />
            <p className="mt-2 text-[10px] leading-4 text-[#718082]">{format === 'image/png' ? 'PNG keeps every pixel.' : 'Higher quality means a larger file.'}</p>
          </div>
          {notice && <p data-testid="text-convert-error" className="mt-4 text-xs leading-4 text-[#f1837c]">{notice}</p>}
          <button type="button" data-testid="button-convert-image" disabled={busy} onClick={convert} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f0bd5b] px-4 py-3 text-sm font-bold text-[#171719] hover:brightness-105 disabled:opacity-60">{busy ? 'Converting' : <><Download size={16} /> Convert & download</>}</button>
        </aside>
      </div>
    </div>
  );
}

function PassportEditor({ sourceUrl, onDone, onBack }: { sourceUrl: string; onDone: (blob: Blob) => void; onBack: () => void }) {
  const [preset, setPreset] = useState(PRESETS[0]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const exportPassport = async () => {
    setBusy(true);
    setNotice('');
    try {
      const image = await loadImage(sourceUrl);
      const targetRatio = preset.width / preset.height;
      const sourceRatio = image.naturalWidth / image.naturalHeight;
      let sx = 0; let sy = 0; let sw = image.naturalWidth; let sh = image.naturalHeight;
      if (sourceRatio > targetRatio) { sw = image.naturalHeight * targetRatio; sx = (image.naturalWidth - sw) / 2; }
      else { sh = image.naturalWidth / targetRatio; sy = (image.naturalHeight - sh) / 2; }
      const canvas = document.createElement('canvas');
      canvas.width = preset.width; canvas.height = preset.height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable in this browser.');
      context.fillStyle = '#fff';
      context.fillRect(0, 0, preset.width, preset.height);
      context.drawImage(image, sx, sy, sw, sh, 0, 0, preset.width, preset.height);
      onDone(await canvasBlob(canvas, 'image/jpeg', .94));
    } catch (caughtError) {
      setNotice(caughtError instanceof Error ? caughtError.message : 'Document photo export failed. Please try again.');
    } finally { setBusy(false); }
  };
  return (
    <div className="cleaner-animate-in">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button type="button" data-testid="button-back-tools-passport" onClick={onBack} className="flex items-center gap-2 text-xs font-semibold text-[#9eabad] hover:text-[#f5f1e8]"><ArrowLeft size={15} /> Tools</button>
        <div className="flex items-center gap-2 rounded-full border border-[#62e4dc]/25 bg-[#62e4dc]/[.07] px-3 py-1.5 text-[11px] text-[#9fe9e3]"><ScanLine size={13} /> Passport size</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <ImageFrame url={sourceUrl} label="Source photo" className="min-h-[290px] lg:min-h-[470px]" />
        <aside className="rounded-2xl border border-[#293337] bg-[#171d20] p-5">
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8f9da0]">Choose a preset</p>
          <div className="mt-3 space-y-2">
            {PRESETS.map((item) => (
              <button type="button" key={item.id} data-testid={`button-preset-${item.id}`} onClick={() => setPreset(item)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors ${preset.id === item.id ? 'border-[#62e4dc] bg-[#173033]' : 'border-[#334145] hover:border-[#617277]'}`}>
                <span><span className="block text-sm font-semibold text-[#f5f1e8]">{item.name}</span><span className="mt-0.5 block font-mono text-[10px] text-[#8f9da0]">{item.note} · {item.width} × {item.height}px</span></span>
                {preset.id === item.id && <Check size={15} className="text-[#62e4dc]" />}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-[#334145] bg-[#121719] p-3 text-[11px] leading-4 text-[#8f9da0]"><span className="mb-1 flex items-center gap-2 font-semibold text-[#c6cfca]"><CircleHelp size={13} className="text-[#62e4dc]" /> What happens</span> Your photo is center-cropped to the exact preset ratio, then exported as a JPG.</div>
          {notice && <p data-testid="text-passport-error" className="mt-4 text-xs leading-4 text-[#f1837c]">{notice}</p>}
          <button type="button" data-testid="button-export-passport" disabled={busy} onClick={exportPassport} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#62e4dc] px-4 py-3 text-sm font-bold text-[#102021] hover:brightness-105 disabled:opacity-60">{busy ? 'Preparing' : <><Download size={16} /> Download JPG</>}</button>
        </aside>
      </div>
    </div>
  );
}

export function CleanerWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState('');
  const [tool, setTool] = useState<ToolId | null>(null);
  const [error, setError] = useState('');

  useEffect(() => () => { if (sourceUrl) URL.revokeObjectURL(sourceUrl); }, [sourceUrl]);
  useEffect(() => () => { if (resultUrl) URL.revokeObjectURL(resultUrl); }, [resultUrl]);

  const reset = () => {
    setSourceFile(null); setTool(null); setError(''); setResultBlob(null);
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSourceUrl(''); setResultUrl('');
  };
  const handleFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) { setError('Use a JPG, PNG, or WEBP image.'); return; }
    if (file.size > MAX_FILE_SIZE) { setError('That file is over the 15 MB limit.'); return; }
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setSourceFile(file); setSourceUrl(URL.createObjectURL(file)); setTool(null); setResultBlob(null); setResultUrl(''); setError('');
  };
  const finish = (blob: Blob) => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    const url = URL.createObjectURL(blob);
    setResultBlob(blob); setResultUrl(url);
  };
  const downloadResult = () => {
    if (resultBlob) downloadBlob(resultBlob, `cleaner-export.${extensionFor(resultBlob.type)}`);
  };
  const renderTool = () => {
    if (!sourceUrl || !tool) return null;
    const common = { sourceUrl, onDone: finish, onBack: () => setTool(null) };
    if (tool === 'remove' && sourceFile) return <RemoveEditor {...common} imageFile={sourceFile} />;
    if (tool === 'crop') return <CropEditor {...common} />;
    if (tool === 'convert') return <ConvertEditor {...common} />;
    return <PassportEditor {...common} />;
  };
  return (
    <main className="cleaner-shell cleaner-noise min-h-[100dvh] text-[#f5f1e8]">
      <Header hasImage={Boolean(sourceUrl)} onReset={reset} />
      <div className="cleaner-grid min-h-[calc(100dvh-73px)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
          {!sourceFile ? (
            <div className="mx-auto max-w-3xl">
              <div className="cleaner-animate-in mb-8 max-w-2xl">
                <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#62e4dc]"><span className="h-px w-7 bg-[#62e4dc]" /> No account. No upload queue.</div>
                <h1 className="max-w-[650px] text-4xl font-bold leading-[.98] tracking-[-.06em] text-[#f5f1e8] sm:text-6xl">Make your image<br /><span className="text-[#f0bd5b]">just right.</span></h1>
                <p className="mt-5 max-w-[520px] text-base leading-7 text-[#9eabad] sm:text-lg">A small set of useful image tools for the moments when “good enough” is not. Quick edits, kept close.</p>
              </div>
              <div className="cleaner-animate-in cleaner-delay-1"><UploadZone onFile={handleFile} error={error} inputRef={inputRef} /></div>
              <div className="cleaner-animate-in cleaner-delay-2 mt-5 grid gap-3 sm:grid-cols-3">
                {[{ icon: LockKeyhole, title: 'Private by default', text: 'Files stay in memory.' }, { icon: WandSparkles, title: 'Useful, not noisy', text: 'Four focused tools.' }, { icon: ShieldCheck, title: '15 MB included', text: 'JPG, PNG, WEBP.' }].map((item) => {
                  const Icon = item.icon;
                  return <div key={item.title} className="flex items-center gap-3 rounded-xl border border-[#293337]/80 bg-[#151b1e]/60 px-3 py-3"><Icon size={16} className="shrink-0 text-[#f0bd5b]" /><span><span className="block text-xs font-semibold text-[#dce1da]">{item.title}</span><span className="block text-[11px] text-[#718082]">{item.text}</span></span></div>;
                })}
              </div>
            </div>
          ) : resultUrl ? (
            <div className="mx-auto max-w-5xl cleaner-animate-in">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#62e4dc]">Export ready</p><h1 className="mt-2 text-3xl font-bold tracking-[-.05em] sm:text-5xl">Looks good.</h1><p className="mt-2 text-sm text-[#8f9da0]">Your edited image is ready to leave this tab.</p></div>
                <div className="flex gap-2"><button type="button" data-testid="button-result-tools" onClick={() => { setResultUrl(''); setResultBlob(null); setTool(null); }} className="flex items-center gap-2 rounded-xl border border-[#3b4a4e] px-4 py-2.5 text-xs font-semibold text-[#c6cfca] hover:border-[#718082] hover:text-[#f5f1e8]"><ArrowLeft size={14} /> Tools</button><button type="button" data-testid="button-download-result" onClick={downloadResult} className="flex items-center gap-2 rounded-xl bg-[#f0bd5b] px-4 py-2.5 text-xs font-bold text-[#171719] hover:brightness-105"><Download size={14} /> Download {resultBlob ? extensionFor(resultBlob.type).toUpperCase() : 'file'}</button></div>
              </div>
              <BeforeAfterSlider beforeUrl={sourceUrl} afterUrl={resultUrl} />
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#293337] bg-[#171d20] px-4 py-3 text-xs text-[#8f9da0]"><Check size={15} className="text-[#62e4dc]" /> Nothing was saved. You can change the image whenever you like.</div>
            </div>
          ) : tool ? (
            <div className="mx-auto max-w-5xl">{renderTool()}</div>
          ) : (
            <div className="mx-auto max-w-5xl">
              <div className="cleaner-animate-in mb-7 flex flex-wrap items-end justify-between gap-4">
                <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#62e4dc]">Image loaded</p><h1 className="mt-2 text-3xl font-bold tracking-[-.05em] sm:text-5xl">Pick a tool.</h1><p className="mt-2 text-sm text-[#8f9da0]"><span className="text-[#cfd7d0]">{sourceFile?.name}</span> <span className="mx-1 text-[#506064]">·</span> {sourceFile ? formatBytes(sourceFile.size) : ''}</p></div>
                <button type="button" data-testid="button-mobile-change-image" onClick={reset} className="flex items-center gap-2 rounded-xl border border-[#3b4a4e] px-3 py-2 text-xs font-semibold text-[#c6cfca] hover:text-[#f5f1e8] sm:hidden"><RotateCcw size={14} /> Change image</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{TOOLS.map((item) => <ToolCard key={item.id} tool={item} selected={tool === item.id} onClick={() => setTool(item.id)} />)}</div>
              <div className="cleaner-animate-in cleaner-delay-1 mt-8 grid gap-4 rounded-2xl border border-[#293337] bg-[#151b1e]/75 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
                <div className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#62e4dc]/10 text-[#62e4dc]"><LockKeyhole size={19} /></div><div><h2 className="text-sm font-semibold text-[#e6e9df]">Your image stays yours.</h2><p className="mt-1 max-w-xl text-xs leading-5 text-[#8f9da0]">Every tool runs in this browser except Remove Object, which uses a private local service for the inpaint step. We do not create accounts, keep history, or store your files.</p></div></div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.14em] text-[#718082]"><FileImage size={14} /> In-memory only</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[#252f33] px-4 py-4 text-[10px] uppercase tracking-[.14em] text-[#647477] sm:px-12"><span>Made for the one image you need right now.</span><span className="flex items-center gap-2"><ShieldCheck size={12} /> No account · No cloud library</span></footer>
    </main>
  );
}