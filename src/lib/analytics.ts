// Lightweight Google Analytics 4 & Custom Event Tracking Helper

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export type AnalyticsEvent =
  | 'sign_up'
  | 'login'
  | 'product_url_submitted'
  | 'content_generated'
  | 'article_saved'
  | 'article_exported'
  | 'copy_clicked'
  | 'section_regenerated'
  | 'version_restored'
  | 'upgrade_clicked';

export function trackEvent(event: AnalyticsEvent, params?: Record<string, any>): void {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, params);
    }
  } catch (err) {
    // Non-blocking telemetry
  }
}

export function initGoogleAnalytics(measurementId?: string): void {
  if (!measurementId || typeof window === 'undefined') return;

  const scriptId = 'google-analytics-script';
  if (document.getElementById(scriptId)) return;

  const script = document.createElement('script');
  script.id = scriptId;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer?.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, { send_page_view: true });
}
