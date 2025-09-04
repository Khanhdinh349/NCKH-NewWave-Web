# PWA Quick Files

- Place both icons under `/icons/` on your hosting:
  - /icons/icon-192.png
  - /icons/icon-512.png

- Put `manifest.webmanifest` at your site root (same folder as index.html).
- Put `service-worker.js` at your site root too.

In your index.html <head> add:
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0b3d2e">
<link rel="icon" href="/icons/icon-192.png">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="PlantLive">

And before </body>:
<script>
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}
</script>

Deploy over HTTPS, then Add to Home Screen (Android Chrome) or Share -> Add to Home Screen (iOS Safari).