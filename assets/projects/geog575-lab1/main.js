// set-up map and basemap
let map = L.map('map').setView([39.47, -97.02], 4);
let assets = '/assets/projects/geog575-lab1'
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

async function fetchJSON(url) {
    const response = await fetch(url);
    return await response.json();
  }

//  add the data
fetchJSON(`${assets}/urban_final.json`).then((data) => { 
    L.geoJSON(data).addTo(map);
});

fetchJSON(`${assets}/urban_boundaries.json`).then((data) => { 
    L.geoJSON(data).addTo(map);
});
