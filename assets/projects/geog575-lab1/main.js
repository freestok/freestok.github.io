// set-up map and basemap
let map = L.map('map').setView([39.47, -97.02], 4);
let assets = '/assets/projects/geog575-lab1'
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
}).addTo(map);

async function fetchJSON(url) {
    const response = await fetch(url);
    return await response.json();
}

function style(feature) {
    return {
        radius: feature.properties.ap2019 * 10
    };
}

//  add the data
//  TODO figure out a better way to do porportions
// make it specific to the kind (all, owner, renter)
// have to examine the data in pandas probably
function getRadius(x) {
    // console.log(x)
    if (x < .45) return 5
    else if (x < .50) return 10
    else if (x < .55) return 15
    else if (x < .60) return 20
    else return 25
}

fetchJSON(`${assets}/urban_final.json`).then((data) => {
    console.log('data', data);
    L.geoJSON(data, {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                fillColor: '#708598',
                color: '#537898',
                radius: getRadius(feature.properties.ap2019),
                weight: 1,
                fillOpacity: 0.6
            }) // TODO add pop-up?
        }
    }).addTo(map);
});

// TODO style this
// fetchJSON(`${assets}/urban_boundaries.json`).then((data) => {
//     L.geoJSON(data).addTo(map);
// });
