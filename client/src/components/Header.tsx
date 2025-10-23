import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Calendar } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  onProfileClick?: () => void;
  onLogoClick?: () => void;
}

export default function Header({ onProfileClick, onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 rounded-md px-2 py-1 -mx-2" 
            onClick={onLogoClick}
            data-testid="button-logo"
          >
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">GoTime</h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-10"
                data-testid="input-search-events"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={onProfileClick}
              data-testid="button-profile"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
