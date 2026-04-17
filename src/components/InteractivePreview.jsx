import React, { useRef, useEffect, useState } from 'react';

// Self-contained HTML generator — no React deps inside the iframe
const buildTemplateHTML = (templateId, customizations, template) => {
  const c = { ...customizations };
  const primary = template?.primaryColor || c.primaryColor || '#1A1D23';
  const accent  = template?.accentColor  || c.accentColor  || '#F8F9FA';
  const font    = template?.defaultFont  || c.fontFamily   || "'Inter', sans-serif";
  const br      = template?.borderRadius || c.borderRadius || 'none';        // 'none' | 'small' | 'large'
  const heroLayout   = template?.heroLayout   || c.heroLayout   || 'fullwidth';  // 'fullwidth' | 'centered' | 'split'
  const layoutStyle  = template?.layoutStyle  || c.layoutStyle  || 'grid';       // 'grid' | 'list' | 'masonry'
  const darkHero     = template?.darkHero     || c.darkHero     || true;

  const brCard = br === 'large' ? '16px' : br === 'small' ? '6px' : '0px';
  const brBtn  = br === 'large' ? '999px' : br === 'small' ? '6px' : '0px';

  const storeName  = typeof c.storeName === 'object' ? (c.storeName?.text || 'VIMI') : (c.storeName || 'VIMI');
  const heroTitle  = typeof c.heroTitle === 'object' ? (c.heroTitle?.text || 'Elevate Your Everyday.') : (c.heroTitle || 'Elevate Your Everyday.');
  const heroSub    = typeof c.heroSubtitle === 'object' ? (c.heroSubtitle?.text || '') : (c.heroSubtitle || 'Discover our premium collection.');
  const heroCta    = typeof c.heroCta === 'object' ? (c.heroCta?.text || 'Shop Now') : (c.heroCta || 'Shop Now');
  const heroBg     = c.heroBg || 'https://picsum.photos/seed/hero-dark/1600/900';
  const catTitle   = typeof c.catTitle  === 'object' ? c.catTitle?.text  : (c.catTitle   || 'Featured Categories');
  const topTitle   = typeof c.topSellTitle === 'object' ? c.topSellTitle?.text : (c.topSellTitle || 'Best Sellers');
  const testTitle  = typeof c.testTitle === 'object' ? c.testTitle?.text  : (c.testTitle  || 'What our customers say');
  const newsTitle  = typeof c.newsTitle === 'object' ? c.newsTitle?.text  : (c.newsTitle  || 'Join the club');
  const promoTitle = typeof c.promoTitle === 'object' ? c.promoTitle?.text : (c.promoTitle || 'Limited Offer');
  const promoSub   = typeof c.promoSub   === 'object' ? c.promoSub?.text   : (c.promoSub   || 'Exclusive deals for our members.');
  const promoCta   = typeof c.promoCta   === 'object' ? c.promoCta?.text   : (c.promoCta   || 'Shop Sale');
  const promoBg    = c.promoBg    || 'https://picsum.photos/seed/promo-dark/1400/600';
  const footerDesc = typeof c.footerDesc === 'object' ? c.footerDesc?.text : (c.footerDesc || '');

  const cats = [1, 2, 3].map(i => ({
    img:  c[`cat${i}Img`]  || `https://picsum.photos/seed/cat${i}/600/800`,
    name: typeof c[`cat${i}Name`] === 'object' ? c[`cat${i}Name`]?.text : (c[`cat${i}Name`] || `Category ${i}`),
  }));
  const prods = [1, 2, 3, 4].map(i => ({
    img:   c[`prod${i}Img`]   || `https://picsum.photos/seed/prod${i}/500/500`,
    name:  typeof c[`prod${i}Name`]  === 'object' ? c[`prod${i}Name`]?.text  : (c[`prod${i}Name`]  || `Product ${i}`),
    price: typeof c[`prod${i}Price`] === 'object' ? c[`prod${i}Price`]?.text : (c[`prod${i}Price`] || '$99'),
  }));
  const tests = [1, 2, 3].map(i => ({
    q: typeof c[`test${i}Quote`]  === 'object' ? c[`test${i}Quote`]?.text  : (c[`test${i}Quote`]  || '"Absolutely love it!"'),
    a: typeof c[`test${i}Author`] === 'object' ? c[`test${i}Author`]?.text : (c[`test${i}Author`] || `Customer ${i}`),
  }));

  /* ── Hero HTML variants ── */
  const heroContent = (() => {
    if (heroLayout === 'centered') {
      return `
        <section style="position:relative;width:100%;min-height:600px;display:flex;align-items:center;justify-content:center;background:#111;overflow:hidden;">
          <img src="${heroBg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.6;" />
          <div style="position:relative;z-index:1;text-align:center;padding:40px 24px;max-width:800px;">
            <h1 style="font-size:clamp(2.5rem,5vw,5rem);font-weight:900;color:#fff;margin:0 0 16px;letter-spacing:-0.04em;line-height:1.05;">${heroTitle}</h1>
            <p style="font-size:1.1rem;color:rgba(255,255,255,.75);margin:0 0 32px;max-width:520px;margin-inline:auto;">${heroSub}</p>
            <a href="#" style="display:inline-block;background:${primary};color:#fff;padding:16px 40px;border-radius:${brBtn};font-weight:700;font-size:.9rem;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;">${heroCta}</a>
          </div>
        </section>`;
    }
    if (heroLayout === 'split') {
      return `
        <section style="width:100%;display:grid;grid-template-columns:1fr 1fr;min-height:600px;">
          <div style="background:${accent};display:flex;align-items:center;padding:60px 48px;">
            <div>
              <p style="font-size:.75rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:${primary};margin:0 0 16px;">New Collection</p>
              <h1 style="font-size:clamp(2rem,4vw,4rem);font-weight:900;color:#111;margin:0 0 16px;letter-spacing:-0.04em;line-height:1.1;">${heroTitle}</h1>
              <p style="font-size:1rem;color:#555;margin:0 0 32px;line-height:1.6;">${heroSub}</p>
              <a href="#" style="display:inline-block;background:${primary};color:#fff;padding:14px 36px;border-radius:${brBtn};font-weight:700;font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;text-decoration:none;">${heroCta}</a>
            </div>
          </div>
          <div style="overflow:hidden;">
            <img src="${heroBg}" style="width:100%;height:100%;object-fit:cover;display:block;" />
          </div>
        </section>`;
    }
    // default: fullwidth
    return `
      <section style="position:relative;width:100%;min-height:680px;display:flex;align-items:center;overflow:hidden;">
        <img src="${heroBg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
        <div style="position:absolute;inset:0;background:linear-gradient(to right, rgba(0,0,0,.75) 40%, rgba(0,0,0,.1));"></div>
        <div style="position:relative;z-index:1;padding:60px 64px;max-width:720px;">
          <h1 style="font-size:clamp(2.5rem,5vw,5.5rem);font-weight:900;color:#fff;margin:0 0 20px;letter-spacing:-0.04em;line-height:1.05;">${heroTitle}</h1>
          <p style="font-size:1.1rem;color:rgba(255,255,255,.75);margin:0 0 36px;max-width:440px;line-height:1.6;">${heroSub}</p>
          <a href="#" style="display:inline-block;background:#fff;color:#111;padding:16px 40px;border-radius:${brBtn};font-weight:800;font-size:.875rem;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;">${heroCta}</a>
        </div>
      </section>`;
  })();

  /* ── Product grid variants ── */
  const productHTML = (() => {
    if (layoutStyle === 'list') {
      return prods.map(p => `
        <div style="display:flex;gap:24px;align-items:center;padding:20px 0;border-bottom:1px solid #f0f0f0;">
          <img src="${p.img}" style="width:100px;height:100px;object-fit:cover;border-radius:${brCard};flex-shrink:0;" />
          <div>
            <h4 style="font-weight:700;margin:0 0 4px;font-size:.9rem;">${p.name}</h4>
            <p style="color:${primary};font-weight:700;font-size:.95rem;margin:0;">${p.price}</p>
          </div>
          <a href="#" style="margin-left:auto;background:${primary};color:#fff;padding:8px 20px;border-radius:${brBtn};font-size:.75rem;font-weight:700;text-decoration:none;flex-shrink:0;">Buy</a>
        </div>`).join('');
    }
    if (layoutStyle === 'masonry') {
      const cols = [prods.filter((_, i) => i % 2 === 0), prods.filter((_, i) => i % 2 !== 0)];
      return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        ${cols.map(col => `<div style="display:flex;flex-direction:column;gap:16px;">
          ${col.map((p, ci) => `
            <div>
              <img src="${p.img}" style="width:100%;height:${ci % 2 === 0 ? '280px' : '200px'};object-fit:cover;border-radius:${brCard};display:block;">
              <h4 style="margin:8px 0 2px;font-weight:700;font-size:.85rem;">${p.name}</h4>
              <p style="color:${primary};font-weight:700;font-size:.85rem;margin:0;">${p.price}</p>
            </div>`).join('')}
        </div>`).join('')}
      </div>`;
    }
    // default grid
    return `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;">
      ${prods.map((p, i) => `
        <div style="cursor:pointer;">
          <div style="position:relative;aspect-ratio:1;overflow:hidden;border-radius:${brCard};background:#f0f0f0;">
            <img src="${p.img}" style="width:100%;height:100%;object-fit:cover;display:block;" />
            ${i === 0 ? `<div style="position:absolute;top:10px;left:10px;background:#fff;font-size:.65rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:4px 8px;">Bestseller</div>` : ''}
          </div>
          <h4 style="margin:10px 0 4px;font-weight:700;font-size:.85rem;color:#111;">${p.name}</h4>
          <p style="color:#666;font-weight:600;font-size:.8rem;margin:0;">${p.price}</p>
        </div>`).join('')}
    </div>`;
  })();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Playfair+Display:wght@700;900&family=Outfit:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:${font};background:#fff;color:#111;-webkit-font-smoothing:antialiased;}
    a{text-decoration:none;}
    img{max-width:100%;}
  </style>
</head>
<body>

<!-- NAV -->
<header style="width:100%;height:72px;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;padding:0 64px;background:#fff;position:sticky;top:0;z-index:100;">
  <div style="font-weight:900;font-size:1.5rem;letter-spacing:-.04em;text-transform:uppercase;color:${primary};">${storeName}</div>
  <nav style="display:flex;gap:32px;font-size:.85rem;font-weight:600;color:#555;">
    <a href="#" style="color:#111;">Home</a>
    <a href="#">Shop</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </nav>
  <div style="display:flex;gap:20px;font-size:.85rem;font-weight:600;color:#555;">
    <a href="#">Search</a>
    <a href="#" style="display:flex;align-items:center;gap:6px;">Cart <span style="background:${primary};color:#fff;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:.65rem;">0</span></a>
  </div>
</header>

<!-- HERO -->
${heroContent}

<!-- CATEGORIES -->
<section style="padding:80px 64px;max-width:1440px;margin:0 auto;">
  <h2 style="font-size:2rem;font-weight:900;text-align:center;margin-bottom:48px;letter-spacing:-.03em;">${catTitle}</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
    ${cats.map(cat => `
      <div style="position:relative;aspect-ratio:4/5;overflow:hidden;cursor:pointer;border-radius:${brCard};">
        <img src="${cat.img}" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"/>
        <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,.8) 0%, rgba(0,0,0,.1) 50%, transparent 100%);display:flex;align-items:flex-end;padding:28px;">
          <h3 style="font-weight:800;color:#fff;font-size:1.2rem;letter-spacing:-.02em;">${cat.name}</h3>
        </div>
      </div>`).join('')}
  </div>
</section>

<!-- BEST SELLERS -->
<section style="padding:60px 64px 80px;background:#f8f8f8;">
  <div style="max-width:1440px;margin:0 auto;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;">
      <h2 style="font-size:2rem;font-weight:900;letter-spacing:-.03em;">${topTitle}</h2>
      <a href="#" style="font-weight:700;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;border-bottom:2px solid ${primary};color:${primary};padding-bottom:2px;">View All</a>
    </div>
    ${productHTML}
  </div>
</section>

<!-- PROMO BANNER -->
<section style="position:relative;width:100%;height:500px;display:flex;align-items:center;overflow:hidden;">
  <img src="${promoBg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
  <div style="position:absolute;inset:0;background:rgba(0,0,0,.35);"></div>
  <div style="position:relative;z-index:1;margin-left:auto;margin-right:64px;background:#fff;padding:56px;max-width:480px;box-shadow:0 25px 60px rgba(0,0,0,.2);">
    <p style="font-size:.7rem;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:${primary};margin-bottom:12px;">Limited Time</p>
    <h2 style="font-size:2.5rem;font-weight:900;color:#111;margin-bottom:12px;line-height:1.1;letter-spacing:-.03em;">${promoTitle}</h2>
    <p style="color:#555;margin-bottom:28px;line-height:1.6;font-size:.9rem;">${promoSub}</p>
    <a href="#" style="display:inline-block;background:${primary};color:#fff;padding:14px 36px;border-radius:${brBtn};font-weight:800;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;">${promoCta}</a>
  </div>
</section>

<!-- TESTIMONIALS -->
<section style="padding:80px 64px;max-width:1440px;margin:0 auto;">
  <h2 style="font-size:2rem;font-weight:900;text-align:center;margin-bottom:52px;letter-spacing:-.03em;">${testTitle}</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
    ${tests.map(t => `
      <div style="background:#fff;border:1px solid #eee;padding:36px;border-radius:${brCard};box-shadow:0 2px 12px rgba(0,0,0,.04);">
        <div style="color:#FBBF24;font-size:1.1rem;margin-bottom:16px;">★★★★★</div>
        <p style="font-style:italic;color:#444;line-height:1.7;margin-bottom:20px;font-size:.9rem;">${t.q}</p>
        <p style="font-weight:800;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:#111;">${t.a}</p>
      </div>`).join('')}
  </div>
</section>

<!-- NEWSLETTER + FOOTER -->
<footer style="background:#111;color:#ccc;padding:60px 64px 32px;">
  <div style="max-width:1440px;margin:0 auto;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:60px;padding-bottom:48px;border-bottom:1px solid #333;margin-bottom:32px;">
      <div>
        <h3 style="font-size:2rem;font-weight:900;color:#fff;margin-bottom:12px;">${newsTitle}</h3>
        <div style="display:flex;gap:0;margin-top:20px;">
          <input placeholder="Your email" style="flex:1;background:#222;border:1px solid #444;color:#fff;padding:14px 18px;font-size:.85rem;outline:none;" />
          <button style="background:${primary};color:#fff;padding:14px 28px;font-weight:700;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;border:none;cursor:pointer;border-radius:0 ${brBtn === '999px' ? '8px' : brBtn} ${brBtn === '999px' ? '8px' : brBtn} 0;">Subscribe</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
        ${['Shop','Support','About'].map((col, ci) => `
          <div>
            <h4 style="color:#fff;font-weight:800;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:16px;">${col}</h4>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;">
              ${[['All Products','New Arrivals','Best Sellers'],['FAQ','Shipping','Contact'],['Our Story','Journal','Stores']][ci].map(item => `<li><a href="#" style="color:#888;font-size:.82rem;transition:color .15s" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#888'">${item}</a></li>`).join('')}
            </ul>
          </div>`).join('')}
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;font-size:.8rem;color:#555;">
      <div style="font-weight:900;font-size:1.1rem;text-transform:uppercase;color:rgba(255,255,255,.3);">${storeName}</div>
      <p>${footerDesc}</p>
      <div style="display:flex;gap:16px;">
        <a href="#" style="color:#555;font-size:.8rem;font-weight:600;">IG</a>
        <a href="#" style="color:#555;font-size:.8rem;font-weight:600;">FB</a>
        <a href="#" style="color:#555;font-size:.8rem;font-weight:600;">TW</a>
      </div>
    </div>
  </div>
</footer>

</body>
</html>`;
};

const InteractivePreview = ({ templateId, customizations, template }) => {
  const iframeRef = useRef(null);
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (templateId && customizations) {
      const newHtml = buildTemplateHTML(templateId, customizations, template);
      setHtml(newHtml);
    }
  }, [templateId, customizations, template]);

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title="Template Preview"
      sandbox="allow-scripts allow-same-origin allow-forms"
      className="w-full h-full border-0"
    />
  );
};

export default InteractivePreview;
