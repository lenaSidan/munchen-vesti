export {};

declare global {
  interface Window {
    gtag: (...args: Parameters<Gtag.Gtag>) => ReturnType<Gtag.Gtag>;

  }
}