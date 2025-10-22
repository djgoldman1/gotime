import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PreferenceSelector from "./PreferenceSelector";
import { ChevronRight } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const mockTeams = [
    { id: "1", name: "Chicago Bears" },
    { id: "2", name: "Chicago Bulls" },
    { id: "3", name: "Chicago Cubs" },
    { id: "4", name: "Chicago White Sox" },
    { id: "5", name: "Chicago Blackhawks" },
  ];

  const mockArtists = [
    { id: "1", name: "Spoon" },
    { id: "2", name: "The National" },
    { id: "3", name: "Wilco" },
    { id: "4", name: "Chance the Rapper" },
    { id: "5", name: "Common" },
  ];

  const mockVenues = [
    { id: "1", name: "The Riviera Theatre" },
    { id: "2", name: "Metro Chicago" },
    { id: "3", name: "House of Blues" },
    { id: "4", name: "United Center" },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    console.log('Onboarding complete', {
      teams: selectedTeams,
      artists: selectedArtists,
      venues: selectedVenues,
    });
    onComplete();
  };

  const handleSkipStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onSkip?.();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold">
              {step === 1 && "Welcome to ChiEvents!"}
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
          >
            Skip for now
          </Button>
          <Button
            onClick={handleNext}
            data-testid="button-next"
          >
            {step === totalSteps ? "Get Started" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
