// ---------------------------------------------------------------------------
// api.js — the single HTTP client for the entire frontend.
//
// Design decisions:
//   • All requests go through one `request()` function so auth headers,
//     error normalisation, and base URL only need to be configured once.
//   • Access token is read from localStorage on each call — no stale
//     closure issues if the token refreshes mid-session.
//   • On 401, attempts one silent token refresh then retries.
//     If refresh also fails, fires a custom 'vimi:logout' event so any
//     mounted component can redirect to login without circular imports.
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_URL ?? 'https://api.stablecast.id.vn';

// ── Token storage ─────────────────────────────────────────────────────────
const TOKEN_KEY   = 'vimi_access_token';
const REFRESH_KEY = 'vimi_refresh_token';

export const tokenStore = {
  get:            ()        => localStorage.getItem(TOKEN_KEY),
  set:            (t)       => localStorage.setItem(TOKEN_KEY, t),
  getRefresh:     ()        => localStorage.getItem(REFRESH_KEY),
  setRefresh:     (t)       => localStorage.setItem(REFRESH_KEY, t),
  clear:          ()        => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY); },
};

// ── Core request ──────────────────────────────────────────────────────────
let _refreshing = null; // Promise lock — prevents concurrent refresh storms

async function request(path, options = {}, retry = true) {
  const token = tokenStore.get();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include', // sends httpOnly refresh cookie
  });

  // Silent refresh on 401
  if (res.status === 401 && retry) {
    if (!_refreshing) {
      _refreshing = refreshAccessToken().finally(() => { _refreshing = null; });
    }
    const ok = await _refreshing.catch(() => false);
    if (ok) return request(path, options, false); // one retry
    tokenStore.clear();
    window.dispatchEvent(new CustomEvent('vimi:logout'));
    throw new ApiError('Session expired', 401, 'TOKEN_EXPIRED');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const { code, message, details } = data.error ?? {};
    throw new ApiError(message ?? `HTTP ${res.status}`, res.status, code, details);
  }

  return data;
}

async function refreshAccessToken() {
  const refresh_token = tokenStore.getRefresh();
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method:      'POST',
    headers:     { 'Content-Type': 'application/json' },
    credentials: 'include',
    body:        JSON.stringify({ refresh_token }),
  });
  if (!res.ok) return false;
  const { data } = await res.json();
  tokenStore.set(data.access_token);
  if (data.refresh_token) tokenStore.setRefresh(data.refresh_token);
  return true;
}

// ── Typed error class ─────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(message, status, code, details = null) {
    super(message);
    this.status  = status;
    this.code    = code;
    this.details = details;
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const auth = {
  register: (body)  => request('/api/auth/register', { method: 'POST', body }),
  login:    async (body) => {
    const res = await request('/api/auth/login', { method: 'POST', body });
    tokenStore.set(res.data.access_token);
    if (res.data.refresh_token) tokenStore.setRefresh(res.data.refresh_token);
    return res;
  },
  logout: async () => {
    await request('/api/auth/logout', { method: 'POST' }).catch(() => {});
    tokenStore.clear();
  },
  me: () => request('/api/auth/me'),
};

// ── Stores ────────────────────────────────────────────────────────────────
export const stores = {
  list:         ()     => request('/api/stores'),
  get:          ()     => request('/api/stores/me'),
  create:       (body) => request('/api/stores',          { method: 'POST',  body }),
  update:       (body) => request('/api/stores/me',       { method: 'PATCH', body }),
  updateConfig: (body) => request('/api/stores/me/config',{ method: 'PATCH', body }),
  delete:       ()     => request('/api/stores/me',       { method: 'DELETE' }),
};

// ── Products ──────────────────────────────────────────────────────────────
export const products = {
  list:         (params = {}) => request(`/api/products?${new URLSearchParams(params)}`),
  get:          (id)          => request(`/api/products/${id}`),
  create:       (body)        => request('/api/products',           { method: 'POST',   body }),
  update:       (id, body)    => request(`/api/products/${id}`,     { method: 'PATCH',  body }),
  delete:       (id)          => request(`/api/products/${id}`,     { method: 'DELETE' }),
  bulkStatus:   (ids, status) => request('/api/products/bulk-status',{ method: 'POST',  body: { ids, status } }),
};

// ── Orders ────────────────────────────────────────────────────────────────
export const orders = {
  list:         (params = {}) => request(`/api/orders?${new URLSearchParams(params)}`),
  get:          (id)          => request(`/api/orders/${id}`),
  create:       (body)        => request('/api/orders',              { method: 'POST',  body }),
  updateStatus: (id, body)    => request(`/api/orders/${id}/status`, { method: 'PATCH', body }),
};

// ── Customers ─────────────────────────────────────────────────────────────
export const customers = {
  list:   (params = {}) => request(`/api/customers?${new URLSearchParams(params)}`),
  get:    (id)          => request(`/api/customers/${id}`),
  update: (id, body)    => request(`/api/customers/${id}`, { method: 'PATCH', body }),
};

// ── Storefront (public — no auth) ─────────────────────────────────────────
export const storefront = {
  resolve:     (slug, params = {}) =>
    request(`/api/storefront/${slug}?${new URLSearchParams(params)}`, {}, false),
  products:    (slug, params = {}) =>
    request(`/api/storefront/${slug}/products?${new URLSearchParams(params)}`, {}, false),
  product:     (slug, productSlug) =>
    request(`/api/storefront/${slug}/products/${productSlug}`, {}, false),
};

// ── Dashboard Metrics ─────────────────────────────────────────────────────
export const dashboard = {
  metrics: () => request('/api/dashboard/metrics'),
};
