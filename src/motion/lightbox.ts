// Lightbox on a native <dialog>: focus trap, Esc and backdrop close, arrow keys; the browser returns focus
// to the opener on close. No animation, so nothing to reduce.
import { qs, qsa } from './dom';

export function initLightbox(): () => void {
  const cleanups: Array<() => void> = [];
  qsa('[data-lightbox]').forEach((root) => {
    const dlg = qs<HTMLDialogElement>('[data-lb-dialog]', root);
    if (!dlg || typeof dlg.showModal !== 'function') return;
    const img = qs<HTMLImageElement>('[data-lb-img]', dlg)!;
    const cap = qs('[data-lb-cap]', dlg)!, count = qs('[data-lb-count]', dlg)!;
    const items = qsa<HTMLAnchorElement>('[data-lb-item]', root);
    const tpl = root.dataset.countTpl ?? '{n} / {total}';
    let idx = 0, opener: HTMLElement | null = null;

    const show = (i: number) => {
      idx = (i + items.length) % items.length;
      const it = items[idx];
      img.src = it.href; img.alt = it.dataset.alt ?? ''; cap.textContent = it.dataset.alt ?? '';
      count.textContent = tpl.replace('{n}', String(idx + 1)).replace('{total}', String(items.length));
    };
    const open = (e: Event, i: number) => {
      e.preventDefault();
      opener = items[i];
      show(i);
      dlg.showModal();
      qs<HTMLButtonElement>('[data-lb-close]', dlg)?.focus();
    };
    items.forEach((it, i) => {
      const f = (e: Event) => open(e, i);
      it.addEventListener('click', f);
      cleanups.push(() => it.removeEventListener('click', f));
    });
    const onKey = (e: KeyboardEvent) => {
      if (!dlg.open) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t === dlg) dlg.close();                      // click on the backdrop
      else if (t.closest('[data-lb-close]')) dlg.close();
      else if (t.closest('[data-lb-prev]')) show(idx - 1);
      else if (t.closest('[data-lb-next]')) show(idx + 1);
    };
    const onClose = () => { img.removeAttribute('src'); opener?.focus(); };
    document.addEventListener('keydown', onKey);
    dlg.addEventListener('click', onClick);
    dlg.addEventListener('close', onClose);
    cleanups.push(() => { document.removeEventListener('keydown', onKey); dlg.removeEventListener('click', onClick); dlg.removeEventListener('close', onClose); if (dlg.open) dlg.close(); });
  });
  return () => cleanups.forEach((c) => c());
}
