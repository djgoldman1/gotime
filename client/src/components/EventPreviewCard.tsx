import { Calendar, MapPin, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventPreviewCardProps {
  title: string;
  date: string;
  venue: string;
  price?: string;
  category: "sports" | "music";
  logo?: string;
}

export default function EventPreviewCard({
  title,
  date,
  venue,
  price,
  category,
  logo,
}: EventPreviewCardProps) {
  return (
    <Card className="w-80 p-4 space-y-3 border-2">
      <div className="flex items-start gap-3">
        {logo && (
          <img
            src={logo}
            alt={title}
            className="w-12 h-12 rounded-lg object-cover shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold line-clamp-2 mb-1">{title}</h4>
          <Badge variant="secondary" className="uppercase text-xs">
            {category}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0" />
          <span className="truncate">{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{venue}</span>
        </div>
        {price && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 shrink-0" />
            <span className="font-medium text-foreground">{price}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
