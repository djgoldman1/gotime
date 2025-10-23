import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, X, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export interface PreferenceItem {
  id: string;
  name: string;
  image?: string;
}

interface PreferenceSelectorProps {
  title: string;
  description: string;
  placeholder: string;
  options: Array<PreferenceItem>;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[], itemsMap: Map<string, PreferenceItem>) => void;
  enableSpotifySearch?: boolean;
  onSpotifyImport?: () => void;
  isImporting?: boolean;
  hideBadges?: boolean;
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
  hideBadges = false,
}: PreferenceSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedIds);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [itemsMap, setItemsMap] = useState<Map<string, PreferenceItem>>(() => {
    const map = new Map<string, PreferenceItem>();
    options.forEach(option => map.set(option.id, option));
    return map;
  });
  const [selectedItemsData, setSelectedItemsData] = useState<Map<string, PreferenceItem>>(new Map());

  useEffect(() => {
    setSelected(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    const map = new Map<string, PreferenceItem>();
    options.forEach(option => map.set(option.id, option));
    setItemsMap(map);
  }, [options]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: spotifyResults = [], isLoading: isSearching } = useQuery<Array<{ id: string; name: string; image?: string }>>({
    queryKey: ["/api/spotify/search/artists", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const res = await fetch(`/api/spotify/search/artists?query=${encodeURIComponent(debouncedQuery)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
      return res.json();
    },
    enabled: enableSpotifySearch && debouncedQuery.length > 0,
  });

  const displayOptions = enableSpotifySearch && searchQuery.length > 0 
    ? spotifyResults
    : options.filter((option) =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Create a stable combined map that includes options, Spotify results, selected items data
  const allItemsMap = useMemo(() => {
    const combined = new Map(itemsMap);
    // Add Spotify results to the map
    spotifyResults.forEach(result => {
      combined.set(result.id, result);
    });
    // Add selected items data (persists even when search changes)
    selectedItemsData.forEach((item, id) => {
      combined.set(id, item);
    });
    return combined;
  }, [itemsMap, spotifyResults, selectedItemsData]);

  const toggleSelection = (id: string, itemData?: PreferenceItem) => {
    const isCurrentlySelected = selected.includes(id);
    const newSelected = isCurrentlySelected
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setSelected(newSelected);
    
    // Track selected items' data persistently
    if (!isCurrentlySelected && itemData) {
      setSelectedItemsData(prev => new Map(prev).set(id, itemData));
    } else if (isCurrentlySelected) {
      setSelectedItemsData(prev => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
    }
    
    // Update the items map if we have new data
    if (itemData && !itemsMap.has(id)) {
      setItemsMap(prev => new Map(prev).set(id, itemData));
    }
    
    // Pass both IDs and the full items map to parent
    const currentMap = new Map(allItemsMap);
    if (itemData && !currentMap.has(id)) {
      currentMap.set(id, itemData);
    }
    
    onSelectionChange?.(newSelected, currentMap);
  };

  const isSelected = (id: string) => selected.includes(id);

  const getOptionForSelectedId = (id: string) => {
    return allItemsMap.get(id) || { id, name: id };
  };

  const isSpotifyImportEnabled = import.meta.env.VITE_ENABLE_SPOTIFY_IMPORT === 'true';

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {onSpotifyImport && isSpotifyImportEnabled && (
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

      {!hideBadges && selected.length > 0 && (
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
        {displayOptions.map((option: { id: string; name: string; image?: string }) => {
          const selected = isSelected(option.id);
          return (
            <Card
              key={option.id}
              className={`p-4 cursor-pointer hover-elevate active-elevate-2 transition-all ${
                selected ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => !selected && toggleSelection(option.id, option)}
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
                {hideBadges && selected && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(option.id);
                    }}
                    data-testid={`button-remove-card-${option.id}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
