import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  destination: string;
}

export function TestimonialCard({
  name,
  location,
  avatar,
  rating,
  text,
  destination,
}: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <Quote className="h-8 w-8 text-accent/30 mb-4" />
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "fill-accent text-accent" : "text-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-muted-foreground mb-6 line-clamp-4">{text}</p>
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-accent">Traveled to {destination}</p>
      </CardContent>
    </Card>
  );
}
