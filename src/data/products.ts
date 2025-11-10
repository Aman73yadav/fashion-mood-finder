export interface Product {
  id: string;
  name: string;
  description: string;
  vibes: string[];
  price: number;
  imageUrl: string;
}

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

export const products: Product[] = [
  {
    id: "1",
    name: "Bohemian Sunset Dress",
    description: "Flowy maxi dress in warm earthy tones with intricate patterns. Perfect for festival vibes and carefree summer days. Features bell sleeves and a cinched waist for a flattering silhouette.",
    vibes: ["boho", "festival", "relaxed", "artistic"],
    price: 89.99,
    imageUrl: product1
  },
  {
    id: "2",
    name: "Urban Edge Leather Jacket",
    description: "Sleek black leather jacket with asymmetric zipper and silver hardware. Epitomizes energetic urban chic with a rebellious edge. Pairs perfectly with everything from dresses to jeans.",
    vibes: ["edgy", "urban", "bold", "modern"],
    price: 249.99,
    imageUrl: product2
  },
  {
    id: "3",
    name: "Cozy Cashmere Sweater",
    description: "Luxuriously soft oversized cashmere in warm cream. Ultimate comfort meets sophisticated simplicity. Perfect for cozy winter days and elegant lounging.",
    vibes: ["cozy", "elegant", "minimalist", "comfort"],
    price: 179.99,
    imageUrl: product3
  },
  {
    id: "4",
    name: "Athletic Flow Joggers",
    description: "Technical fabric joggers in sleek navy with reflective details. Combines athletic performance with street style sensibility. Moisture-wicking and incredibly versatile.",
    vibes: ["sporty", "energetic", "modern", "casual"],
    price: 68.99,
    imageUrl: product4
  },
  {
    id: "5",
    name: "Vintage Romance Blouse",
    description: "Delicate lace blouse in soft blush with pearl buttons. Channels vintage femininity with a contemporary twist. Features romantic puff sleeves and intricate detailing.",
    vibes: ["romantic", "vintage", "feminine", "elegant"],
    price: 94.99,
    imageUrl: product5
  },
  {
    id: "6",
    name: "Minimalist Linen Pants",
    description: "High-waisted linen trousers in natural beige. Clean lines and breathable fabric embody effortless sophistication. Perfect for warm weather and refined casual looks.",
    vibes: ["minimalist", "elegant", "natural", "sophisticated"],
    price: 112.99,
    imageUrl: product6
  },
  {
    id: "7",
    name: "Neon Statement Windbreaker",
    description: "Bold neon yellow windbreaker with geometric panels. Makes an energetic statement perfect for urban adventures. Water-resistant and impossible to miss.",
    vibes: ["bold", "energetic", "sporty", "urban"],
    price: 79.99,
    imageUrl: product7
  },
  {
    id: "8",
    name: "Artisan Knit Cardigan",
    description: "Hand-knit cardigan in rich terracotta with wooden buttons. Artisanal craftsmanship meets bohemian warmth. Each piece is unique with slight variations in pattern.",
    vibes: ["boho", "artisan", "cozy", "unique"],
    price: 134.99,
    imageUrl: product8
  }
];
