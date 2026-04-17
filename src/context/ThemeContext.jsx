import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ── Theme definitions ─────────────────────────────────────────────────────────
export const THEMES = {
  default: {
    label: 'Default',
    '--theme-bg': '#FAFAFC',
    '--theme-surface': '#ffffff',
    '--theme-accent': '#8B3DFF',
    '--theme-accent-2': '#00C4CC',
    '--theme-text': '#0f172a',
    '--theme-text-muted': '#64748b',
    '--theme-border': '#e2e8f0',
    '--theme-sidebar-bg': '#ffffff',
    '--theme-sidebar-text': '#0f172a',
    '--theme-sidebar-active-bg': 'rgba(37,99,235,0.07)',
    '--theme-sidebar-active-text': '#2563eb',
  },
  premium: {
    label: 'Premium',
    '--theme-bg': '#f5f0ff',
    '--theme-surface': '#faf7ff',
    '--theme-accent': '#ffffff',
    '--theme-accent-2': '#c4b5fd',
    '--theme-text': '#2e1065',
    '--theme-text-muted': '#6d28d9',
    '--theme-border': '#ddd6fe',
    '--theme-sidebar-bg': '#ede9fe',
    '--theme-sidebar-text': '#2e1065',
    '--theme-sidebar-active-bg': 'rgba(139,92,246,0.12)',
    '--theme-sidebar-active-text': '#7c3aed',
  },
  business: {
    label: 'Business',
    '--theme-bg':                  '#0a0a0a',
    '--theme-surface':             '#111111',
    '--theme-accent':              '#e2e8f0',
    '--theme-accent-2':            '#94a3b8',
    '--theme-text':                '#f1f5f9',
    '--theme-text-muted':          '#64748b',
    '--theme-border':              '#1e1e1e',
    '--theme-sidebar-bg':          '#0d0d0d',
    '--theme-sidebar-text':        '#f1f5f9',
    '--theme-sidebar-active-bg':   'rgba(255,255,255,0.07)',
    '--theme-sidebar-active-text': '#ffffff',
  },
};

const ThemeContext = createContext(null);
const STORAGE_KEY = 'vimi_theme';

// ─────────────────────────────────────────────────────────────────────────────
// PREMIUM ANIMATION — slow purple wash + sweeping white light lines
// ─────────────────────────────────────────────────────────────────────────────
function runPremiumTransition(onDone) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // White shimmer lines
  const lines = Array.from({ length: 12 }, (_, i) => ({
    x:     canvas.width * 0.1 + i * (canvas.width / 10),
    speed: 2.5 + Math.random() * 3,
    width: 1 + Math.random() * 2.5,
    alpha: 0,
  }));

  let frame = 0;
  const TOTAL = 220;

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Purple wash overlay — fades in then out
    const washAlpha =
      frame < 80  ? (frame / 80) * 0.7               // fade in
      : frame < 160 ? 0.7                              // hold
      : 0.7 - ((frame - 160) / 60) * 0.7;             // fade out

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0,   `rgba(109,40,217,${washAlpha})`);
    grad.addColorStop(0.5, `rgba(139,92,246,${washAlpha * 0.8})`);
    grad.addColorStop(1,   `rgba(167,139,250,${washAlpha * 0.6})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sweeping white lines shooting upward
    lines.forEach((ln, i) => {
      const delay = i * 8;
      const localF = frame - delay;
      if (localF < 0) return;

      ln.alpha = localF < 20 ? localF / 20 : localF > 80 ? Math.max(0, 1 - (localF - 80) / 60) : 1;
      const y = canvas.height - localF * ln.speed;
      const lineLen = 120 + Math.random() * 60;

      const lg = ctx.createLinearGradient(ln.x, y, ln.x, y - lineLen);
      lg.addColorStop(0, `rgba(255,255,255,0)`);
      lg.addColorStop(0.4, `rgba(255,255,255,${ln.alpha * 0.85})`);
      lg.addColorStop(1, `rgba(255,255,255,0)`);

      ctx.beginPath();
      ctx.moveTo(ln.x, y);
      ctx.lineTo(ln.x, y - lineLen);
      ctx.strokeStyle = lg;
      ctx.lineWidth = ln.width;
      ctx.stroke();
    });

    // Sparkle particles near top
    if (frame > 40 && frame < 180) {
      const count = 5;
      for (let i = 0; i < count; i++) {
        const px = Math.random() * canvas.width;
        const py = Math.random() * canvas.height * 0.5;
        const sr = 1.5 + Math.random() * 2;
        ctx.beginPath();
        ctx.arc(px, py, sr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7})`;
        ctx.fill();
      }
    }

    frame++;
    if (frame < TOTAL) requestAnimationFrame(tick);
    else {
      canvas.remove();
      if (onDone) onDone();
    }
  };
  requestAnimationFrame(tick);
}

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS ANIMATION — drawn 3D rocket, gold explosion, star field, premium reveal
// ─────────────────────────────────────────────────────────────────────────────
function runBusinessTransition(onDone) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const CX = W / 2, CY = H / 2;

  // Draw stylized rocket using canvas paths (no emoji)
  function drawRocket(x, y, sc, alpha) {
    if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(sc, sc);
    const bg = ctx.createLinearGradient(-14,-55,14,10);
    bg.addColorStop(0,'#f1f5f9'); bg.addColorStop(0.5,'#ffffff'); bg.addColorStop(1,'#94a3b8');
    ctx.beginPath(); ctx.moveTo(0,-58);
    ctx.bezierCurveTo(13,-42,15,-18,15,2); ctx.lineTo(15,22);
    ctx.bezierCurveTo(15,30,7,34,0,34); ctx.bezierCurveTo(-7,34,-15,30,-15,22);
    ctx.lineTo(-15,2); ctx.bezierCurveTo(-15,-18,-13,-42,0,-58);
    ctx.fillStyle = bg; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-15,8); ctx.lineTo(-30,36); ctx.lineTo(-13,28); ctx.closePath(); ctx.fillStyle='#475569'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(15,8);  ctx.lineTo(30,36);  ctx.lineTo(13,28);  ctx.closePath(); ctx.fillStyle='#475569'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,34,9,4,0,0,Math.PI*2); ctx.fillStyle='#1e293b'; ctx.fill();
    const pg = ctx.createRadialGradient(-1,-28,0,0,-28,8);
    pg.addColorStop(0,'#93c5fd'); pg.addColorStop(0.7,'#3b82f6'); pg.addColorStop(1,'#1e40af');
    ctx.beginPath(); ctx.arc(0,-28,8,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(-2,-31,3,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.fill();
    const hl = ctx.createLinearGradient(-3,-56,3,-10);
    hl.addColorStop(0,'rgba(255,255,255,0.75)'); hl.addColorStop(1,'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.moveTo(-2,-56); ctx.bezierCurveTo(2,-46,4,-28,4,-8); ctx.bezierCurveTo(1,-8,-2,-8,-4,-8); ctx.bezierCurveTo(-4,-28,-2,-46,-2,-56);
    ctx.fillStyle=hl; ctx.fill();
    ctx.restore();
  }

  const flames=[],sparks=[],rings=[];
  let swirlAngle=0;
  function spawnSwirl(rx,ry) {
    swirlAngle+=0.38; const r=18+Math.sin(swirlAngle*0.6)*6;
    flames.push({x:rx+Math.cos(swirlAngle)*r,y:ry+Math.sin(swirlAngle)*r*0.35+36,vx:(Math.random()-0.5)*0.6,vy:1.4+Math.random()*1.5,r:2.5+Math.random()*3,alpha:0.65,decay:0.022+Math.random()*0.016,color:`hsl(${22+Math.random()*35},100%,${58+Math.random()*20}%)`,gravity:0});
  }
  function spawnExplosion(ex,ey) {
    for(let i=0;i<90;i++){const a=Math.random()*Math.PI*2,spd=4+Math.random()*14,isGold=Math.random()>0.4;flames.push({x:ex,y:ey,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:3+Math.random()*9,alpha:0.92,decay:0.011+Math.random()*0.013,color:isGold?`hsl(${42+Math.random()*18},100%,${60+Math.random()*20}%)`:`hsl(${8+Math.random()*28},100%,${52+Math.random()*16}%)`,gravity:0.07});}
    for(let i=0;i<40;i++){const a=Math.random()*Math.PI*2,spd=6+Math.random()*16;sparks.push({x:ex,y:ey,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,alpha:1,decay:0.016+Math.random()*0.012,color:Math.random()>0.4?`hsl(45,100%,${72+Math.random()*20}%)`:'#fff',gravity:0.1});}
    for(let i=0;i<3;i++){rings.push({x:ex,y:ey,r:10+i*20,alpha:0.7-i*0.18,decay:0.018,color:`hsl(${42+i*8},100%,65%)`});}
  }
  const stars=Array.from({length:90},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+0.2,alpha:0,pulse:Math.random()*Math.PI*2}));
  const rocket={x:CX,y:H+100,vy:-8,accel:1.07,alpha:1,scale:1};
  let frame=0,darkAlpha=0,exploded=false;
  const EXPLODE_Y=CY+40,TOTAL=300;

  const tick=()=>{
    ctx.clearRect(0,0,W,H);
    if(frame<90) darkAlpha=Math.min(0.97,frame/90*0.97);
    ctx.fillStyle=`rgba(6,6,8,${darkAlpha})`; ctx.fillRect(0,0,W,H);
    stars.forEach(s=>{s.pulse+=0.035;s.alpha=Math.min(1,s.alpha+0.01)*(0.25+Math.sin(s.pulse)*0.18+0.18);ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${s.alpha*darkAlpha})`;ctx.fill();});
    if(!exploded){rocket.y+=rocket.vy;rocket.vy*=rocket.accel;spawnSwirl(rocket.x,rocket.y);drawRocket(rocket.x,rocket.y,rocket.scale,rocket.alpha);if(rocket.y<=EXPLODE_Y){exploded=true;spawnExplosion(rocket.x,rocket.y);}}
    flames.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.gravity)p.vy+=p.gravity;p.vx*=0.97;p.alpha-=p.decay;p.r*=0.984;if(p.alpha<=0||p.r<0.4)return;const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,p.color.replace('hsl','hsla').replace(')',`,${p.alpha})`));g.addColorStop(1,'rgba(0,0,0,0)');ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();});
    sparks.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=0.97;p.alpha-=p.decay;if(p.alpha<=0)return;ctx.save();ctx.globalAlpha=p.alpha;ctx.strokeStyle=p.color;ctx.lineWidth=1.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*4,p.y-p.vy*4);ctx.stroke();ctx.restore();});
    rings.forEach(r=>{r.r+=4.5;r.alpha-=r.decay;if(r.alpha<=0)return;ctx.save();ctx.globalAlpha=r.alpha;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.strokeStyle=r.color;ctx.lineWidth=2.5;ctx.stroke();ctx.restore();});
    if(exploded&&frame>160){const ta=Math.min(1,(frame-160)/50);ctx.save();ctx.globalAlpha=ta;ctx.font='600 17px "DM Sans",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=`rgba(241,245,249,${ta})`;ctx.fillText('BUSINESS ENTERPRISE',CX,CY+110);ctx.fillStyle=`rgba(100,116,139,${ta*0.55})`;ctx.fillRect(CX-115,CY+124,230,0.5);ctx.restore();}
    for(let i=flames.length-1;i>=0;i--){if(flames[i].alpha<=0||flames[i].r<0.4)flames.splice(i,1);}
    for(let i=sparks.length-1;i>=0;i--){if(sparks[i].alpha<=0)sparks.splice(i,1);}
    for(let i=rings.length-1;i>=0;i--){if(rings[i].alpha<=0)rings.splice(i,1);}
    frame++;
    if(frame<TOTAL)requestAnimationFrame(tick);
    else{canvas.remove();if(onDone)onDone();}
  };
  requestAnimationFrame(tick);
}



// ── Provider ──────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? 'default',
  );

  // Apply CSS custom props to <html> on every theme change
  useEffect(() => {
    const vars = THEMES[theme] ?? THEMES.default;
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => {
      if (k.startsWith('--')) root.style.setProperty(k, v);
    });
    // Set on both html and body so selectors always match
    root.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  /** @param {'default'|'premium'|'business'} newTheme
   *  @param {boolean} animate — play the upgrade animation */
  const setTheme = useCallback((newTheme, animate = false) => {
    if (animate && newTheme === 'premium') {
      runPremiumTransition(() => {
        localStorage.setItem(STORAGE_KEY, newTheme);
        setThemeState(newTheme);
      });
      return;
    }
    if (animate && newTheme === 'business') {
      runBusinessTransition(() => {
        localStorage.setItem(STORAGE_KEY, newTheme);
        setThemeState(newTheme);
      });
      return;
    }
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook for any component inside the provider. */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
