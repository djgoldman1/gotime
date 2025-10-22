import { Card } from "@/components/ui/card";
import { Calendar, MapPin, DollarSign, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  venue: string;
  price?: string;
  image: string;
  category: "sports" | "music";
  isSaved?: boolean;
  onClick?: () => void;
}

export default function EventCard({
  id,
  title,
  date,
  venue,
  price,
  image,
  category,
  isSaved: initialSaved = false,
  onClick,
}: EventCardProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    console.log(`Event ${id} ${!isSaved ? 'saved' : 'unsaved'}`);
  };

  const categoryColor = category === "sports" ? "border-l-sports" : "border-l-music";

  return (
    <Card
      className={`overflow-hidden hover-elevate active-elevate-2 cursor-pointer border-l-4 ${categoryColor} transition-all duration-200`}
      onClick={onClick}
      data-testid={`card-event-${id}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 backdrop-blur-sm bg-background/80"
          onClick={handleSaveClick}
          data-testid={`button-save-${id}`}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </Button>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-xl line-clamp-2" data-testid={`text-title-${id}`}>
            {title}
          </h3>
          <Badge variant="secondary" className="shrink-0 uppercase text-xs">
            {category}
          </Badge>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span data-testid={`text-date-${id}`}>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span data-testid={`text-venue-${id}`}>{venue}</span>
          </div>
          {price && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium text-foreground" data-testid={`text-price-${id}`}>
                {price}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
