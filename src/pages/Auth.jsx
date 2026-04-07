import React, { useState } from 'react';
import { Zap, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Gọi API xuống Backend ở cổng 4000
    const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
    
    try {
      const res = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || 'Authentication failed');
      }

      // Lưu Token thẻ bài vào bộ nhớ trình duyệt
      localStorage.setItem('vimi_token', result.data.token);
      
      // Báo cho hệ thống biết là đã đăng nhập thành công
      onLoginSuccess();

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-page relative overflow-hidden font-sans">
      {/* Background Gradient rực rỡ kiểu Canva */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-canva-purple/30 blur-[120px] rounded-full mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-canva-cyan/30 blur-[120px] rounded-full mix-blend-multiply"></div>

      <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-10 relative z-10 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-canva-purple to-canva-cyan rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <Zap className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-ink tracking-tight">
            {isLogin ? 'Welcome Back' : 'Start Your Empire'}
          </h2>
          <p className="text-ink-muted text-sm mt-2">
            {isLogin ? 'Enter your details to access your dashboard.' : 'Create an account to build your first store.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-canva-purple focus:border-transparent outline-none transition"
                placeholder="admin@trimi.vn"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-canva-purple focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 mt-4 bg-gradient-to-r from-canva-purple to-canva-cyan text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-ink-muted text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-canva-purple font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}