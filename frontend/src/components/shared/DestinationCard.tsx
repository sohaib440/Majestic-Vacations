import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface DestinationCardProps {
  name: string;
  country: string;
  image: string;
  path: string;
  description: string;
}

export function DestinationCard({ name, country, image, path, description }: DestinationCardProps) {
  return (
    <Link
      to={path}
      className="group relative overflow-hidden rounded-xl aspect-[4/5] block"
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
        <p className="text-sm font-medium text-accent mb-1">{country}</p>
        <h3 className="font-serif text-2xl font-semibold mb-2">{name}</h3>
        <p className="text-sm text-primary-foreground/80 mb-4 line-clamp-2">{description}</p>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
          Explore <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
