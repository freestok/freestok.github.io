// global variables
let stat = 'rp2013';
let housing;
const assets = '/assets/projects/geog575-lab1';

$(document).ready(() => {
    // set-up map and basemap
    let map = L.map('map').setView([39.47, -97.02], 4);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 16
    }).addTo(map);

    // add data to the map
    fetchJSON(`${assets}/urban_final.json`).then((data) => {
        console.log('data', data);
        housing = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, {
                    fillColor: '#708598',
                    color: '#537898',
                    radius: getRadius(feature.properties[stat]),
                    weight: 1,
                    fillOpacity: 0.6
                }) // TODO add pop-up?
            }
        }).addTo(map);

        updateSymbology();
    });

    // TODO style this
    // fetchJSON(`${assets}/urban_boundaries.json`).then((data) => {
    //     L.geoJSON(data).addTo(map);
    // });

    // ------------------- listeners ------------------------
    $('.dropdown-item').on('click', (e) => {
        $('#house-type').html(e.target.innerText);
        stat = `${e.target.id[0]}p2019`;
        updateSymbology();
    });
});

function updateSymbology() {
    console.log('updating');
    housing.eachLayer((layer) => {
        const props = layer.feature.properties;
        let popupContent = `
            ${props.name}<br>
            ${stat}<br>
            ${Math.round(props[stat] * 100)}%
        `
        layer.bindPopup(popupContent);
        layer.bindTooltip(popupContent);
        layer.setRadius(getRadius(props[stat]));
    });
}

async function fetchJSON(url) {
    const response = await fetch(url);
    return await response.json();
}

//  add the data
// {'ap': {'min': 0.08, 'max': 0.25}, 'op': {'min': 0.16, 'max': 0.48}, 'rp': {'min': 0.41, 'max': 0.64}
function getRadius(x) {
    if (stat.includes('a')) {
        if (x <= .1) return 5
        else if (x <= .15) return 10
        else if (x <= .2) return 15
        else return 20
    } else if (stat.includes('o')) {
        if (x <= .2) return 5
        else if (x <= .3) return 10
        else if (x <= .4) return 15
        else return 20
    } else if (stat.includes('r')) {
        if (x <= .45) return 5
        else if (x <= .50) return 10
        else if (x <= .55) return 15
        else return 20
    }
}
