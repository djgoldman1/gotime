import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import PreferenceSelector from "@/components/PreferenceSelector";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface TastesProps {
  userId: string;
}

interface UserPreference {
  id: number;
  userId: string;
  type: "team" | "artist" | "venue";
  itemId: string;
  itemName: string;
}

export default function Tastes({ userId }: TastesProps) {
  const { toast } = useToast();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);

  const { data: preferences = [], isLoading } = useQuery<UserPreference[]>({
    queryKey: [`/api/user/${userId}/preferences`],
  });

  useEffect(() => {
    if (preferences.length > 0) {
      setSelectedTeams(preferences.filter(p => p.type === "team").map(p => p.itemName));
      setSelectedArtists(preferences.filter(p => p.type === "artist").map(p => p.itemName));
      setSelectedVenues(preferences.filter(p => p.type === "venue").map(p => p.itemName));
    }
  }, [preferences]);

  const addPreferenceMutation = useMutation({
    mutationFn: async ({ type, itemId, itemName }: { type: string; itemId: string; itemName: string }) => {
      return await apiRequest("POST", `/api/user/${userId}/preferences`, { type, itemId, itemName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/preferences`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/recommended-events`] });
    },
  });

  const removePreferenceMutation = useMutation({
    mutationFn: async (itemName: string) => {
      return await apiRequest("DELETE", `/api/user/${userId}/preferences/${itemName}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/preferences`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/recommended-events`] });
      toast({
        title: "Preference removed",
        description: "Your preferences have been updated.",
      });
    },
  });

  const handleTeamsChange = (newTeams: string[]) => {
    const added = newTeams.filter(t => !selectedTeams.includes(t));
    const removed = selectedTeams.filter(t => !newTeams.includes(t));

    added.forEach(team => {
      addPreferenceMutation.mutate({ type: "team", itemId: team, itemName: team });
    });

    removed.forEach(team => {
      removePreferenceMutation.mutate(team);
    });

    setSelectedTeams(newTeams);
  };

  const handleArtistsChange = (newArtists: string[]) => {
    const added = newArtists.filter(a => !selectedArtists.includes(a));
    const removed = selectedArtists.filter(a => !newArtists.includes(a));

    added.forEach(artist => {
      addPreferenceMutation.mutate({ type: "artist", itemId: artist, itemName: artist });
    });

    removed.forEach(artist => {
      removePreferenceMutation.mutate(artist);
    });

    setSelectedArtists(newArtists);
  };

  const handleVenuesChange = (newVenues: string[]) => {
    const added = newVenues.filter(v => !selectedVenues.includes(v));
    const removed = selectedVenues.filter(v => !newVenues.includes(v));

    added.forEach(venue => {
      addPreferenceMutation.mutate({ type: "venue", itemId: venue, itemName: venue });
    });

    removed.forEach(venue => {
      removePreferenceMutation.mutate(venue);
    });

    setSelectedVenues(newVenues);
  };

  const importSpotifyMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/spotify/top-artists?limit=100", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to import from Spotify");
      }
      return response.json();
    },
    onSuccess: (artists: Array<{ name: string }>) => {
      const artistNames = artists.map(a => a.name);
      const newArtists = artistNames.filter(name => !selectedArtists.includes(name));
      
      newArtists.forEach(artist => {
        addPreferenceMutation.mutate({ type: "artist", itemId: artist, itemName: artist });
      });
      
      setSelectedArtists(prev => Array.from(new Set([...prev, ...artistNames])));
      
      toast({
        title: "Success",
        description: `Imported ${newArtists.length} new artists from Spotify!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to import from Spotify. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSpotifyImport = () => {
    importSpotifyMutation.mutate();
  };

  const mockTeams = [
    { id: "Chicago Bears", name: "Chicago Bears" },
    { id: "Chicago Bulls", name: "Chicago Bulls" },
    { id: "Chicago Cubs", name: "Chicago Cubs" },
    { id: "Chicago White Sox", name: "Chicago White Sox" },
    { id: "Chicago Blackhawks", name: "Chicago Blackhawks" },
    { id: "Chicago Fire FC", name: "Chicago Fire FC" },
  ];

  const mockArtists = [
    { id: "Spoon", name: "Spoon" },
    { id: "The National", name: "The National" },
    { id: "Wilco", name: "Wilco" },
    { id: "Chance the Rapper", name: "Chance the Rapper" },
    { id: "Common", name: "Common" },
  ];

  const mockVenues = [
    { id: "United Center", name: "United Center" },
    { id: "Soldier Field", name: "Soldier Field" },
    { id: "Wrigley Field", name: "Wrigley Field" },
    { id: "The Riviera Theatre", name: "The Riviera Theatre" },
    { id: "Metro Chicago", name: "Metro Chicago" },
    { id: "House of Blues", name: "House of Blues" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onLogoClick={() => {}} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogoClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-tastes-title">Your Tastes</h1>
          <p className="text-muted-foreground">
            Manage your preferences to get personalized event recommendations
          </p>
        </div>

        <div className="space-y-8">
          <PreferenceSelector
            title="Your Favorite Teams"
            description="Teams you'd like to see play"
            placeholder="Search teams..."
            options={mockTeams}
            selectedIds={selectedTeams}
            onSelectionChange={handleTeamsChange}
          />

          <PreferenceSelector
            title="Your Favorite Artists"
            description="Artists and bands you'd like to see live"
            placeholder="Search artists..."
            options={mockArtists}
            selectedIds={selectedArtists}
            onSelectionChange={handleArtistsChange}
            enableSpotifySearch={true}
            onSpotifyImport={handleSpotifyImport}
            isImporting={importSpotifyMutation.isPending}
          />

          <PreferenceSelector
            title="Your Preferred Venues"
            description="Your favorite venues in Chicago"
            placeholder="Search venues..."
            options={mockVenues}
            selectedIds={selectedVenues}
            onSelectionChange={handleVenuesChange}
          />
        </div>
      </div>
    </div>
  );
}
