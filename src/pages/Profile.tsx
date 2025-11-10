import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { User, Heart, History, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface SearchHistoryItem {
  id: string;
  query: string;
  results_count: number;
  top_match_score: number | null;
  created_at: string;
}

export default function Profile() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch favorites
        const { data: favData } = await supabase
          .from("favorites")
          .select("product_id")
          .eq("user_id", user.id);

        if (favData) {
          setFavoriteIds(favData.map((f) => f.product_id));
        }

        // Fetch search history
        const { data: historyData } = await supabase
          .from("search_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (historyData) {
          setSearchHistory(historyData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, [user]);

  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary-foreground/20 p-4 rounded-full">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Your Profile</h1>
                <p className="text-primary-foreground/90">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button variant="outline" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* Favorites Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-bold">Favorite Products</h2>
            <Badge variant="secondary">{favoriteProducts.length}</Badge>
          </div>

          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  You haven't saved any favorites yet
                </p>
                <Button onClick={() => navigate("/")}>Explore Products</Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Search History Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Search History</h2>
            <Badge variant="secondary">{searchHistory.length}</Badge>
          </div>

          {searchHistory.length > 0 ? (
            <div className="space-y-3">
              {searchHistory.map((item) => (
                <Card key={item.id} className="hover:shadow-soft transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">"{item.query}"</CardTitle>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{item.results_count} results</span>
                          {item.top_match_score && (
                            <span>
                              Best match: {(item.top_match_score * 100).toFixed(1)}%
                            </span>
                          )}
                          <span>{format(new Date(item.created_at), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Your search history will appear here
                </p>
                <Button onClick={() => navigate("/")}>Start Searching</Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
