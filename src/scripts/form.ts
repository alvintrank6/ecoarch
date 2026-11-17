// Booking form enhancement. The form is a real POST form; this adds validation, fetch submit, aria-live states.
// States: default, focus (CSS), sending, error (Brick + icon + text), success (Moss + icon + text, then redirect).
// Data is kept on errors. Honeypot hits are acknowledged without sending.
type Msgs = Record<string, string>;
const ICON_ERR = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 5.5v5.5M10 13.4v.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const ICON_OK = '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 10.3l2.8 2.8L14 7.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function initForm(form: HTMLFormElement) {
  form.noValidate = true; // native bubbles off; no-JS keeps native `required` validation
  const msg = JSON.parse(form.dataset.msgs ?? '{}') as Msgs;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-form-submit]')!;
  const label = submit.textContent ?? '';
  const fields = ['plot', 'type', 'name', 'contact', 'consent'] as const;
  const el = (n: string) => form.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement | null;

  const setStatus = (state: '' | 'sending' | 'error' | 'success', text: string) => {
    status.dataset.state = state;
    status.innerHTML = state === 'error' ? `${ICON_ERR}<span>${text}</span>` : state === 'success' ? `${ICON_OK}<span>${text}</span>` : text ? `<span class="spin" aria-hidden="true"></span><span>${text}</span>` : '';
  };
  const clearErrors = () => {
    form.querySelectorAll('.err').forEach((e) => e.remove());
    fields.forEach((n) => { const f = el(n); if (f) { f.removeAttribute('aria-invalid'); f.removeAttribute('aria-describedby'); } });
  };
  const addError = (name: string, text: string) => {
    const f = el(name); if (!f) return;
    const id = `${f.id}-err`;
    const p = document.createElement('p');
    p.className = 'err'; p.id = id;
    p.innerHTML = `${ICON_ERR}<span>${text}</span>`;
    (f.closest('.field, .consent') ?? f.parentElement)!.appendChild(p);
    f.setAttribute('aria-invalid', 'true'); f.setAttribute('aria-describedby', id);
  };
  const validContact = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[0-9][0-9\s().-]{6,17}$/.test(v);
  function validate(): string[] {
    const bad: string[] = [];
    clearErrors();
    const plot = el('plot')!.value.trim(), type = el('type')!.value, name = el('name')!.value.trim(), contact = el('contact')!.value.trim();
    if (!plot) { addError('plot', msg.errRequired); bad.push('plot'); }
    if (!type) { addError('type', msg.errType); bad.push('type'); }
    if (!name) { addError('name', msg.errRequired); bad.push('name'); }
    if (!contact) { addError('contact', msg.errRequired); bad.push('contact'); }
    else if (!validContact(contact)) { addError('contact', msg.errContact); bad.push('contact'); }
    if (!(el('consent') as HTMLInputElement).checked) { addError('consent', msg.errConsent); bad.push('consent'); }
    return bad;
  }

  const setBusy = (busy: boolean) => {
    submit.disabled = busy; submit.setAttribute('aria-disabled', String(busy)); form.setAttribute('aria-busy', String(busy));
    submit.textContent = busy ? (form.dataset.sendingLabel ?? label) : label;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    const bad = validate();
    if (bad.length) {
      setStatus('error', (msg.errSummary ?? '').replace('{n}', String(bad.length)));
      el(bad[0])?.focus();
      return;
    }
    setStatus('', '');
    const thanks = form.dataset.thanks!;
    const endpoint = form.dataset.endpoint ?? '';
    const data = new FormData(form);
    if (data.get('website')) { window.location.assign(thanks); return; } // honeypot: bots get a silent "success"
    submit.style.minWidth = `${submit.offsetWidth}px`; // keep width while loading
    setBusy(true); setStatus('sending', form.dataset.sendingLabel ?? '');
    try {
      if (endpoint) {
        const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 15000);
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: ctl.signal });
        clearTimeout(to);
        if (!res.ok) throw new Error(String(res.status));
      } else {
        console.warn('PUBLIC_FORM_ENDPOINT is not set: the request was not sent anywhere (see HANDOVER.md).');
      }
      setStatus('success', msg.okSent);
      setTimeout(() => window.location.assign(thanks), 600);
    } catch {
      setBusy(false);
      setStatus('error', msg.errNetwork); // fields keep their values
    }
  });

  // Clear a field's error as soon as the user fixes it.
  form.addEventListener('input', (e) => {
    const t = e.target as HTMLElement;
    t.removeAttribute('aria-invalid');
    document.getElementById(`${t.id}-err`)?.remove();
  });
}

const boot = () => document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach(initForm);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
