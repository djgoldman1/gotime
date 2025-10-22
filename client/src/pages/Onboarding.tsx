import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PreferenceSelector from "@/components/PreferenceSelector";
import { ChevronRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OnboardingProps {
  userId: string;
}

export default function Onboarding({ userId }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const { toast } = useToast();

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

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

  const completeMutation = useMutation({
    mutationFn: async () => {
      const preferences = [
        ...selectedTeams.map(id => ({ type: "team", itemId: id, itemName: id })),
        ...selectedArtists.map(id => ({ type: "artist", itemId: id, itemName: id })),
        ...selectedVenues.map(id => ({ type: "venue", itemId: id, itemName: id })),
      ];

      for (const pref of preferences) {
        await apiRequest("POST", `/api/user/${userId}/preferences`, pref);
      }

      await apiRequest("POST", `/api/user/${userId}/complete-onboarding`);
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      completeMutation.mutate();
    }
  };

  const handleSkipStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      completeMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold">
              {step === 1 && "Welcome to GoTime!"}
              {step === 2 && "Your Favorite Artists"}
              {step === 3 && "Preferred Venues"}
            </h2>
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-onboarding" />
        </div>

        <div className="mb-8">
          {step === 1 && (
            <PreferenceSelector
              title="Select Your Favorite Teams"
              description="Choose the sports teams you want to follow for personalized event recommendations"
              placeholder="Search teams..."
              options={mockTeams}
              selectedIds={selectedTeams}
              onSelectionChange={setSelectedTeams}
            />
          )}
          {step === 2 && (
            <PreferenceSelector
              title="Select Your Favorite Artists"
              description="Choose artists and bands you'd like to see live"
              placeholder="Search artists..."
              options={mockArtists}
              selectedIds={selectedArtists}
              onSelectionChange={setSelectedArtists}
            />
          )}
          {step === 3 && (
            <PreferenceSelector
              title="Select Your Preferred Venues"
              description="Choose your favorite venues in Chicago"
              placeholder="Search venues..."
              options={mockVenues}
              selectedIds={selectedVenues}
              onSelectionChange={setSelectedVenues}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleSkipStep}
            data-testid="button-skip"
            disabled={completeMutation.isPending}
          >
            Skip for now
          </Button>
          <Button
            onClick={handleNext}
            data-testid="button-next"
            disabled={completeMutation.isPending}
          >
            {completeMutation.isPending ? "Saving..." : step === totalSteps ? "Get Started" : "Next"}
            {!completeMutation.isPending && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}
