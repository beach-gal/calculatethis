import { useQuery } from "@tanstack/react-query";
import type { AdCode, Setting } from "@shared/schema";

interface AdSlotProps {
  location: string;
  className?: string;
}

export default function AdSlot({ location, className = "" }: AdSlotProps) {
  const { data: settings } = useQuery<Setting[]>({
    queryKey: ['/api/admin/settings'],
  });

  const { data: ads, isLoading } = useQuery<AdCode[]>({
    queryKey: ['/api/ad-codes', location],
  });

  const adsEnabled = settings?.find((s) => s.key === 'ads_enabled')?.value === '1';

  if (!adsEnabled) {
    return null;
  }

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
