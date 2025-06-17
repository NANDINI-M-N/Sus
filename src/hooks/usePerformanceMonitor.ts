
import { useEffect } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  navigationType: string;
}

export const usePerformanceMonitor = (pageName: string) => {
  useEffect(() => {
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        const metrics: PerformanceMetrics = {
          loadTime,
          renderTime,
          navigationType: navigation.type
        };

        console.log(`Performance metrics for ${pageName}:`, metrics);

        // In a real app, you would send this data to your analytics service
        // analytics.track('page_performance', { page: pageName, ...metrics });
      }
    };

    // Measure performance after the page has loaded
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [pageName]);
};
