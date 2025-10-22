import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Share2, Bookmark, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    date: string;
    venue: string;
    price?: string;
    image: string;
    category: "sports" | "music";
    description?: string;
  };
}

export default function EventDetailModal({
  isOpen,
  onClose,
  event,
}: EventDetailModalProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    console.log(`Event ${event.id} ${!isSaved ? 'saved' : 'unsaved'}`);
  };

  const handleShare = () => {
    console.log('Share event:', event.id);
  };

  const handleAddToCalendar = () => {
    console.log('Add to calendar:', event.id);
  };

  const handleBuyTickets = () => {
    console.log('Buy tickets:', event.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative -mt-6 -mx-6 mb-4">
          <div className="aspect-[21/9] overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <DialogHeader className="absolute bottom-4 left-6 right-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Badge variant="secondary" className="uppercase text-xs mb-2">
                  {event.category}
                </Badge>
                <DialogTitle className="text-3xl text-white" data-testid="text-event-title">
                  {event.title}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-base">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span data-testid="text-event-date">{event.date}</span>
            </div>
            <div className="flex items-center gap-3 text-base">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span data-testid="text-event-venue">{event.venue}</span>
            </div>
            {event.price && (
              <div className="flex items-center gap-3 text-base">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold" data-testid="text-event-price">{event.price}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">About This Event</h4>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              className="flex-1"
              onClick={handleBuyTickets}
              data-testid="button-buy-tickets"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Buy Tickets
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSave}
              data-testid="button-save-event"
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              data-testid="button-share-event"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              onClick={handleAddToCalendar}
              data-testid="button-add-calendar"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
