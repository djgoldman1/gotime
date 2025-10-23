import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, X, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PreferenceSelectorProps {
  title: string;
  description: string;
  placeholder: string;
  options: Array<{ id: string; name: string; image?: string }>;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  enableSpotifySearch?: boolean;
  onSpotifyImport?: () => void;
  isImporting?: boolean;
}

export default function PreferenceSelector({
  title,
  description,
  placeholder,
  options,
  selectedIds = [],
  onSelectionChange,
  enableSpotifySearch = false,
  onSpotifyImport,
  isImporting = false,
}: PreferenceSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedIds);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [remoteArtistMap, setRemoteArtistMap] = useState<Map<string, { id: string; name: string; image?: string }>>(new Map());

  useEffect(() => {
    setSelected(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: spotifyResults = [], isLoading: isSearching } = useQuery<Array<{ id: string; name: string; image?: string }>>({
    queryKey: ["/api/spotify/search/artists", debouncedQuery],
    enabled: enableSpotifySearch && debouncedQuery.length > 0,
  });

  const displayOptions = enableSpotifySearch && searchQuery.length > 0 
    ? spotifyResults
    : options.filter((option) =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const toggleSelection = (id: string, artistData?: { id: string; name: string; image?: string }) => {
    const newSelected = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
    
    if (artistData && !selected.includes(id)) {
      setRemoteArtistMap(prev => new Map(prev).set(id, artistData));
    }
    
    console.log('Selection changed:', newSelected);
  };

  const isSelected = (id: string) => selected.includes(id);

  const getOptionForSelectedId = (id: string) => {
    const staticOption = options.find(o => o.id === id);
    if (staticOption) return staticOption;
    return remoteArtistMap.get(id) || { id, name: id };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {onSpotifyImport && (
          <Button
            variant="outline"
            onClick={onSpotifyImport}
            data-testid="button-spotify-import"
            className="shrink-0"
            disabled={isImporting}
          >
            {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isImporting ? "Importing..." : "Import from Spotify"}
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-preferences"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((id) => {
            const option = getOptionForSelectedId(id);
            return (
              <Badge
                key={id}
                variant="secondary"
                className="pl-3 pr-2 py-1"
                data-testid={`badge-selected-${id}`}
              >
                {option.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                  onClick={() => toggleSelection(id)}
                  data-testid={`button-remove-${id}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
        {displayOptions.length === 0 && searchQuery.length > 0 && !isSearching && (
          <div className="col-span-full text-center text-muted-foreground py-8">
            No results found for "{searchQuery}"
          </div>
        )}
        {displayOptions.map((option: { id: string; name: string; image?: string }) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer hover-elevate active-elevate-2 transition-all ${
              isSelected(option.id) ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => toggleSelection(option.id, option)}
            data-testid={`card-preference-${option.id}`}
          >
            <div className="flex items-center gap-3">
              {option.image && (
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <div className="font-medium">{option.name}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
