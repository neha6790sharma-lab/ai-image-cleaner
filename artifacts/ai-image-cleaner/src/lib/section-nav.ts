let pendingSection: string | null = null;

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