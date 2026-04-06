// ---------------------------------------------------------------------------
// subdomain.js — resolves the tenant slug from the browser URL.
//
// Production:  hoangshop.vimi.id.vn  →  "hoangshop"
//              vimi.id.vn            →  null
//              www.vimi.id.vn        →  null
//
// Local dev:   hoangshop.localhost   →  "hoangshop"
//              localhost:5173        →  null
//
// The VITE_ env var lets you override the root domain for staging environments
// without rebuilding (e.g. VITE_ROOT_DOMAIN=staging.vimi.id.vn).
// ---------------------------------------------------------------------------

const ROOT_DOMAIN = import.meta.env.VITE_ROOT_DOMAIN ?? 'vimi.id.vn';

/**
 * Returns the tenant slug if the current hostname is a subdomain of the
 * root domain, or null if it's the root itself.
 *
 * @returns {string | null}
 */
export const getSubdomain = () => {
  const hostname = window.location.hostname;

  // ── Local development override ─────────────────────────────────────────
  // Set VITE_FORCE_SUBDOMAIN=hoangshop in .env.local to simulate a storefront
  // without editing /etc/hosts.
  if (import.meta.env.VITE_FORCE_SUBDOMAIN) {
    return import.meta.env.VITE_FORCE_SUBDOMAIN;
  }

  // ── localhost: support <slug>.localhost ───────────────────────────────
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  const localMatch = hostname.match(/^([a-z0-9-]+)\.localhost$/i);
  if (localMatch) {
    return localMatch[1];
  }

  // ── Production / staging ──────────────────────────────────────────────
  // Exact match on root domain or www subdomain → no tenant
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return null;
  }

  // Any other subdomain of ROOT_DOMAIN → extract the leftmost label
  const suffix = `.${ROOT_DOMAIN}`;
  if (hostname.endsWith(suffix)) {
    const slug = hostname.slice(0, hostname.length - suffix.length);
    // Reject multi-level subdomains (e.g. a.b.vimi.id.vn)
    if (!slug.includes('.') && slug.length > 0) {
      return slug;
    }
  }

  return null;
};

/**
 * Returns true if the current session is inside a tenant storefront.
 */
export const isTenantDomain = () => getSubdomain() !== null;
