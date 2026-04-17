import React, { useState } from 'react';
import { CreditCard, QrCode, X, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function CheckoutModal({ isOpen, onClose, plan, billing, onSuccess }) {
  const [tab, setTab] = useState('card'); // 'card' | 'qr'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setLoading(true);
    // Mock processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onSuccess(plan);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[480px] rounded-[2rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Checkout</h2>
            <p className="text-sm text-slate-500 font-medium">
              Upgrading to <span className="text-violet-600 font-bold capitalize">{plan}</span> • {billing}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Payment Successful!</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Welcome to the <span className="capitalize">{plan}</span> tier. 
              Your account features are being unlocked...
            </p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="px-8 flex gap-1 mb-6">
              <button
                onClick={() => setTab('card')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border-2',
                  tab === 'card' 
                    ? 'border-violet-600 text-violet-600 bg-violet-50' 
                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                )}
              >
                <CreditCard size={18} /> Card
              </button>
              <button
                onClick={() => setTab('qr')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all border-2',
                  tab === 'qr' 
                    ? 'border-violet-600 text-violet-600 bg-violet-50' 
                    : 'border-slate-100 text-slate-400 hover:border-slate-200'
                )}
              >
                <QrCode size={18} /> QR Code
              </button>
            </div>

            <div className="px-8 pb-8">
              {tab === 'card' ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Card Number</label>
                    <div className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/5 transition-all">
                      <CreditCard size={18} className="text-slate-300" />
                      <input type="text" placeholder="0000 0000 0000 0000" className="bg-transparent outline-none flex-1 text-sm font-semibold text-slate-700" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Expiry</label>
                      <input type="text" placeholder="MM / YY" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/5 transition-all text-sm font-semibold text-slate-700" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">CVC</label>
                      <input type="text" placeholder="•••" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-500/5 transition-all text-sm font-semibold text-slate-700" />
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full h-14 mt-4 bg-slate-900 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin" size={20} /> Processing...</>
                    ) : (
                      <>Pay Now</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group">
                     {/* Using a placeholder for QR code */}
                     <img 
                       src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=vimi-payment-mock" 
                       alt="Payment QR" 
                       className="w-40 h-40 opacity-80 group-hover:opacity-100 transition-opacity"
                     />
                     <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] font-bold text-slate-900 bg-white px-3 py-1.5 rounded-full shadow-sm">Scan to pay</span>
                     </div>
                  </div>
                  <div className="space-y-1 text-[13px] font-medium text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p>Bank: <span className="text-slate-800 font-bold">Vietcombank</span></p>
                    <p>Account: <span className="text-slate-800 font-bold">1234 5678 90</span></p>
                    <p>Name: <span className="text-slate-800 font-bold">VIMI PLATFORM JSC</span></p>
                    <p>Note: <span className="text-slate-800 font-bold">VIMI {plan.toUpperCase()} {Date.now().toString().slice(-6)}</span></p>
                  </div>
                  <button
                    onClick={handlePay}
                    className="w-full h-14 mt-6 bg-violet-600 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:bg-violet-700 transition-all"
                  >
                    Confirm Transfer
                  </button>
                </div>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit encrypted payment</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
