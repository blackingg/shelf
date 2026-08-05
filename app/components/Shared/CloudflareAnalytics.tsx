export function CloudflareAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;

  // async lets React 19 hoist this into <head> even though the root
  // layout renders no <html>/<body> of its own.
  return (
    <script
      async
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon='{"token": "59c77e2163184c6a8ae8f72504eeb6a7"}'
    />
  );
}
