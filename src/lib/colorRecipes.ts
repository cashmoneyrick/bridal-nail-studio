export interface RecipeColor {
  name: string;
  code: string;
  hex: string;
}

export interface ColorRecipe {
  colors: RecipeColor[];
  brand: string;
  technique_notes?: string;
  finger_assignments?: Record<string, string>;
}

const colorRecipes: Record<string, ColorRecipe> = {
  "1": {
    colors: [
      { name: "Soft Petal Pink", code: "GP-201", hex: "#E8B4B8" },
      { name: "Rose Quartz Shimmer", code: "GP-217", hex: "#D4A0A7" },
      { name: "Blush Cream", code: "GP-104", hex: "#F2D9D5" },
    ],
    brand: "Apres Gel-X",
    technique_notes: "Two coats base, shimmer on ring finger only",
    finger_assignments: { thumb: "GP-201", index: "GP-201", middle: "GP-217", ring: "GP-217", pinky: "GP-104" },
  },
  "4": {
    colors: [
      { name: "Sakura Soft", code: "GP-188", hex: "#F4C2C2" },
      { name: "Petal White", code: "GP-100", hex: "#FDF5F0" },
      { name: "Blossom Mauve", code: "GP-222", hex: "#C9929D" },
      { name: "Branch Brown", code: "GP-340", hex: "#8B6F5E" },
    ],
    brand: "Apres Gel-X",
    technique_notes: "Hand-painted floral art on index and ring fingers",
    finger_assignments: { thumb: "GP-188", index: "GP-188", middle: "GP-100", ring: "GP-222", pinky: "GP-188" },
  },
};

export function getColorRecipe(productId: string): ColorRecipe | null {
  return colorRecipes[productId] ?? null;
}
