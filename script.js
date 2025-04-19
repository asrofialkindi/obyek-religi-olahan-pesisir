/* eslint-disable no-undef */
/**
 * geoJSON simple
 */

// config map
let config = {
  minZoom: 2,
  maxZoom: 24,
};
// magnification with which the map will start
const zoom = 15;
// co-ordinates
const lat = -6.662189;
const lng = 111.469324;

// calling map
const map = L.map("map", config).setView([lat, lng], zoom);

// Used to load and display tile layers on the map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function onEachFeature(feature, layer) {
  const p = feature.properties;

  // Sanitize and build image path
  const imageExtension = (p['Ekstensi'] || '').replace(/^\./, '');
  const imageName = encodeURIComponent(p['Nama Objek'] || '');
  const imagePath = `img/${imageName}.${imageExtension}`;

  const popupContent = `
    <h3>${p['Nama Objek'] || '—'}</h3>
    <table>
      <tr><th>-------</th><td>----------------------------------------</td></tr>
      <tr><th>Desa</th><td>${p['Desa'] || '—'}</td></tr>
      <tr><th>Deskripsi</th><td>----------------------------------------:</td></tr>
    </table>
    <p style="margin-top: 8px; font-style: italic; text-align: justify;">${p['Deskripsi'] || ''}</p>
    <img src="${imagePath}" alt="${p['Nama Objek']}" style="width:100%; max-height:150px; object-fit:cover; margin-bottom:8px;" />
  `;

  layer.bindPopup(popupContent, { maxWidth: 250 });
}

fetch('obyek-religi-olahan-pesisir-point.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        // Get the "Urutan" value to determine the icon
        const urutan = feature.properties.Urutan;
        // Define custom icon based on "Urutan"
        const customIcon = L.icon({
          iconUrl: `icons/${urutan}.png`,  // Path to your icons
          iconSize: [35, 41],              // Adjust based on your icon's size
          iconAnchor: [12, 41],            // Adjust anchor point if needed
          popupAnchor: [1, -34]            // Adjust popup position
        });
        // Return marker with custom icon
        return L.marker(latlng, { icon: customIcon });
      }
    }).addTo(map);
  })
  .catch(err => console.error(err));