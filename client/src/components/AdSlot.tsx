import { useQuery } from "@tanstack/react-query";
import type { AdCode } from "@shared/schema";

interface AdSlotProps {
  location: string;
  className?: string;
}

export default function AdSlot({ location, className = "" }: AdSlotProps) {
  const { data: ads, isLoading } = useQuery<AdCode[]>({
    queryKey: ['/api/ad-codes', location],
  });

  if (isLoading) {
    return null;
  }

  if (!ads || ads.length === 0) {
    return null;
  }

  const randomAd = ads[Math.floor(Math.random() * ads.length)];

  return (
    <div className={`ad-slot ${className}`} data-testid={`ad-${location}`}>
      <div dangerouslySetInnerHTML={{ __html: randomAd.code }} />
    </div>
  );
}
