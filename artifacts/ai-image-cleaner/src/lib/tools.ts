import {
  Eraser,
  EyeOff,
  FileArchive,
  Maximize2,
  RefreshCw,
  RotateCw,
  ScanLine,
  Scissors,
  SlidersHorizontal,
  Type,
  type LucideIcon,
} from 'lucide-react';

export type ToolId =
  | 'remove'
  | 'crop'
  | 'convert'
  | 'passport'
  | 'rotate'
  | 'adjust'
  | 'compress'
  | 'watermark'
  | 'privacy'
  | 'background';

export interface ToolInfo {
  id: ToolId;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: 'gold' | 'cyan';
  useCase: string;
}

export const TOOLS: ToolInfo[] = [
  {
    id: 'remove',
    label: 'Remove Object',
    description: 'Paint it out. Let the pixels fill themselves in.',
    icon: Eraser,
    accent: 'gold',
    useCase:
      'Spot a photobomber, a tangle of power lines, or a stray watermark? Brush over it and a local AI service fills the area with matching texture. Great for product shots and travel photos where one detail ruins an otherwise perfect frame.',
  },
  {
    id: 'crop',
    label: 'Crop',
    description: 'Frame the part that matters.',
    icon: Maximize2,
    accent: 'cyan',
    useCase:
      'Trim messy edges, fix a lopsided composition, or isolate a subject before you post. Drag the frame around the canvas and pull the corners to resize - everything outside your selection is gone the moment you export.',
  },
  {
    id: 'convert',
    label: 'Convert Format',
    description: 'JPG, PNG, or WEBP. Your call.',
    icon: RefreshCw,
    accent: 'gold',
    useCase:
      'Upload in any supported format and download in another. JPG for small, shareable photos, PNG for crisp graphics and logos, and WEBP for modern, compact web assets. Tune the quality slider to balance size against detail.',
  },
  {
    id: 'passport',
    label: 'Passport Size',
    description: 'India-ready document photo presets.',
    icon: ScanLine,
    accent: 'cyan',
    useCase:
      'Pick Passport, Visa, PAN, or Stamp presets and get a correctly proportioned document photo in one click. Your picture is center-cropped to the exact ratio and exported as a JPG - no ruler, no guesswork.',
  },
  {
    id: 'rotate',
    label: 'Rotate / Flip',
    description: 'Spin, mirror, and export as PNG.',
    icon: RotateCw,
    accent: 'cyan',
    useCase:
      'Straighten a tilted scan or photo, flip a selfie back to the orientation you want, or mirror artwork and graphics. Actions stack, so you can rotate and flip as many times as you need in a single session.',
  },
  {
    id: 'adjust',
    label: 'Adjust & Filters',
    description: 'Brightness, contrast, sepia, B&W.',
    icon: SlidersHorizontal,
    accent: 'gold',
    useCase:
      'Salvage an underexposed shot or give a photo some mood before you share it. Live preview sliders adjust brightness, contrast, and saturation, with one-tap black-and-white and sepia presets on top.',
  },
  {
    id: 'compress',
    label: 'Compress Image',
    description: 'Shrink file size for email & web.',
    icon: FileArchive,
    accent: 'gold',
    useCase:
      'Send photos without the "file too large" bounce. Drag the quality down or cap the width, and watch the estimated output size update live before you download a JPG that is ready for email, forms, or the web.',
  },
  {
    id: 'watermark',
    label: 'Watermark / Add Text',
    description: 'Stamp text anywhere on the image.',
    icon: Type,
    accent: 'cyan',
    useCase:
      'Protect your work, sign a proof, or caption a photo. Type any text, place it in a corner or dead center, and tune size, color, and opacity with a live preview that matches the download exactly.',
  },
  {
    id: 'privacy',
    label: 'Remove Privacy Data',
    description: 'Strip EXIF, GPS and device info.',
    icon: EyeOff,
    accent: 'gold',
    useCase:
      'Photos quietly record where they were taken and on what device. Re-draw the image to drop GPS coordinates, device model, and capture date before you post it anywhere - the export contains only pixels.',
  },
  {
    id: 'background',
    label: 'Remove Background',
    description: 'Cut the subject out with a local AI model.',
    icon: Scissors,
    accent: 'cyan',
    useCase:
      'Make product shots, profile pictures, or collages with a clean cut-out. A free local AI model finds the subject and returns a transparent PNG - or a white one, if you prefer that for passport-style photos.',
  },
];