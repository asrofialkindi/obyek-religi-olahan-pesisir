/* eslint-disable no-undef */
/**
 * geoJSON simple
 */

// config map
let config = {
  minZoom: 2,
  maxZoom: 24,
};
const zoom = 16;
const lat = -6.662189;
const lng = 111.469324;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Tile layer
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Global variables
let allMarkers = [];
let sortedFeatures = [];

// Navigation function
window.gotoUrutan = function (targetUrutan) {
  const targetMarker = allMarkers.find(
    marker => marker.feature.properties.Urutan === targetUrutan
  );
  if (targetMarker) {
    map.setView(targetMarker.getLatLng(), zoom);
    targetMarker.openPopup();
  }
};

function onEachFeature(feature, layer) {
  const p = feature.properties;
  const currentIndex = sortedFeatures.findIndex(f => f.properties.Urutan === p.Urutan);
  
  // Create navigation buttons
  let buttons = '';
  if (currentIndex > 0) {
    buttons += `<button class="nav-btn" onclick="gotoUrutan(${
      sortedFeatures[currentIndex - 1].properties.Urutan
    })">← Previous</button>`;
  }
  if (currentIndex < sortedFeatures.length - 1) {
    buttons += `<button class="nav-btn" onclick="gotoUrutan(${
      sortedFeatures[currentIndex + 1].properties.Urutan
    })">Next →</button>`;
  }

  // Sanitize image path
  const imageExtension = (p['Ekstensi'] || '').replace(/^\./, '');
  const imageName = encodeURIComponent(p['Nama Objek'] || '');
  const imagePath = `img/${imageName}.${imageExtension}`;

  // Popup content
  const popupContent = `
    <h3>${p['Nama Objek'] || '—'}</h3>
    <table>
      <tr><th>-------</th><td>----------------------------------------</td></tr>
      <tr><th>Desa</th><td>${p['Desa'] || '—'}</td></tr>
      <tr><th>Deskripsi</th><td>----------------------------------------:</td></tr>
    </table>
    <p style="margin-top: 8px; font-style: italic; text-align: justify;">${p['Deskripsi'] || ''}</p>
    <img src="${imagePath}" alt="${p['Nama Objek']}" style="width:100%; max-height:150px; object-fit:cover; margin-bottom:8px;" />
    ${buttons ? `<div style="margin-top: 10px; display: flex; justify-content: space-between;">${buttons}</div>` : ''}
  `;

  layer.bindPopup(popupContent, { 
    maxWidth: 250,
    className: 'custom-popup'
  });
}

// Load point features
fetch('obyek-religi-olahan-pesisir-point.geojson')
  .then(res => res.json())
  .then(data => {
    // Sort features by Urutan
    sortedFeatures = data.features.sort((a, b) => a.properties.Urutan - b.properties.Urutan);
    
    // Create GeoJSON layer
    L.geoJSON(sortedFeatures, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        const urutan = feature.properties.Urutan;
        const customIcon = L.icon({
          iconUrl: `icons/${urutan}.png`,
          iconSize: [35, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });
        
        const marker = L.marker(latlng, { icon: customIcon });
        allMarkers.push(marker);
        return marker;
      }
    }).addTo(map);
  })
  .catch(err => console.error(err));

// Load route line
fetch('obyek-religi-olahan-pesisir.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      // Convert EPSG:3857 coordinates to WGS84
      coordsToLatLng: function(coords) {
        return L.Projection.SphericalMercator.unproject(L.point(coords));
      },
      style: {
        color: '#FF6B6B',
        weight: 3,
        opacity: 0.7
      },
      onEachFeature: function(feature, layer) {
        const p = feature.properties;
        layer.bindPopup(`
          <h3>${p.Nama_Tour || 'Tour Route'}</h3>
          <p><strong>Desa:</strong> ${p.Desa || '—'}</p>
          <p style="margin-top: 8px;">${p.Deskripsi2 || ''}</p>
        `);
      }
    }).addTo(map);
  })
  .catch(err => console.error(err));