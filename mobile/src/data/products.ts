export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex';
  image: string;
  price: number;
  sizes: string[];
}

export const products: Product[] = [
  { id: 'p-mens-tee', name: "Men's Logo T-Shirt", description: 'Everyday tee in heavyweight organic cotton with the embroidered Waracle mark.', category: 'T-Shirts', gender: 'Men', image: 'tshirt-black', price: 24.99, sizes: ['XS','S','M','L','XL','XXL'] },
  { id: 'p-womens-tee', name: "Women's Logo T-Shirt", description: 'Tailored tee in soft combed cotton with the Waracle mark front and centre.', category: 'T-Shirts', gender: 'Women', image: 'tee-w-black', price: 24.99, sizes: ['XS','S','M','L','XL'] },
  { id: 'p-headset', name: 'Waracle Headset', description: 'Over-ear wireless headset with active noise cancellation and a 30 hour battery.', category: 'Headsets', gender: 'Unisex', image: 'headset', price: 59.99, sizes: ['One Size'] },
  { id: 'p-mens-shorts', name: "Men's Logo Shorts", description: 'Lightweight training shorts with a brushed inner and side pockets.', category: 'Shorts', gender: 'Men', image: 'shorts-black', price: 29.99, sizes: ['S','M','L','XL'] },
  { id: 'p-womens-shorts', name: "Women's Logo Shorts", description: 'High-rise shorts in soft French terry with an elastic waist.', category: 'Shorts', gender: 'Women', image: 'shorts-heather', price: 29.99, sizes: ['XS','S','M','L'] },
  { id: 'p-womens-white-tee', name: "Women's White T-Shirt", description: 'A crisp white tee in breathable cotton jersey with a tonal Waracle mark.', category: 'T-Shirts', gender: 'Women', image: 'tee-w-white', price: 24.99, sizes: ['XS','S','M','L','XL'] },
  { id: 'p-mens-grey-tee', name: "Men's Grey T-Shirt", description: 'A marl-grey tee with a soft hand feel and the embroidered Waracle mark.', category: 'T-Shirts', gender: 'Men', image: 'tshirt-grey', price: 24.99, sizes: ['S','M','L','XL','XXL'] },
  { id: 'p-cap', name: 'Waracle Cap', description: 'A six-panel cap in brushed cotton twill with an embroidered Waracle mark.', category: 'Accessories', gender: 'Unisex', image: 'cap', price: 19.99, sizes: ['One Size'] },
  { id: 'p-headset-premium', name: 'Waracle Premium Headset', description: 'The flagship headset: studio-grade drivers, adaptive ANC and a machined aluminium frame.', category: 'Headsets', gender: 'Unisex', image: 'headset', price: 79.99, sizes: ['One Size'] },
];
