import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogType?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogUrl,
  ogType = "website",
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    setMetaTag("description", description);
    
    if (keywords) {
      setMetaTag("keywords", keywords);
    }

    setMetaTag("og:title", ogTitle || title, true);
    setMetaTag("og:description", ogDescription || description, true);
    setMetaTag("og:type", ogType, true);
    
    if (ogUrl) {
      setMetaTag("og:url", ogUrl, true);
    }
  }, [title, description, keywords, ogTitle, ogDescription, ogUrl, ogType]);

  return null;
}
