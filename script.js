/* eslint-disable no-undef */
/**
 * geoJSON simple
 */

// config map
let config = {
  minZoom: 2,
  maxZoom: 18,
};
// magnification with which the map will start
const zoom = 6;
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
  layer.bindPopup(feature.properties.nazwa);
}

// adding geojson by fetch
// of course you can use jquery, axios etc.
fetch("../obyek-religi-olahan-pesisir-point.geojson")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // use geoJSON
    L.geoJSON(data, {
      onEachFeature: onEachFeature,
    }).addTo(map);
  });
