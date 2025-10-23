import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Welcome from "@/pages/Welcome";
import Home from "@/pages/Home";
import Onboarding from "@/pages/Onboarding";
import Tastes from "@/pages/Tastes";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Welcome />;
  }

  if (!user?.onboardingCompleted) {
    return <Onboarding userId={user.id} />;
  }

  return (
    <Switch>
      <Route path="/" component={() => <Home userId={user.id} />} />
      <Route path="/tastes" component={() => <Tastes userId={user.id} />} />
      <Route component={() => <Home userId={user.id} />} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
