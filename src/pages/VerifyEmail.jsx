import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Wait, let's see if react-router-dom is used, actually App.jsx doesn't use react-router-dom for main routing yet, the user clicks Go to Login. I will just use traditional a tag or window.location

// Let's rewrite it without react-router-dom
import { CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react';

export default function VerifyEmail() {
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    hasFetched.current = true;

    const verifyEmail = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${baseUrl}/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.data || 'Your email has been verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error?.message || 'Verification failed. The token may be invalid or expired.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error occurred while verifying. Please try again later.');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] font-sans" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="w-full max-w-[440px] animate-[fadeIn_0.4s_ease-out] p-6">
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] p-10 text-center">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #8B3DFF, #00C4CC)' }}>
              <Zap size={24} className="text-white" fill="white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-[#1A1D23] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Email Verification
          </h1>

          <div className="flex flex-col items-center justify-center mt-6 mb-8 min-h-[100px]">
            {status === 'loading' && (
              <div className="flex flex-col items-center animate-pulse">
                <Loader2 className="w-12 h-12 text-[#8B3DFF] animate-spin mb-4" />
                <p className="text-[#6B7280]">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <p className="text-green-600 font-medium">{message}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <p className="text-red-500 font-medium">{message}</p>
              </div>
            )}
          </div>

          {status !== 'loading' && (
            <button
              onClick={() => window.location.href = '/'}
              className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, #8B3DFF 0%, #6B20EF 100%)', boxShadow: '0 4px 14px rgba(139,61,255,0.35)' }}
            >
              Back to Login
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
