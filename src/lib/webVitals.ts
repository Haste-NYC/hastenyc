import { onCLS, onINP, onLCP } from 'web-vitals';

export function reportWebVitals() {
  onCLS((metric) => {
    console.log('[CWV] CLS:', metric.value.toFixed(3), metric.value < 0.1 ? '(good)' : '(needs improvement)');
  });

  onINP((metric) => {
    console.log('[CWV] INP:', metric.value, 'ms', metric.value < 200 ? '(good)' : '(needs improvement)');
  });

  onLCP((metric) => {
    console.log('[CWV] LCP:', metric.value.toFixed(0), 'ms', metric.value < 2500 ? '(good)' : '(needs improvement)');
  });
}
