import { useState, useEffect, useCallback } from 'react';
import { storefront as storefrontApi } from '@/lib/api';

// ---------------------------------------------------------------------------
// useStorefront — fetches and manages all public storefront data.
//
// Returns:
//   store      — { id, name, slug, config, plan_tier }
//   products   — paginated product array
//   categories — flat category list
//   pagination — { total, page, limit, totalPages, hasNextPage }
//   loading    — initial load in progress
//   error      — ApiError | null
//   fetchPage  — (params) => void — refetch with new query params
// ---------------------------------------------------------------------------
export const useStorefront = (slug) => {
  const [state, setState] = useState({
    store:      null,
    products:   [],
    categories: [],
    pagination: null,
    loading:    true,
    error:      null,
  });

  const [queryParams, setQueryParams] = useState({ page: '1', limit: '24' });

  const fetchPage = useCallback((newParams = {}) => {
    setQueryParams(prev => ({ ...prev, ...newParams }));
  }, []);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const load = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const { data } = await storefrontApi.resolve(slug, queryParams);
        if (cancelled) return;
        setState({
          store:      { id: data.id, name: data.name, slug: data.slug, plan_tier: data.plan_tier, config: data.config },
          products:   data.products,
          categories: data.categories,
          pagination: data.pagination,
          loading:    false,
          error:      null,
        });
      } catch (err) {
        if (cancelled) return;
        setState(prev => ({ ...prev, loading: false, error: err }));
      }
    };

    load();
    return () => { cancelled = true; };
  }, [slug, queryParams]);

  return { ...state, fetchPage };
};
