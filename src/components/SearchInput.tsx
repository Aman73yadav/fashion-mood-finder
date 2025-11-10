import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export const SearchInput = ({ value, onChange, onSearch, loading }: SearchInputProps) => {
  return (
    <div className="flex gap-3 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Describe your vibe... (e.g., 'energetic urban chic')"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && onSearch()}
          className="pl-10 h-12 text-base"
        />
      </div>
      <Button 
        onClick={onSearch} 
        disabled={loading || !value.trim()}
        className="h-12 px-8"
        size="lg"
      >
        {loading ? 'Matching...' : 'Find Matches'}
      </Button>
    </div>
  );
};
