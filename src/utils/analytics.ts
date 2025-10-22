export const GA_TRACKING_ID = 'G-XXXXXXX';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const logEvent = (action: string, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  } else {
    console.warn('gtag not ready');
  }
};
