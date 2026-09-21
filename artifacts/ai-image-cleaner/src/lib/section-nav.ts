import type { ToolId } from './tools';

let pendingSection: string | null = null;

let pendingTool: ToolId | null = null;
const activeToolSubscribers = new Set<(tool: ToolId | null) => void>();

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Remember the section we want to land on after a page navigation.
 * The homepage consumes the pending value on mount and scrolls there.
 */
export function setPendingSection(id: string) {
  pendingSection = id;
}

export function consumePendingSection(): string | null {
  const id = pendingSection;
  pendingSection = null;
  return id;
}

/**
 * Scroll to a same-page section when a nav/footer link is clicked.
 * On the homepage this scrolls directly; from any other page it stores
 * the target and navigates home so the homepage can scroll on mount.
 */
export function goToSection(id: string, onHome: boolean) {
  if (onHome) {
    scrollToSection(id);
  } else {
    setPendingSection(id);
  }
}

/**
 * Remember the tool tab that should be activated after a page navigation.
 * Homepage consumes it on mount and passes it to the Features showcase.
 */
export function setPendingTool(id: ToolId) {
  pendingTool = id;
}

export function consumePendingTool(): ToolId | null {
  const id = pendingTool;
  pendingTool = null;
  return id;
}

/**
 * Notify live subscribers (the Features tab showcase) that a tool should
 * become active, without any page navigation happening.
 */
export function setActiveTool(id: ToolId | null) {
  activeToolSubscribers.forEach((fn) => fn(id));
}

export function subscribeActiveTool(fn: (tool: ToolId | null) => void): () => void {
  activeToolSubscribers.add(fn);
  return () => {
    activeToolSubscribers.delete(fn);
  };
}

/**
 * Like goToSection but for a specific tool tab: on the homepage it scrolls
 * to the Features section and activates the tool immediately; from any other
 * page it stores the pending tool + section and navigates home so the
 * homepage can scroll and select the tab on mount.
 */
export function goToTool(id: ToolId, onHome: boolean) {
  if (onHome) {
    scrollToSection('features');
    setActiveTool(id);
  } else {
    setPendingTool(id);
    setPendingSection('features');
  }
}