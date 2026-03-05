import { getColorRecipe } from "@/lib/colorRecipes";

function darkenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00ff) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0x0000ff) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

interface ColorRecipeProps {
  productId: string;
}

const ColorRecipe = ({ productId }: ColorRecipeProps) => {
  const recipe = getColorRecipe(productId);
  if (!recipe) return null;

  return (
    <section className="mt-16 mb-4">
      <div className="mb-6">
        <div className="w-12 h-px bg-primary/30 mb-3" />
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">
          Color Recipe
        </h2>
      </div>

      <div className="bg-secondary/5 rounded-xl p-6 sm:p-8 max-w-md">
        <div className="space-y-3">
          {recipe.colors.map((color, index) => (
            <div key={index} className="flex items-center gap-3">
              <span
                className="inline-block w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: color.hex,
                  border: `1px solid ${darkenHex(color.hex, 0.15)}`,
                }}
                aria-hidden="true"
              />
              <span className="text-sm text-foreground">{color.name}</span>
              <span className="text-muted-foreground/50">&mdash;</span>
              <span className="text-sm text-muted-foreground">{color.code}</span>
            </div>
          ))}
        </div>

        <p className="mt-5 pt-4 border-t border-border/20 text-xs text-muted-foreground italic">
          {recipe.brand}
        </p>
      </div>
    </section>
  );
};

export default ColorRecipe;
