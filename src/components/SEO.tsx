import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title,
  description,
  keywords,
  robots = "index, follow",
  ogType = "website",
  ogImage = "/logo.png",
  canonicalUrl,
}: SEOProps) {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Helper to update/create meta tag
    const updateMeta = (nameAttr: string, valAttr: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${valAttr}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(nameAttr, valAttr);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Update standard meta tags
    updateMeta("name", "description", description);
    updateMeta("name", "robots", robots);
    
    if (keywords) {
      updateMeta("name", "keywords", keywords);
    } else {
      // Remove keywords if not provided
      const element = document.querySelector('meta[name="keywords"]');
      if (element) {
        element.remove();
      }
    }

    // Open Graph meta tags
    updateMeta("property", "og:title", title);
    updateMeta("property", "og:description", description);
    updateMeta("property", "og:type", ogType);
    updateMeta("property", "og:image", ogImage);
    
    const currentUrl = canonicalUrl || window.location.href;
    updateMeta("property", "og:url", currentUrl);

    // Twitter Card meta tags
    updateMeta("name", "twitter:card", "summary_large_image");
    updateMeta("name", "twitter:title", title);
    updateMeta("name", "twitter:description", description);
    updateMeta("name", "twitter:image", ogImage);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currentUrl);
  }, [title, description, keywords, robots, ogType, ogImage, canonicalUrl]);

  return null;
}
