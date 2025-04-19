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
const zoom = 17;
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

//function onEachFeature(feature, layer) {
//  layer.bindPopup(feature.properties.nazwa);
//}

// function onEachFeature(feature, layer) {
//   const p = feature.properties;
//   const popupContent = `
//     <h3>${p['Nama Objek'] || '—'}</h3>
//     <table>
//       <tr>
//         <th>Kelompok O</th>
//         <td>${p['Kelompok O'] || '—'}</td>
//       </tr>
//       <tr>
//         <th>Sub</th>
//         <td>${p['Sub'] || '—'}</td>
//       </tr>
//       <tr>
//         <th>Desa</th>
//         <td>${p['Desa'] || '—'}</td>
//       </tr>
//     </table>
//   `;
//   layer.bindPopup(popupContent, {
//     maxWidth: 250
//   });
// }

function onEachFeature(feature, layer) {
  const p = feature.properties;

  // Generate a safe image filename (e.g. replace spaces with dashes or underscores)
  const imageName = (p['Nama Objek'] || '').toLowerCase().replace(/\s+/g, '-');
  const imagePath = `img/${imageName}.jpg`; // assumes .jpg extension

  const popupContent = `
    <h3>${p['Nama Objek'] || '—'}</h3>
    <table>
      <tr><th>Desa</th><td>${p['Desa'] || '—'}</td></tr>
      <tr><th>Nama Objek</th><td>${p['Nama Objek'] || '—'}</td></tr>
      <tr><th>Deskripsi</th><td>${p['Deskripsi'] || '—'}</td></tr>
    </table>
    <img src="${imagePath}" alt="${p['Nama Objek']}" style="width:100%; max-height:150px; object-fit:cover; margin-bottom:8px;" />
  `;

  layer.bindPopup(popupContent, { maxWidth: 250 });
}


// adding geojson by fetch
// of course you can use jquery, axios etc.
// fetch("./obyek-religi-olahan-pesisir-point.geojson")
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (data) {
//     // use geoJSON
//     L.geoJSON(data, {
//       onEachFeature: onEachFeature,
//     }).addTo(map);
//   });

fetch('obyek-religi-olahan-pesisir-point.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, { onEachFeature }).addTo(map);
  })
  .catch(err => console.error(err));
