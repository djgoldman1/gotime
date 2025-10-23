import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Calendar, Heart, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Link, useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

interface HeaderProps {
  onProfileClick?: () => void;
  onLogoClick?: () => void;
}

export default function Header({ onProfileClick, onLogoClick }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link href="/">
              <Button
                variant={location === "/" ? "default" : "ghost"}
                className="hidden sm:flex"
                data-testid="button-nav-home"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
            </Link>
            <Link href="/tastes">
              <Button
                variant={location === "/tastes" ? "default" : "ghost"}
                className="hidden sm:flex"
                data-testid="button-nav-tastes"
              >
                <Heart className="h-4 w-4 mr-2" />
                Tastes
              </Button>
            </Link>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="sm:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={location === "/" ? "default" : "ghost"}
                      className="w-full justify-start"
                      data-testid="button-mobile-nav-home"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendar
                    </Button>
                  </Link>
                  <Link href="/tastes" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={location === "/tastes" ? "default" : "ghost"}
                      className="w-full justify-start"
                      data-testid="button-mobile-nav-tastes"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Tastes
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

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
