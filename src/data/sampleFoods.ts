// Curated gourmet dishes with culinary illustrations for instant preview

export interface SampleMeal {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  description: string;
  svgDataUrl: string;
  chefCues: string;
}

// Sophisticated culinary visual representation
const createCulinaryPlatterSvg = (
  plateAccent: string,
  rimColor: string,
  title: string,
  subtitle: string,
  emojiArr: string[],
  chefGarnish: string
) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
    <defs>
      <!-- Rustic Linen / Table Surface -->
      <linearGradient id="tableSurface" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fdfbf7"/>
        <stop offset="50%" stopColor="#f5efe6"/>
        <stop offset="100%" stopColor="#ece2d0"/>
      </linearGradient>

      <!-- Artisan Ceramic Plate Gradient -->
      <radialGradient id="ceramicPlate" cx="45%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="65%" stopColor="#f8f6f0"/>
        <stop offset="90%" stopColor="#eee9df"/>
        <stop offset="100%" stopColor="#e0d6c5"/>
      </radialGradient>

      <radialGradient id="plateInnerRim" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
        <stop offset="70%" stopColor="#faf6ee" stopOpacity="0.95"/>
        <stop offset="100%" stopColor="#ebe3d3"/>
      </radialGradient>

      <!-- Deep Organic Drop Shadow -->
      <filter id="softGourmetShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="14"/>
        <feOffset dx="0" dy="18" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.16"/>
        </feComponentTransfer>
        <feMerge> 
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- Warm Sun Glow -->
      <radialGradient id="morningLight" cx="15%" cy="10%" r="70%">
        <stop offset="0%" stopColor="#fff8ed" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <!-- Table Mat / Slate Counter -->
    <rect width="640" height="420" fill="url(#tableSurface)"/>
    <rect width="640" height="420" fill="url(#morningLight)"/>

    <!-- Subtle Table Grid Texture -->
    <pattern id="linenWeave" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e6dcce" stroke-width="0.75" stroke-opacity="0.4"/>
    </pattern>
    <rect width="640" height="420" fill="url(#linenWeave)"/>

    <!-- Artisan Ceramic Plate -->
    <circle cx="320" cy="195" r="148" fill="url(#ceramicPlate)" filter="url(#softGourmetShadow)"/>
    <circle cx="320" cy="195" r="147" fill="none" stroke="${rimColor}" stroke-width="2.5" stroke-opacity="0.65"/>
    <circle cx="320" cy="195" r="132" fill="none" stroke="#d5c8b5" stroke-width="1.2" stroke-dasharray="3,3"/>
    
    <!-- Plate Basin -->
    <circle cx="320" cy="195" r="118" fill="url(#plateInnerRim)"/>
    <circle cx="320" cy="195" r="116" fill="none" stroke="${plateAccent}" stroke-width="1.5" stroke-opacity="0.4"/>

    <!-- Culinary Food Component Emojis Plated Elegantly -->
    <g transform="translate(320, 195)">
      <!-- Main Center Protein/Base -->
      <text x="0" y="5" font-size="64" text-anchor="middle" dominant-baseline="middle">${emojiArr[0] || '🥑'}</text>
      <!-- Sides & Garnishes arranged artfully around plate -->
      <text x="-48" y="-36" font-size="34" text-anchor="middle">${emojiArr[1] || '🍳'}</text>
      <text x="50" y="-32" font-size="32" text-anchor="middle">${emojiArr[2] || '🍅'}</text>
      <text x="44" y="44" font-size="30" text-anchor="middle">${emojiArr[3] || '🌿'}</text>
      <text x="-46" y="42" font-size="28" text-anchor="middle">${emojiArr[4] || '🍋'}</text>
    </g>

    <!-- Chef Garnish Text Stamp -->
    <text x="320" y="325" font-family="'Georgia', serif" font-style="italic" font-size="12" fill="#786a58" text-anchor="middle" letter-spacing="1">
      ${chefGarnish}
    </text>

    <!-- Bottom Recipe Banner -->
    <rect x="50" y="345" width="540" height="56" rx="14" fill="#26211c" filter="url(#softGourmetShadow)"/>
    <text x="320" y="368" font-family="'Georgia', serif" font-weight="700" font-size="16" fill="#fcf9f2" text-anchor="middle" letter-spacing="0.5">
      ${title}
    </text>
    <text x="320" y="388" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="12" fill="#d4c3aa" text-anchor="middle">
      ${subtitle}
    </text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const SAMPLE_MEALS: SampleMeal[] = [
  {
    id: 'sample-avocado-toast',
    name: 'Artisan Avocado Toast & Poached Egg',
    category: 'Breakfast',
    calories: 420,
    description: 'Rustic sourdough toast with crushed Hass avocado, poached farm egg, heirloom cherry tomatoes, and micro greens',
    chefCues: 'Extra virgin olive oil drizzle · Maldon sea salt · Aleppo chili flakes',
    svgDataUrl: createCulinaryPlatterSvg(
      '#4d7c0f',
      '#a3b18a',
      'Avocado Tartine with Poached Egg',
      'Sourdough · Hass Avocado · Farm Egg · Vine Tomatoes · Microgreens',
      ['🥑', '🍳', '🍞', '🍅', '🌿'],
      'Cold-Pressed Olive Oil · Maldon Salt · Crushed Red Pepper'
    ),
  },
  {
    id: 'sample-salmon-bowl',
    name: 'Pan-Seared Wild Salmon Harvest Bowl',
    category: 'Dinner',
    calories: 620,
    description: 'Crisp Atlantic salmon fillet over warm fluffy quinoa, tender steamed broccoli florets, and roasted sweet potatoes',
    chefCues: 'Meyer lemon squeeze · Toasted sesame seeds · Herb tahini dressing',
    svgDataUrl: createCulinaryPlatterSvg(
      '#ea580c',
      '#ddb892',
      'Wild Salmon Harvest Quinoa Bowl',
      'Atlantic Salmon · Organic Quinoa · Steamed Broccoli · Sweet Potato',
      ['🐟', '🥦', '🍠', '🍋', '🌿'],
      'Lemon-Dill Reduction · Fluffy Quinoa · Roasted Sesame'
    ),
  },
  {
    id: 'sample-greek-salad',
    name: 'Mediterranean Grilled Chicken Salad',
    category: 'Lunch',
    calories: 490,
    description: 'Herb-marinated grilled chicken breast over crisp Romaine, Persian cucumbers, kalamata olives, and crumbly feta',
    chefCues: 'Oregano vinaigrette · Sun-ripened olives · Fresh lemon zest',
    svgDataUrl: createCulinaryPlatterSvg(
      '#0284c7',
      '#b7b7a4',
      'Mediterranean Grilled Chicken Salad',
      'Chicken Breast · Crumbled Feta · Kalamata Olives · Garden Greens',
      ['🍗', '🧀', '🥗', '🫒', '🥒'],
      'Wild Greek Oregano · Cold-Pressed Oil · Barrel-Aged Feta'
    ),
  },
  {
    id: 'sample-berry-oatmeal',
    name: 'Vanilla Bean & Wild Berry Superbowl',
    category: 'Breakfast',
    calories: 390,
    description: 'Slow-cooked steel cut rolled oats with whey protein, plump wild blueberries, sliced banana, and toasted chia seeds',
    chefCues: 'Raw honey swirl · Roasted almond slivers · Ceylon cinnamon',
    svgDataUrl: createCulinaryPlatterSvg(
      '#7c3aed',
      '#d4a373',
      'Wild Berry & Chia Protein Oatmeal',
      'Rolled Oats · Vanilla Whey · Wild Blueberries · Chia Seeds',
      ['🥣', '🫐', '🍌', '🍓', '🥜'],
      'Ceylon Cinnamon · Raw Honey Drizzle · Golden Flax'
    ),
  },
];
