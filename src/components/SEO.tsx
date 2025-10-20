import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage = 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg',
  ogType = 'website',
}: SEOProps) {
  const fullTitle = `${title} | Sample Parquet - Premium Zemin Kaplamaları`;
  const siteUrl = window.location.origin;
  const currentUrl = canonical ? `${siteUrl}${canonical}` : window.location.href;

  useEffect(() => {
    document.title = fullTitle;

    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
      { property: 'og:site_name', content: 'Sample Parquet' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const attribute = name ? 'name' : 'property';
      const value = name || property;
      let element = document.querySelector(`meta[${attribute}="${value}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value!);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);
  }, [fullTitle, description, currentUrl, ogImage, ogType]);

  return null;
}
