import { legend } from './color-legend.js'

let year = 2020;
const blue = '#5d80b4';
const red = '#c66154';
const width = 960;
const height = 425;

$(document).ready(() => {
    setMap();
});

//set up choropleth map
async function setMap() {
    //use queue to parallelize asynchronous data loading
    const files = [
        // '../assets/projects/d3-demo/state16_final.csv',
        // '../assets/projects/d3-demo/state20_final.csv',
        // '../assets/projects/d3-demo/election16_modified.csv',
        '../assets/projects/d3-demo/election20_modified.csv',
        '../assets/projects/d3-demo/counties.json',
        // '../assets/projects/d3-demo/states.json'
    ];

    //create new svg container for the map
    let map = d3.select("div#d3Map")
        .append("div")
        .classed("svg-container", true) //container class to make it responsive
        .append("svg")
        //responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        //class to make it responsive
        .classed("svg-content-responsive", true); 

    console.log('loading data..');
    const promises = [];
    // for (let file of files) {
    //     if (file.includes('.json')) promises.push(d3.json(file));
    //     else if (file.includes('.csv')) promises.push(d3.csv(file, d3.autoType));
    // }
    // Promise.all(promises).then((values) => {
    //     // console.log('data loaded');
    //     // let [state16, state20, county16, county20, counties, states] = values;
    //     let [countyData, counties] = values;
    //     console.log('counties', counties);
    //     // createStateMap(map, states, state20, state16);
    //     createCountyMap(map, counties, countyData);
    // });

    legend({
        color: d3.scaleDivergingSqrt([-0.1, 0, 0.1], d3.interpolateRdBu),
        title: "Temperature (°F)",
        svgHtml: 'svg#d3Legend',
        tickFormat: (d, i) => ['90+', '70+', '0', '70+', '90+'][i]
    });
};


// --------------------------------------------------------
// map creation functions ---------------------------------
// --------------------------------------------------------
function createCountyMap(map, counties, countyData) {
    console.log('countyData', countyData);
    let countyTopo = topojson.feature(counties, counties.objects.usa_election);
    const projection = d3.geoAlbersUsa().fitSize([width, height], countyTopo);
    const path = d3.geoPath().projection(projection);
    const blueScheme = d3.scaleQuantize([0, 90], d3.schemeBlues[9])
    const redScheme = d3.scaleQuantize([0, 90], d3.schemeReds[9])

    map.selectAll('.counties')
        .data(countyTopo.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', d => countyChoropleth(countyData, d.properties.GEOID, blueScheme, redScheme))
        .style('stroke-width', '0.5')
        .style('stroke', 'black');
}


function createStateMap(map, states, state20, state16) {
    let stateTopo = topojson.feature(states, states.objects.usa_election_state);
    const projection = d3.geoAlbersUsa().fitSize([width, height], stateTopo);
    const path = d3.geoPath().projection(projection);

    map.selectAll(".regions")
        .data(stateTopo.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style("fill", d => {
            if (year === 2020) return stateWinners(state20, d.properties.STATEFIP);
            else return stateWinners(state16, d.properties.STATEFIP);
        })
        .style("stroke-width", "1")
        .style("stroke", "black");
}

// --------------------------------------------------------
// styling functions --------------------------------------
// --------------------------------------------------------
function countyChoropleth(csv, fips, blueScheme, redScheme) {
    // console.log('fips', fips);
    let record = csv.filter(e => e.county_fips == fips);
    if (record.length) {
        let r = record[0];
        let repTotal = r.rep/r.total * 100;
        let demTotal = r.dem/r.total * 100;
        console.log('repTotal',repTotal*100);
        if (r.rep > r.dem) return redScheme(repTotal - demTotal);
        else return blueScheme(demTotal - repTotal);
    } else {
        console.log('fips', fips);
        return 'black';
    }
}


function stateWinners(csv, fips) {
    let record = csv.filter(e => e.fips == fips);
    // console.log('record', record);

    if (record.length) {
        let r = record[0];
        if (r.dem == '-') return red;
        else return blue;
    } else {
        let new_fips = fips.split('-')[0];
        record = csv.filter(e => e.fips == new_fips);
        let demWinner = Number(record[0].dem) > Number(record[0].rep);

        if (fips.includes('-l')) {
            if (demWinner) return blue;
            else return red;
        } else {
            if (demWinner) return red;
            else return blue;
        }
    }
}
