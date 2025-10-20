import React, { useEffect } from 'react';

interface MetaUpdaterProps {
  title: string;
  description: string;
  keywords?: string;
}

const MetaUpdater: React.FC<MetaUpdaterProps> = ({ title, description, keywords }) => {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = title;
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
      document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', title);
    }

    // Update description
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', description);
    }

    // Update keywords
    if (keywords) {
      document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);
    }
    
    // Update URL tags
    const currentUrl = window.location.href;
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', currentUrl);
    document.querySelector('meta[property="twitter:url"]')?.setAttribute('content', currentUrl);

  }, [title, description, keywords]);

  return null; // This component doesn't render anything
};

export default MetaUpdater;
