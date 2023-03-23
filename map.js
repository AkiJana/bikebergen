function initMap() {
  // Replace with your Mapbox access token and style URL
  const mapboxAccessToken = 'pk.eyJ1Ijoia2F0YXJpbmExMjM0IiwiYSI6ImNsZmtnc2wxNDBhcWYzdW1jNHA5czFpN3oifQ.P8U4sUKLeAcFNIvGh0db8g';
  const mapboxStyleURL = 'mapbox://styles/katarina1234/clfkgwuiu001801qzk03rtms5';

  // Replace with your OpenRouteService access token
  const openRouteServiceToken = '5b3ce3597851110001cf6248cf40163e182a48678ceba6ba54ef43d8';

  // Map initialization
  mapboxgl.accessToken = mapboxAccessToken;
  const map = new mapboxgl.Map({
    container: 'map',
    style: mapboxStyleURL,
    center: [5.3221, 60.3913],
    zoom: 12
  });

  // Define route coordinates
  const routes = {
    'bergen-fana': {
      start: [5.3221, 60.3913],
      end: [5.3533, 60.3007]
    },
    'bergen-laksevag': {
      start: [5.3221, 60.3913],
      end: [5.2195, 60.3989]
    },
    'bergen-fyllingsdalen': {
      start: [5.3221, 60.3913],
      end: [5.2662, 60.3619]
    },
    'bergen-landas': {
      start: [5.3221, 60.3913],
      end: [5.3499, 60.3632]
    }
  };

  // Function to fetch and display route
  function showRoute(routeId) {
    const route = routes[routeId];

    axios.get(`https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=${openRouteServiceToken}&start=${route.start.join(',')}&end=${route.end.join(',')}`)
      .then(response => {
        const coordinates = response.data.features[0].geometry.coordinates;
        const distance = (response.data.features[0].properties.segments[0].distance / 1000).toFixed(2);
        const duration = (response.data.features[0].properties.segments[0].duration / 60).toFixed(2);
        const steps = response.data.features[0].properties.segments[0].steps;

        // Update map with route
        if (map.getLayer('route')) {
          map.removeLayer('route');
          map.removeSource('route');
        }

        map.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': coordinates
            }
          }
        });

        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#f28705',
            'line-width': 5
          }
        });

        // Update route info
        document.getElementById('route-info').innerHTML = `
          <h3>Route Information</h3>
          <p><strong>Distance:</strong> ${distance} km</p>
          <p><strong>Estimated Time:</strong> ${duration} minutes</p>
          <p><strong>Intersections & Junctions:</strong></p>
          <ul>
            ${steps.map(step => `<li>${step.instruction}</li>`).join('')}
          </ul>
        `;
      })
      .catch(error => {
        console.error('Error fetching route:', error);
      });
  }

  window.showRoute = showRoute;
}

// Call the initMap function after the window has loaded
window.addEventListener('load', initMap);

