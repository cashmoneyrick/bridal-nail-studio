// Product types and data (local, no Shopify dependency)

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  price: number;
  currencyCode: string;
  images: string[];
  variants: ProductVariant[];
  options: ProductOption[];
  // Fix 7: Add optional customization data for custom studio orders
  customizationData?: Record<string, unknown>;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  currencyCode: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
}

export interface ProductOption {
  name: string;
  values: string[];
}

// Sample products for display - replace with your own data or database
export const sampleProducts: Product[] = [
  {
    id: "1",
    title: "Rose Quartz Dreams",
    description: "Elegant soft pink press-on nails with a subtle shimmer finish. Perfect for everyday wear or special occasions.",
    handle: "rose-quartz-dreams",
    price: 32.00,
    currencyCode: "USD",
    images: ["/placeholder.svg"],
    variants: [
      {
        id: "v1",
        title: "Default",
        price: 32.00,
        currencyCode: "USD",
        availableForSale: true,
        selectedOptions: []
      }
    ],
    options: []
  },
  {
    id: "2",
    title: "Midnight Luxe",
    description: "Deep black glossy nails with gold flake accents. Make a bold statement with this stunning set.",
    handle: "midnight-luxe",
    price: 38.00,
    currencyCode: "USD",
    images: ["/placeholder.svg"],
    variants: [
      {
        id: "v2",
        title: "Default",
        price: 38.00,
        currencyCode: "USD",
        availableForSale: true,
        selectedOptions: []
      }
    ],
    options: []
  },
  {
    id: "3",
    title: "French Elegance",
    description: "Classic French tip design with a modern twist. Timeless beauty for any occasion.",
    handle: "french-elegance",
    price: 28.00,
    currencyCode: "USD",
    images: ["/placeholder.svg"],
    variants: [
      {
        id: "v3",
        title: "Default",
        price: 28.00,
        currencyCode: "USD",
        availableForSale: true,
        selectedOptions: []
      }
    ],
    options: []
  },
  {
    id: "4",
    title: "Cherry Blossom",
    description: "Delicate floral design inspired by spring cherry blossoms. Soft pink base with hand-painted flowers.",
    handle: "cherry-blossom",
    price: 42.00,
    currencyCode: "USD",
    images: ["/placeholder.svg"],
    variants: [
      {
        id: "v4",
        title: "Default",
        price: 42.00,
        currencyCode: "USD",
        availableForSale: true,
        selectedOptions: []
      }
    ],
    options: []
  }
];

// Helper functions
export function getProducts(): Product[] {
  return sampleProducts;
}

export function getProductByHandle(handle: string): Product | undefined {
  return sampleProducts.find(p => p.handle === handle);
}
