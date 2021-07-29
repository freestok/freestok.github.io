let year = 2020;
const blue = '#5d80b4';
const red = '#c66154';
const width = 960;
const height = 425;

$(document).ready(() => {
    setMap();
    // testThis();
});

//set up choropleth map
function setMap() {
    //use queue to parallelize asynchronous data loading
    const files = [
        '../assets/projects/d3-demo/state16_final.csv',
        '../assets/projects/d3-demo/state20_final.csv',
        '../assets/projects/d3-demo/election16_modified.csv',
        '../assets/projects/d3-demo/election20_modified.csv',
        '../assets/projects/d3-demo/counties.json',
        '../assets/projects/d3-demo/states.json'
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

    const promises = [];
    console.log('loading data..');
    for (let file of files) {
        if (file.includes('.json')) promises.push(d3.json(file));
        else if (file.includes('.csv')) promises.push(d3.csv(file));
    }

    Promise.all(promises).then((values) => {
        console.log('data loaded');
        let [state16, state20, county16, county20, counties, states] = values;

        // createStateMap(map, states, state20, state16);
        createCountyMap(map, counties, county16, county20);
    });
};


// --------------------------------------------------------
// map creation functions ---------------------------------
// --------------------------------------------------------
function createCountyMap(map, counties, county16, county20) {
    console.log('counties', counties.objects.usa_election);
    console.log('county20', county20);
    let countyTopo = topojson.feature(counties, counties.objects.usa_election);
    const projection = d3.geoAlbersUsa().fitSize([width, height], countyTopo);
    const path = d3.geoPath().projection(projection);

    map.selectAll('.counties')
        .data(countyTopo.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', d => {
            const fips = d.properties.GEOID;
            if (year === 2020) return countyChoropleth(county20, fips);
            else return countyChoropleth(county16, fips)
        })
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
function countyChoropleth(csv, fips) {
    // console.log('fips', fips);
    let record = csv.filter(e => e.county_fips == fips);
    if (record.length) {
        let r = record[0];
        if (Number(r.rep) > Number(r.dem)) return red;
        else return blue;
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
