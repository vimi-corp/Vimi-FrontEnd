const fs = require('fs');

function updateStructuredCompleteStore() {
  const path = 'c:\\Users\\Daxus\\OneDrive\\Desktop\\vimi-frontend\\src\\components\\StructuredCompleteStore.jsx';
  let content = fs.readFileSync(path, 'utf8');

  if (!content.includes('import Draggable from \'react-draggable\';')) {
    const importsRegex = /(import \{ EditableText, EditableImage, EditableButton \} from '\.\/EditableElements';)/;
    const wrapperDefinition = `
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
`;
    content = content.replace(importsRegex, `$1\n${wrapperDefinition}`);

    content = content.replace(
      'const content = { ...template.defaultContent, ...overrides };\n\n  // Helper to handle override changes easily\n  const update = (key) => (val) => onOverrideChange(key, val);',
      `const content = { ...template.defaultContent, ...overrides };\n  const positions = overrides?.positions || {};\n\n  const handleStop = (id, pos) => {\n    onOverrideChange('positions', { ...positions, [id]: pos });\n  };\n\n  // Helper to handle override changes easily\n  const update = (key) => (val) => onOverrideChange(key, val);`
    );

    content = content.replace(
      /<(EditableText|EditableImage|EditableButton)([\s\S]*?)onChange=\{update\('([^']+)'\)\}([\s\S]*?)\/>/g,
      (match, p1, p2, p3, p4) => {
        return `<DraggableWrapper id="${p3}" defaultPosition={positions['${p3}']} onStop={handleStop}>\n<${p1}${p2}onChange={update('${p3}')}${p4}/>\n</DraggableWrapper>`;
      }
    );

    content = content.replace(
      /<(EditableText|EditableImage|EditableButton)([\s\S]*?)onChange=\{update\(\`([^`]+)\`\)\}([\s\S]*?)\/>/g,
      (match, p1, p2, p3, p4) => {
        return `<DraggableWrapper id={\`${p3}\`} defaultPosition={positions[\`${p3}\`]} onStop={handleStop}>\n<${p1}${p2}onChange={update(\`${p3}\`)}${p4}/>\n</DraggableWrapper>`;
      }
    );

    fs.writeFileSync(path, content);
    console.log('StructuredCompleteStore updated!');
  }
}

function updateMockTemplates() {
  const path = 'c:\\Users\\Daxus\\OneDrive\\Desktop\\vimi-frontend\\src\\pages\\onboarding\\mockTemplates.js';
  let content = fs.readFileSync(path, 'utf8');

  // 1. Replace BASE_DEFAULT_CONTENT
  const baseContentRegex = /const BASE_DEFAULT_CONTENT = \{[\s\S]*?\]\n\};/;
  const completeStoreContent = `const BASE_DEFAULT_CONTENT = {
  storeName: 'VIMI LUXE',
  heroTitle: 'Elevate Your Everyday.',
  heroSubtitle: 'Discover our curated collection of premium essentials designed for modern living. Crafted with intention and sustainable materials.',
  heroCta: 'Shop Collection',
  heroBg: 'https://picsum.photos/seed/complete-hero/1600/900',
  catTitle: 'Featured Categories',
  cat1Img: 'https://picsum.photos/seed/cat1/600/800',
  cat1Name: 'Modern Furniture',
  cat2Img: 'https://picsum.photos/seed/cat2/600/800',
  cat2Name: 'Lighting & Decor',
  cat3Img: 'https://picsum.photos/seed/cat3/600/800',
  cat3Name: 'Textiles & Rugs',
  topSellTitle: 'Best Sellers',
  prod1Img: 'https://picsum.photos/seed/prod1/500/500', prod1Name: 'Lounge Chair', prod1Price: '$499',
  prod2Img: 'https://picsum.photos/seed/prod2/500/500', prod2Name: 'Ceramic Vase', prod2Price: '$48',
  prod3Img: 'https://picsum.photos/seed/prod3/500/500', prod3Name: 'Table Lamp', prod3Price: '$125',
  prod4Img: 'https://picsum.photos/seed/prod4/500/500', prod4Name: 'Linen Throw', prod4Price: '$89',
  promoBg: 'https://picsum.photos/seed/promo/1400/600',
  promoTitle: 'Mid-Season Sale',
  promoSub: 'Up to 40% off selected lifestyle pieces. Refresh your space for the new season.',
  promoCta: 'Shop Further Reductions',
  newTitle: 'New Arrivals',
  testTitle: 'What our customers say',
  test1Quote: '"The quality of these pieces completely transformed my living room!"', test1Author: 'Sarah J.',
  test2Quote: '"Fast shipping and incredibly helpful customer support."', test2Author: 'Michael P.',
  test3Quote: '"I keep coming back for all my home decor needs."', test3Author: 'Emily R.',
  newsTitle: 'Join the club',
  newsSub: 'Sign up for our newsletter and get 10% off your first order.',
  footerDesc: 'Curating the world’s most beautiful lifestyle goods since 2026. Designed with purpose.'
};`;
  content = content.replace(baseContentRegex, completeStoreContent);

  // 2. Replace tmpl_complete_store defaultContent: { ... } with defaultContent: { ...BASE_DEFAULT_CONTENT }
  const completeStoreDefaultContentRegex = /defaultContent: \{\n\s*storeName: 'VIMI LUXE',[\s\S]*?footerDesc:[^\n]*\n\s*\}/;
  content = content.replace(completeStoreDefaultContentRegex, 'defaultContent: { ...BASE_DEFAULT_CONTENT }');

  // 3. Move tmpl_complete_store to the top of the MOCK_TEMPLATES array
  // It's currently at index 1 after tmpl_nike_dynamic
  const nikeObjRegex = /\{\n\s*id: 'tmpl_nike_dynamic',[\s\S]*?productImages: \['nike1', 'nike2', 'nike3'\]\n\s*\}\n\s*\},/g;
  let nikeMatch = content.match(nikeObjRegex);
  
  if (nikeMatch && content.indexOf('tmpl_nike_dynamic') < content.indexOf('tmpl_complete_store')) {
    // We can swap them by finding their string blocks. Since this can be fragile, let's just do a specific manual replace.
    // Instead of regex, just find the string.
    let textToFindNike = `  {
    id: 'tmpl_nike_dynamic',
    name: 'Nike Dynamic',
    category: 'Sports',
    thumbnail: 'https://picsum.photos/seed/nike/400/600',
    primaryColor: '#ff5733',
    defaultContent: {
      heroTitle: 'JUST DO IT',
      heroSubtitle: 'Explore the new collection',
      productImages: ['nike1', 'nike2', 'nike3']
    }
  },`;
    let textToFindComplete = `  {
    id: 'tmpl_complete_store',
    name: 'Complete Store',
    category: 'E-commerce',
    thumbnail: 'https://picsum.photos/seed/complete-store-thumb/800/560',
    previewImages: [
      'https://picsum.photos/seed/complete-store-p1/600/900',
      'https://picsum.photos/seed/complete-store-p2/600/900',
    ],
    primaryColor: '#1A1D23',
    accentColor: '#F8F9FA',
    colorSchemes: [...DEFAULT_COLOR_SCHEMES],
    fontOptions: [...DEFAULT_FONT_OPTIONS],
    defaultContent: { ...BASE_DEFAULT_CONTENT },
    description: 'A fully-featured, responsive e-commerce template out of the box with robust grid sections and native components built in.',
    tags: ['Complete', 'Grid', 'Store'],
    popular: true,
    isNew: true,
    featured: true,
  },`;
    content = content.replace(textToFindNike + '\\n' + textToFindComplete, textToFindComplete + '\\n' + textToFindNike);
    // If not adjacent, just remove Nike and append it after Complete Store.
    if (content.indexOf(textToFindComplete) > content.indexOf(textToFindNike)) {
       content = content.replace(textToFindNike + '\n', '');
       content = content.replace(textToFindComplete, textToFindComplete + '\n' + textToFindNike);
    }
  }

  // Final check to make sure export const MOCK_TEMPLATES starts with complete store.
  fs.writeFileSync(path, content);
  console.log('mockTemplates updated!');
}

try {
  updateStructuredCompleteStore();
  updateMockTemplates();
} catch (e) {
  console.error(e);
}
