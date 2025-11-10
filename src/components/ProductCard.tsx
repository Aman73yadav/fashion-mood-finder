import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product & { similarity?: number };
  rank?: number;
}

export const ProductCard = ({ product, rank }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) {
        setIsFavorite(false);
        return;
      }

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single();

      setIsFavorite(!!data);
    };

    checkFavorite();
  }, [user, product.id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", product.id);

        if (error) throw error;

        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Product removed from your favorites",
        });
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            product_id: product.id,
          });

        if (error) throw error;

        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Product saved to your favorites",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-hover transition-all duration-300 animate-fade-in bg-gradient-card">
      <CardHeader className="p-0">
        <div className="aspect-square bg-muted relative overflow-hidden group">
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
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={toggleFavorite}
            disabled={isLoading}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite ? "fill-accent text-accent" : ""
              }`}
            />
          </Button>
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
