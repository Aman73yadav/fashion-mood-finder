import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product & { similarity?: number };
  rank?: number;
}

export const ProductCard = ({ product, rank }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 animate-fade-in bg-gradient-card">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {rank !== undefined && (
            <div className="absolute top-4 right-4 bg-accent text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
              #{rank}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {product.vibes.map((vibe) => (
              <Badge key={vibe} variant="secondary" className="text-xs">
                {vibe}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.similarity !== undefined && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Match Score</div>
                <div className="text-lg font-semibold text-primary">
                  {(product.similarity * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
