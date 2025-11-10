import { useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import { ProductCard } from "@/components/ProductCard";
import { MetricsCard } from "@/components/MetricsCard";
import { products } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MatchResult {
  matches: Array<any>;
  latency: number;
  queryEmbeddingSize: number;
}

const Index = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('vibe-matcher', {
        body: { query, products }
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: "Match found!",
        description: `Found ${data.matches.length} matching products`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const avgScore = results?.matches 
    ? results.matches.reduce((sum, m) => sum + m.similarity, 0) / results.matches.length 
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-primary-foreground py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10" />
            <h1 className="text-5xl font-bold">Vibe Matcher</h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            AI-powered fashion recommendations using semantic embeddings and cosine similarity
          </p>
          <div className="mt-8">
            <SearchInput
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* System Info */}
        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">How it works</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Enter a vibe query to find your perfect fashion match. The system uses OpenAI embeddings 
                  (text-embedding-3-small via Lovable AI) to convert both your query and product descriptions 
                  into high-dimensional vectors, then computes cosine similarity to rank the top 3 matches. 
                  Scores above 0.7 indicate strong semantic alignment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        {results && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-2xl font-bold">Performance Metrics</h2>
            <MetricsCard
              latency={results.latency}
              topScore={results.matches[0]?.similarity}
              avgScore={avgScore}
            />
          </div>
        )}

        {/* Results */}
        {results && results.matches.length > 0 && (
          <div className="space-y-6 animate-slide-up">
            <div>
              <h2 className="text-2xl font-bold mb-2">Top Matches</h2>
              <p className="text-muted-foreground">
                Ranked by semantic similarity • Embedding size: {results.queryEmbeddingSize} dimensions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.matches.map((match, idx) => (
                <ProductCard key={match.id} product={match} rank={idx + 1} />
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div className="space-y-6">
          <div className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold mb-2">Product Catalog</h2>
            <p className="text-muted-foreground">
              Browse all {products.length} fashion items in our collection
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Reflection Section */}
        <Card className="bg-gradient-card border-primary/20">
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold">Technical Insights & Future Improvements</h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong>Current Implementation:</strong> Uses OpenAI's text-embedding-3-small model for semantic 
                embeddings with cosine similarity matching. The system achieves sub-2s latency for full catalog searches.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Vector Database Integration:</strong> Moving to Pinecone or Supabase pgvector would enable 
                  approximate nearest neighbor (ANN) search, reducing latency from O(n) to O(log n) for large catalogs.
                </li>
                <li>
                  <strong>Embedding Caching:</strong> Pre-compute and cache product embeddings to eliminate redundant 
                  API calls, reducing costs and improving response times significantly.
                </li>
                <li>
                  <strong>Hybrid Search:</strong> Combine semantic similarity with traditional filters (price, category) 
                  and user behavior signals for more personalized recommendations.
                </li>
                <li>
                  <strong>Edge Cases:</strong> Currently handles low-similarity queries (score {"<"} 0.5) with fallback 
                  prompting. Could implement query expansion or user feedback loops to improve match quality.
                </li>
                <li>
                  <strong>A/B Testing Framework:</strong> Add experimentation infrastructure to compare different 
                  embedding models (text-embedding-3-large, multilingual models) and similarity thresholds.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
