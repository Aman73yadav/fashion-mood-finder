import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  id: string;
  name: string;
  description: string;
  vibes: string[];
  price: number;
}

interface EmbeddingResponse {
  data: Array<{ embedding: number[] }>;
}

// Compute cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Generate embedding using Lovable AI
async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Embedding API error:', response.status, error);
    throw new Error(`Failed to generate embedding: ${response.status}`);
  }

  const data: EmbeddingResponse = await response.json();
  return data.data[0].embedding;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, products } = await req.json();
    
    if (!query || !products) {
      return new Response(
        JSON.stringify({ error: 'Missing query or products' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing vibe query:', query);
    const startTime = performance.now();

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query, LOVABLE_API_KEY);
    
    // Generate embeddings for all products and compute similarities
    const results = await Promise.all(
      products.map(async (product: Product) => {
        const productText = `${product.name}. ${product.description}. Vibes: ${product.vibes.join(', ')}`;
        const productEmbedding = await generateEmbedding(productText, LOVABLE_API_KEY);
        const similarity = cosineSimilarity(queryEmbedding, productEmbedding);
        
        return {
          ...product,
          similarity: Math.round(similarity * 1000) / 1000, // Round to 3 decimals
        };
      })
    );

    // Sort by similarity (highest first) and get top 3
    const topMatches = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3);

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    console.log(`Processed in ${latency}ms. Top match: ${topMatches[0].name} (${topMatches[0].similarity})`);

    return new Response(
      JSON.stringify({ 
        matches: topMatches,
        latency,
        queryEmbeddingSize: queryEmbedding.length,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in vibe-matcher:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
