'use client';

import { useEffect } from 'react';

/**
 * Client component to add preload links for LCP hero images
 * This improves LCP by hinting the browser to fetch the images early
 */
export function HeroPreload() {
  useEffect(() => {
    // Check if links already exist to avoid duplicates
    const existingDesktop = document.querySelector('link[href="/banner1.webp"]');
    const existingMobile = document.querySelector('link[href="/mobile_banner_pr2.webp"]');

    if (!existingDesktop) {
      // Preload desktop hero image (LCP element)
      const desktopLink = document.createElement('link');
      desktopLink.rel = 'preload';
      desktopLink.as = 'image';
      desktopLink.href = '/banner1.webp';
      desktopLink.setAttribute('fetchPriority', 'high');
      document.head.appendChild(desktopLink);
    }

    if (!existingMobile) {
      // Preload mobile hero image (LCP element on mobile)
      const mobileLink = document.createElement('link');
      mobileLink.rel = 'preload';
      mobileLink.as = 'image';
      mobileLink.href = '/mobile_banner_pr2.webp';
      mobileLink.setAttribute('fetchPriority', 'high');
      document.head.appendChild(mobileLink);
    }
  }, []);

  return null;
}
