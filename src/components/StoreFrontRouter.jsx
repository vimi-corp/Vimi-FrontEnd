import React, { useState, useEffect } from 'react';
import { storefront } from '../lib/api';
import StorefrontLayout from './StorefrontLayout';
import StorefrontHome from './StorefrontHome';
import CartDrawer from './Cartdrawer';

export default function StoreFrontRouter({ subdomain }) {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`cart_${subdomain}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(`cart_${subdomain}`, JSON.stringify(cartItems));
  }, [cartItems, subdomain]);

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateCart = (id, qty) => {
    if (qty <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
    }
  };

  const handleCheckout = () => {
    // Clear cart upon successful checkout
    setCartItems([]);
    setCartOpen(false);
    alert('Checkout successful!');
  };

  useEffect(() => {
    setLoading(true);
    storefront.resolve(subdomain)
      .then(res => {
        setStore(res.data.store);
        return storefront.products(subdomain);
      })
      .then(res => {
        setProducts(res.data || []);
      })
      .catch(err => {
        setError("Store not found or unavailable.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [subdomain]);

  if (loading && !store) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-10 w-10 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading store...</p>
      </div>
    </div>
  );
  if (error || !store) return <div className="p-8 text-center text-red-500">{error || 'Store not found'}</div>;

  return (
    <StorefrontLayout 
      store={store} 
      cartCount={cartItems.reduce((acc, item) => acc + item.qty, 0)} 
      onCartOpen={() => setCartOpen(true)}
    >
      <StorefrontHome 
        store={store} 
        products={products} 
        categories={categories} 
        loading={loading}
        onAddToCart={handleAddToCart}
      />
      <CartDrawer 
        open={cartOpen} 
        onClose={() => setCartOpen(false)} 
        items={cartItems} 
        onUpdate={handleUpdateCart}
        onCheckout={handleCheckout}
        primaryColor={store.config?.primary_color || '#8B3DFF'}
      />
    </StorefrontLayout>
  );
}
