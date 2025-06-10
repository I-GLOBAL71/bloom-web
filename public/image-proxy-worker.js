// Image proxy service worker
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle Google user content images
  if (url.hostname === 'lh3.googleusercontent.com') {
    event.respondWith(
      fetch(event.request.url, {
        mode: 'no-cors',
        credentials: 'omit',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }).then(response => {
        // Clone the response as it can only be used once
        const clonedResponse = response.clone();
        
        // Store in cache for future use
        caches.open('image-cache').then(cache => {
          cache.put(event.request, clonedResponse);
        });
        
        return response;
      }).catch(() => {
        // Try to get from cache if network fails
        return caches.match(event.request);
      })
    );
  }
});
