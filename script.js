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
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);



function onEachFeature(feature, layer) {
  const p = feature.properties;

  // Sanitize: Remove leading dot from extension + encode image name
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
    L.geoJSON(data, { onEachFeature }).addTo(map);
  })
  .catch(err => console.error(err));
