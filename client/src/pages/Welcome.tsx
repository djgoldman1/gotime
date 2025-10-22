import { Button } from "@/components/ui/button";
import { Calendar, Music, Trophy } from "lucide-react";

interface WelcomeProps {
  onGetStarted: () => void;
}

export default function Welcome({ onGetStarted }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Calendar className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">
            Welcome to GoTime
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your intelligent event discovery platform for Chicago. Get personalized recommendations for sporting events, concerts, and entertainment based on your preferences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 py-8">
          <div className="bg-card p-6 rounded-lg border space-y-3">
            <Trophy className="h-12 w-12 text-sports mx-auto" />
            <h3 className="font-semibold text-lg">Sports Events</h3>
            <p className="text-sm text-muted-foreground">
              Follow your favorite Chicago teams and never miss a game
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border space-y-3">
            <Music className="h-12 w-12 text-music mx-auto" />
            <h3 className="font-semibold text-lg">Live Music</h3>
            <p className="text-sm text-muted-foreground">
              Discover concerts from your favorite artists and new bands
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border space-y-3">
            <Calendar className="h-12 w-12 text-primary mx-auto" />
            <h3 className="font-semibold text-lg">Smart Calendar</h3>
            <p className="text-sm text-muted-foreground">
              Organize all your events in one beautiful calendar view
            </p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={onGetStarted}
          className="text-lg px-8 py-6"
          data-testid="button-get-started"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
