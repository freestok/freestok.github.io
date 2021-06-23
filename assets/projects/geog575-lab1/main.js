import { getToolUI } from './html.js';

// global variables
let stat = 'rp2013';
let housing;
let year = 2019;
const assets = '/assets/projects/geog575-lab1';

$(document).ready(() => {
    // set-up map and basemap
    const map = L.map('map').setView([39.47, -97.02], 4);

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
        createLegend(5, 50, map);
    });

    // TODO style this
    // fetchJSON(`${assets}/urban_boundaries.json`).then((data) => {
    //     L.geoJSON(data).addTo(map);
    // });

    // ------------------- legend --------------------------
    // TODO make this work like in the sample
    let toolHtml = getToolUI();
    creatTool(toolHtml, map);

    // ------------------- slider ----------------------------
    let yearVal = $('#yearRange').val();
    console.log(yearVal);
    $('#yearLabel').text(String(yearVal));

    // ------------------- listeners ------------------------
    $('input[type=range]').on('input', (e) => {
        let yearVal = $(e.target).val();
        year = yearVal;
        $('#yearLabel').text(String(yearVal));
        const dropdowns = $('.dropdown-item.active');
        let type = dropdowns[0];
        stat = `${type.id[0]}p${year}`;
        updateSymbology();
    });
    
    $('.dropdown-item').on('click', (e) => {
        const dropdowns = $('.dropdown-item.active');
        let type = dropdowns[0];
        $(type).removeClass('active');
        type = e.target;
        $(type).addClass('active');
        $('#house-type').html(type.innerText);
        console.log('type',type);
        console.log('e',e);
        stat = `${type.id[0]}p${year}`;
        console.log(stat);
        updateSymbology();
        console.log(stat);
    });
});

function updateSymbology() {
    console.log('updating');
    housing.eachLayer((layer) => {
        const props = layer.feature.properties;
        let name = props.name.replace(' (2010)','');
        let year = stat.substr(stat.length - 4);
        let statName = stat
            .replace('op','Owner Cost Burdened Households')
            .replace('ap', 'All Cost Burdened Households')
            .replace('rp', 'Renter Cost Burdened Households')
            .replace(/\d{4}$/, '');
        let householdType = statName.split(' ')[0];

        // X in 10
        let in10 = Math.round(props[stat] * 10);
        let remainder = 10 - in10;
        let in10Msg = ''
        
        for (let i=0; i < in10; i++) {
            in10Msg += '<i class="bi bi-person-fill"></i>'
        }
        for (let i=0; i < remainder; i++) {
            in10Msg += '<i class="bi bi-person"></i>'
        }

        let popupContent = `
            <div id="tooltip">
                <h5>${statName}  - ${year}</h5>
                ${Math.round(props[stat] * 100)}% of ${householdType} households in <b>${name}</b> are cost burdened.<br><br>
                That is about ${in10} out 10 people who are cost burdened.<br>
                ${in10Msg}
            </div>
        `
        layer.bindPopup(popupContent);
        // if not mobile, then tooltip
        if (!/Mobi|Android/i.test(navigator.userAgent)) {
            layer.bindTooltip(popupContent);
        }
        layer.setRadius(getRadius(props[stat]));
    });
}

async function fetchJSON(url) {
    const response = await fetch(url);
    return await response.json();
}

//  add the data
// {'ap': {'min': 0.23, 'max': 0.53}, 'op': {'min': 0.16, 'max': 0.48}, 'rp': {'min': 0.41, 'max': 0.64}
function getRadius(x) {
    if (stat.includes('a')) {
        if (x <= .25) return 5
        else if (x <= .35) return 10
        else if (x <= .45) return 15
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

function getRadiusLegend() {
    if (stat.includes('a')) {
        if (x <= .25) return 5
        else if (x <= .35) return 10
        else if (x <= .45) return 15
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

// legend functions ------------------------------
function roundNumber(inNumber) {
    return (Math.round(inNumber / 10) * 10);
}
function createLegend(min, max, map) {
    if (min < 10) {
        min = 10;
    }
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
        let legendContainer = L.DomUtil.create("div", "legend");
        let symbolsContainer = L.DomUtil.create("div", "symbolsContainer");
        let classes = [roundNumber(min), roundNumber((max - min) / 2), roundNumber(max)];
        let legendCircle;
        let lastRadius = 0;
        let currentRadius;
        let margin;

        $(legendContainer).append("<h4 id='legendTitle'>% Burdened</h4>");
        classes = [10, 18, 26, 34]
        for (let circle of classes) {
            legendCircle = L.DomUtil.create("div", "legendCircle");
            currentRadius = circle;
            margin = -currentRadius - lastRadius - 2;
            $(legendCircle).attr("style", "width: " + currentRadius * 2 +
                "px; height: " + currentRadius * 2 +
                "px; margin-left: " + margin + "px");
            $(legendCircle).append("<span class='legendValue'>" + circle + "</span>");
            $(symbolsContainer).append(legendCircle);
            lastRadius = currentRadius;
        }
        $(legendContainer).append(symbolsContainer);
        return legendContainer;
    };

    legend.addTo(map);

    // disable dragging when cursor enters the container
    legend.getContainer().addEventListener('mouseover', function () {
        map.dragging.disable();
    });

    // Re-enable dragging when user's cursor leaves the element
    legend.getContainer().addEventListener('mouseout', function () {
        map.dragging.enable();
    });
} // end createLegend();


function creatTool(html, map) {
    let control = L.control({ position: 'topright' });
    control.onAdd = () => {
        let divContainer = L.DomUtil.create("div", "legend");

        $(divContainer).append(html);
        return divContainer;
    };

    control.addTo(map);

    // disable dragging when cursor enters the container
    control.getContainer().addEventListener('mouseover', function () {
        map.dragging.disable();
    });

    // Re-enable dragging when user's cursor leaves the element
    control.getContainer().addEventListener('mouseout', function () {
        map.dragging.enable();
    });
} // end creatTool();