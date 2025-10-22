import EventDetailModal from '../EventDetailModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import concertImage from '@assets/generated_images/Live_concert_stage_atmosphere_69ab46e5.png';

export default function EventDetailModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const mockEvent = {
    id: "1",
    title: "Spoon with Special Guests",
    date: "December 5, 2024 · 8:00 PM",
    venue: "The Riviera Theatre, Chicago",
    price: "From $45",
    image: concertImage,
    category: "music" as const,
    description: "Join us for an unforgettable night with Spoon as they bring their latest tour to Chicago. Known for their distinctive sound and energetic performances, this is a show you won't want to miss.",
  };

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>Open Event Detail</Button>
      <EventDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        event={mockEvent}
      />
    </div>
  );
}
