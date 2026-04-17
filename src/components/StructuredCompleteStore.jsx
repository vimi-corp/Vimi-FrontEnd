import React from 'react';
import { ShoppingCart, Search, Menu, Star } from 'lucide-react';
import { EditableText, EditableImage, EditableButton } from './EditableElements';
import Draggable from 'react-draggable';

const DraggableWrapper = ({ children, id, defaultPosition, onStop }) => {
  const position = defaultPosition || { x: 0, y: 0 };
  return (
    <Draggable
      position={position}
      onStop={(e, data) => onStop(id, { x: data.x, y: data.y })}
    >
      <div style={{ position: 'relative', cursor: 'move', zIndex: 10 }}>
        {children}
      </div>
    </Draggable>
  );
};

export default function StructuredCompleteStore({ template, colorScheme, fontOption, overrides, onOverrideChange }) {
  const primary = colorScheme?.primary || template.primaryColor;
  const secondary = colorScheme?.secondary || template.accentColor;
  const fontFamily = fontOption?.value || template.defaultFont || 'sans-serif';
  const content = { ...template.defaultContent, ...overrides };
  const positions = overrides?.positions || {};

  // Variation fields — read from overrides first, then template, then defaults
  const heroLayout  = overrides?.heroLayout  || template.heroLayout  || 'fullwidth'; // 'fullwidth'|'centered'|'split'
  const layoutStyle = overrides?.layoutStyle || template.layoutStyle || 'grid';      // 'grid'|'list'|'masonry'
  const borderRadius = overrides?.borderRadius || template.borderRadius || 'none';   // 'none'|'small'|'large'

  const brCard = borderRadius === 'large' ? 'rounded-2xl' : borderRadius === 'small' ? 'rounded-md' : 'rounded-none';
  const brBtn  = borderRadius === 'large' ? 'rounded-full' : borderRadius === 'small' ? 'rounded-lg' : 'rounded-none';

  const handleStop = (id, pos) => {
    onOverrideChange('positions', { ...positions, [id]: pos });
  };

  // Helper to handle override changes easily
  const update = (key) => (val) => onOverrideChange(key, val);

  return (
    <div className="w-full flex justify-center bg-white" style={{ fontFamily }}>
      <div className="w-full max-w-[1440px] flex flex-col bg-white overflow-hidden shadow-2xl relative">
        
        {/* 1. HEADER */}
        <header className="w-full h-20 border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 bg-white sticky top-0 z-50">
           <div className="flex items-center gap-4">
             <Menu className="lg:hidden text-gray-800" />
             <div className="font-black text-2xl tracking-tighter uppercase" style={{ color: primary }}>
               <DraggableWrapper id="storeName" defaultPosition={positions['storeName']} onStop={handleStop}>
                 <EditableText as="span" value={content.storeName} onChange={update('storeName')} />
               </DraggableWrapper>
             </div>
           </div>
           
           <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-600">
             <span className="hover:text-black cursor-pointer">Home</span>
             <span className="hover:text-black cursor-pointer">Shop</span>
             <span className="hover:text-black cursor-pointer">About</span>
             <span className="hover:text-black cursor-pointer">Contact</span>
           </nav>
           
           <div className="flex items-center gap-6 text-gray-800">
             <Search size={20} className="cursor-pointer" />
             <div className="relative cursor-pointer">
               <ShoppingCart size={20} />
               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
             </div>
           </div>
        </header>

        {/* 2. HERO BANNER */}
        {heroLayout === 'split' ? (
          <section className="w-full flex flex-col md:flex-row" style={{ minHeight: '60vh' }}>
            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16" style={{ backgroundColor: secondary || '#F8F9FA' }}>
              <DraggableWrapper id="heroTitle" defaultPosition={positions['heroTitle']} onStop={handleStop}>
                <EditableText as="h1" className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 max-w-xl leading-tight mb-5" value={content.heroTitle} onChange={update('heroTitle')} />
              </DraggableWrapper>
              <DraggableWrapper id="heroSubtitle" defaultPosition={positions['heroSubtitle']} onStop={handleStop}>
                <EditableText as="p" className="text-base lg:text-lg font-medium text-gray-600 max-w-sm mb-8" value={content.heroSubtitle} onChange={update('heroSubtitle')} />
              </DraggableWrapper>
              <DraggableWrapper id="heroCta" defaultPosition={positions['heroCta']} onStop={handleStop}>
                <EditableButton className={`px-8 py-4 text-white font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform ${brBtn}`} style={{ backgroundColor: primary }} value={content.heroCta} onChange={update('heroCta')} />
              </DraggableWrapper>
            </div>
            <div className="flex-1 relative overflow-hidden" style={{ minHeight: 360 }}>
              <DraggableWrapper id="heroBg" defaultPosition={positions['heroBg']} onStop={handleStop}>
                <EditableImage src={content.heroBg} onChange={update('heroBg')} className="w-full h-full object-cover" />
              </DraggableWrapper>
            </div>
          </section>
        ) : heroLayout === 'centered' ? (
          <section className="relative w-full flex items-center justify-center" style={{ minHeight: '70vh' }}>
            <div className="absolute inset-0 z-0">
              <DraggableWrapper id="heroBg" defaultPosition={positions['heroBg']} onStop={handleStop}>
                <EditableImage src={content.heroBg} onChange={update('heroBg')} className="w-full h-full object-cover" />
              </DraggableWrapper>
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
              <DraggableWrapper id="heroTitle" defaultPosition={positions['heroTitle']} onStop={handleStop}>
                <EditableText as="h1" className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 drop-shadow-lg" value={content.heroTitle} onChange={update('heroTitle')} />
              </DraggableWrapper>
              <DraggableWrapper id="heroSubtitle" defaultPosition={positions['heroSubtitle']} onStop={handleStop}>
                <EditableText as="p" className="text-lg font-medium text-gray-200 max-w-xl mb-10" value={content.heroSubtitle} onChange={update('heroSubtitle')} />
              </DraggableWrapper>
              <DraggableWrapper id="heroCta" defaultPosition={positions['heroCta']} onStop={handleStop}>
                <EditableButton className={`px-10 py-4 text-white font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform ${brBtn}`} style={{ backgroundColor: primary }} value={content.heroCta} onChange={update('heroCta')} />
              </DraggableWrapper>
            </div>
          </section>
        ) : (
          // Default: fullwidth
          <section className="relative w-full h-[500px] lg:h-[700px] bg-gray-100 flex items-center group">
            <div className="absolute inset-0 z-0">
               <DraggableWrapper id="heroBg" defaultPosition={positions['heroBg']} onStop={handleStop}>
                 <EditableImage src={content.heroBg} onChange={update('heroBg')} className="w-full h-full object-cover" />
               </DraggableWrapper>
               <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-start">
               <DraggableWrapper id="heroTitle" defaultPosition={positions['heroTitle']} onStop={handleStop}>
                 <EditableText as="h1" className="text-4xl md:text-6xl lg:text-7xl font-black text-white max-w-3xl leading-tight mb-6 drop-shadow-lg" value={content.heroTitle} onChange={update('heroTitle')} />
               </DraggableWrapper>
               <DraggableWrapper id="heroSubtitle" defaultPosition={positions['heroSubtitle']} onStop={handleStop}>
                 <EditableText as="p" className="text-lg lg:text-xl font-medium text-gray-200 max-w-xl mb-10 drop-shadow-md" value={content.heroSubtitle} onChange={update('heroSubtitle')} />
               </DraggableWrapper>
               <DraggableWrapper id="heroCta" defaultPosition={positions['heroCta']} onStop={handleStop}>
                 <EditableButton className={`px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform ${brBtn}`} value={content.heroCta} onChange={update('heroCta')} />
               </DraggableWrapper>
            </div>
          </section>
        )}

        {/* 3. FEATURED CATEGORIES */}
        <section className="w-full py-20 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <DraggableWrapper id="catTitle" defaultPosition={positions['catTitle']} onStop={handleStop}>
              <EditableText as="h2" className="text-3xl font-black text-gray-900" value={content.catTitle} onChange={update('catTitle')} />
            </DraggableWrapper>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[1, 2, 3].map(i => (
                <div key={i} className="relative aspect-[4/5] bg-gray-100 group overflow-hidden cursor-pointer">
                  <DraggableWrapper id={`cat${i}Img`} defaultPosition={positions[`cat${i}Img`]} onStop={handleStop}>
                    <EditableImage src={content[`cat${i}Img`]} onChange={update(`cat${i}Img`)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </DraggableWrapper>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 pointer-events-none">
                    <div className="pointer-events-auto w-full">
                       <DraggableWrapper id={`cat${i}Name`} defaultPosition={positions[`cat${i}Name`]} onStop={handleStop}>
                         <EditableText as="h3" className="text-2xl font-bold text-white mb-2" value={content[`cat${i}Name`]} onChange={update(`cat${i}Name`)} />
                       </DraggableWrapper>
                    </div>
                  </div>
                </div>
             ))}
          </div>
        </section>

        {/* 4. BEST SELLERS */}
        <section className="w-full py-20 px-6 lg:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <DraggableWrapper id="topSellTitle" defaultPosition={positions['topSellTitle']} onStop={handleStop}>
                <EditableText as="h2" className="text-3xl font-black text-gray-900" value={content.topSellTitle} onChange={update('topSellTitle')} />
              </DraggableWrapper>
              <button className="hidden md:block font-bold text-sm uppercase tracking-wider border-b-2" style={{ borderColor: primary }}>View All</button>
            </div>

            {/* Layout: grid */}
            {layoutStyle === 'grid' && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`flex flex-col group cursor-pointer`}>
                    <div className={`aspect-square bg-gray-200 mb-4 overflow-hidden relative ${brCard}`}>
                      <DraggableWrapper id={`prod${i}Img`} defaultPosition={positions[`prod${i}Img`]} onStop={handleStop}>
                        <EditableImage src={content[`prod${i}Img`]} onChange={update(`prod${i}Img`)} className="w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity" />
                      </DraggableWrapper>
                      {i === 1 && <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold uppercase px-2 py-1 tracking-wider">Bestseller</div>}
                    </div>
                    <DraggableWrapper id={`prod${i}Name`} defaultPosition={positions[`prod${i}Name`]} onStop={handleStop}>
                      <EditableText as="h4" className="font-bold text-gray-900 mb-1" value={content[`prod${i}Name`]} onChange={update(`prod${i}Name`)} />
                    </DraggableWrapper>
                    <DraggableWrapper id={`prod${i}Price`} defaultPosition={positions[`prod${i}Price`]} onStop={handleStop}>
                      <EditableText as="p" className="text-sm font-semibold" style={{ color: primary }} value={content[`prod${i}Price`]} onChange={update(`prod${i}Price`)} />
                    </DraggableWrapper>
                  </div>
                ))}
              </div>
            )}

            {/* Layout: list */}
            {layoutStyle === 'list' && (
              <div className="flex flex-col divide-y divide-gray-100">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center gap-6 py-5">
                    <div className={`w-20 h-20 overflow-hidden flex-shrink-0 ${brCard}`}>
                      <DraggableWrapper id={`prod${i}Img`} defaultPosition={positions[`prod${i}Img`]} onStop={handleStop}>
                        <EditableImage src={content[`prod${i}Img`]} onChange={update(`prod${i}Img`)} className="w-full h-full object-cover" />
                      </DraggableWrapper>
                    </div>
                    <div className="flex-1">
                      <DraggableWrapper id={`prod${i}Name`} defaultPosition={positions[`prod${i}Name`]} onStop={handleStop}>
                        <EditableText as="h4" className="font-bold text-gray-900 mb-1" value={content[`prod${i}Name`]} onChange={update(`prod${i}Name`)} />
                      </DraggableWrapper>
                      <DraggableWrapper id={`prod${i}Price`} defaultPosition={positions[`prod${i}Price`]} onStop={handleStop}>
                        <EditableText as="p" className="text-sm font-semibold" style={{ color: primary }} value={content[`prod${i}Price`]} onChange={update(`prod${i}Price`)} />
                      </DraggableWrapper>
                    </div>
                    <button className={`px-5 py-2 text-white text-sm font-bold ${brBtn}`} style={{ backgroundColor: primary }}>Buy</button>
                  </div>
                ))}
              </div>
            )}

            {/* Layout: masonry */}
            {layoutStyle === 'masonry' && (
              <div className="grid grid-cols-2 gap-4">
                {[[1,2],[3,4]].map((col, ci) => (
                  <div key={ci} className="flex flex-col gap-4">
                    {col.map((i, ii) => (
                      <div key={i} className={`overflow-hidden group cursor-pointer ${brCard}`} style={{ height: ii % 2 === 0 ? 300 : 200 }}>
                        <DraggableWrapper id={`prod${i}Img`} defaultPosition={positions[`prod${i}Img`]} onStop={handleStop}>
                          <EditableImage src={content[`prod${i}Img`]} onChange={update(`prod${i}Img`)} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                        </DraggableWrapper>
                        <div className="p-3">
                          <DraggableWrapper id={`prod${i}Name`} defaultPosition={positions[`prod${i}Name`]} onStop={handleStop}>
                            <EditableText as="h4" className="font-bold text-gray-900 text-sm mb-1" value={content[`prod${i}Name`]} onChange={update(`prod${i}Name`)} />
                          </DraggableWrapper>
                          <DraggableWrapper id={`prod${i}Price`} defaultPosition={positions[`prod${i}Price`]} onStop={handleStop}>
                            <EditableText as="p" className="text-xs font-semibold" style={{ color: primary }} value={content[`prod${i}Price`]} onChange={update(`prod${i}Price`)} />
                          </DraggableWrapper>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 5. PROMOTIONAL BANNER */}
        <section className="w-full h-[600px] relative flex items-center">
          <div className="absolute inset-0 z-0">
             <DraggableWrapper id="promoBg" defaultPosition={positions['promoBg']} onStop={handleStop}>
               <EditableImage src={content.promoBg} onChange={update('promoBg')} className="w-full h-full object-cover" />
             </DraggableWrapper>
             <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex justify-end">
             <div className="w-full md:w-[500px] bg-white p-10 lg:p-14 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: primary }}>Limited Time</p>
                <DraggableWrapper id="promoTitle" defaultPosition={positions['promoTitle']} onStop={handleStop}>
                  <EditableText as="h2" className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight" value={content.promoTitle} onChange={update('promoTitle')} />
                </DraggableWrapper>
                <DraggableWrapper id="promoSub" defaultPosition={positions['promoSub']} onStop={handleStop}>
                  <EditableText as="p" className="text-gray-600 font-medium mb-8 leading-relaxed" value={content.promoSub} onChange={update('promoSub')} />
                </DraggableWrapper>
                <DraggableWrapper id="promoCta" defaultPosition={positions['promoCta']} onStop={handleStop}>
                  <EditableButton className="px-8 py-4 text-white font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform w-full md:w-auto" style={{ backgroundColor: primary }} value={content.promoCta} onChange={update('promoCta')} />
                </DraggableWrapper>
             </div>
          </div>
        </section>

        {/* 6. NEW ARRIVALS */}
        <section className="w-full py-20 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <DraggableWrapper id="newTitle" defaultPosition={positions['newTitle']} onStop={handleStop}>
                <EditableText as="h2" className="text-3xl font-black text-gray-900" value={content.newTitle} onChange={update('newTitle')} />
              </DraggableWrapper>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
               {/* Reusing product 1-4 mocks for visual completeness but they represent new arrivals */}
               {[4, 3, 2, 1].map((i, index) => (
                 <div key={index} className="flex flex-col group cursor-pointer">
                   <div className="aspect-[3/4] bg-gray-200 mb-4 overflow-hidden relative">
                     <DraggableWrapper id={`prod${i}Img`} defaultPosition={positions[`prod${i}Img`]} onStop={handleStop}>
                       <EditableImage src={content[`prod${i}Img`]} onChange={update(`prod${i}Img`)} className="w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity" />
                     </DraggableWrapper>
                     {index === 0 && <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider">New</div>}
                   </div>
                   <DraggableWrapper id={`prod${i}Name`} defaultPosition={positions[`prod${i}Name`]} onStop={handleStop}>
                     <EditableText as="h4" className="font-bold text-gray-900 mb-1" value={content[`prod${i}Name`]} onChange={update(`prod${i}Name`)} />
                   </DraggableWrapper>
                   <DraggableWrapper id={`prod${i}Price`} defaultPosition={positions[`prod${i}Price`]} onStop={handleStop}>
                     <EditableText as="p" className="text-sm font-semibold text-gray-500" value={content[`prod${i}Price`]} onChange={update(`prod${i}Price`)} />
                   </DraggableWrapper>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* 7. TESTIMONIALS */}
        <section className="w-full py-20 px-6 lg:px-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
             <div className="mb-14 text-center">
               <DraggableWrapper id="testTitle" defaultPosition={positions['testTitle']} onStop={handleStop}>
                 <EditableText as="h2" className="text-3xl font-black text-gray-900" value={content.testTitle} onChange={update('testTitle')} />
               </DraggableWrapper>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-white p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                   <div className="flex text-yellow-400 mb-6 font-bold">
                     <Star size={16} fill="currentColor" />
                     <Star size={16} fill="currentColor" />
                     <Star size={16} fill="currentColor" />
                     <Star size={16} fill="currentColor" />
                     <Star size={16} fill="currentColor" />
                   </div>
                   <DraggableWrapper id={`test${i}Quote`} defaultPosition={positions[`test${i}Quote`]} onStop={handleStop}>
                     <EditableText as="p" className="text-lg font-serif italic text-gray-700 mb-6" value={content[`test${i}Quote`]} onChange={update(`test${i}Quote`)} />
                   </DraggableWrapper>
                   <div className="mt-auto">
                     <DraggableWrapper id={`test${i}Author`} defaultPosition={positions[`test${i}Author`]} onStop={handleStop}>
                       <EditableText as="p" className="font-bold text-sm tracking-wider uppercase text-gray-900" value={content[`test${i}Author`]} onChange={update(`test${i}Author`)} />
                     </DraggableWrapper>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* 8 & 9. NEWSLETTER & FOOTER */}
        <footer className="w-full bg-[#1A1D23] text-gray-300 pt-20 pb-10 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 border-b border-gray-800 pb-20">
              <div>
                <DraggableWrapper id="newsTitle" defaultPosition={positions['newsTitle']} onStop={handleStop}>
                  <EditableText as="h3" className="text-3xl font-black text-white mb-4" value={content.newsTitle} onChange={update('newsTitle')} />
                </DraggableWrapper>
                <DraggableWrapper id="newsSub" defaultPosition={positions['newsSub']} onStop={handleStop}>
                  <EditableText as="p" className="text-gray-400 mb-6" value={content.newsSub} onChange={update('newsSub')} />
                </DraggableWrapper>
                <div className="flex gap-2">
                  <input type="email" placeholder="Email address" className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-3 outline-none focus:border-white transition-colors" />
                  <button className="px-6 py-3 font-bold text-sm uppercase text-black transition-transform active:scale-95" style={{ backgroundColor: secondary }}>Subscribe</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Shop</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="hover:text-white cursor-pointer transition-colors">All Products</li>
                    <li className="hover:text-white cursor-pointer transition-colors">New Arrivals</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Best Sellers</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Sale</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">Support</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="hover:text-white cursor-pointer transition-colors">FAQ</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Shipping & Returns</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs">About</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="hover:text-white cursor-pointer transition-colors">Our Story</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Journal</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Stores</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
              <div className="font-black text-xl tracking-tighter uppercase text-white opacity-50">
                 {content.storeName?.text || content.storeName || 'VIMI'}
              </div>
              <DraggableWrapper id="footerDesc" defaultPosition={positions['footerDesc']} onStop={handleStop}>
                <EditableText as="p" className="text-center md:text-left max-w-sm" value={content.footerDesc} onChange={update('footerDesc')} />
              </DraggableWrapper>
              <div className="flex gap-4">
                 <span>IG</span>
                 <span>FB</span>
                 <span>TW</span>
              </div>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}
