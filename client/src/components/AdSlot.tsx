import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { AdCode } from "@shared/schema";

interface AdSlotProps {
  location: string;
  className?: string;
}

export default function AdSlot({ location, className = "" }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: adsSetting } = useQuery<{ key: string; value: string | undefined }>({
    queryKey: ['/api/settings/ads_enabled'],
  });

  const { data: ads, isLoading } = useQuery<AdCode[]>({
    queryKey: ['/api/ad-codes', location],
  });

  const adsEnabled = adsSetting?.value === '1';

  useEffect(() => {
    if (!containerRef.current || !ads || ads.length === 0) {
      return;
    }

    const randomAd = ads[Math.floor(Math.random() * ads.length)];
    const container = containerRef.current;
    
    container.innerHTML = randomAd.code;

    const scripts = container.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [ads]);

  if (!adsEnabled) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (!ads || ads.length === 0) {
    return null;
  }

  return (
    <div className={`ad-slot ${className}`} data-testid={`ad-${location}`}>
      <div ref={containerRef}></div>
    </div>
  );
}
