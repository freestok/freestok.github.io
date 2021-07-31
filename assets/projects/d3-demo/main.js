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
    for (let file of files) {
        if (file.includes('.json')) promises.push(d3.json(file));
        else if (file.includes('.csv')) promises.push(d3.csv(file, d3.autoType));
    }
    Promise.all(promises).then((values) => {
        // let [state16, state20, county16, county20, counties, states] = values;
        let [countyData, counties] = values;
        // createStateMap(map, states, state20, state16);
        createViz(map, counties, countyData);

    });


};


// --------------------------------------------------------
// map creation functions ---------------------------------
// --------------------------------------------------------
function createViz(map, counties, countyData) {
    const divergingScheme = d3.scaleDiverging([-100, 0, 100], d3.interpolateRdBu);

    // create legend
    legend({
        color: divergingScheme,
        title: "",
        svgHtml: 'svg#d3Legend',
        tickFormat: (_, i) => ['R - 100', '50', '0', '50', '100 - D'][i]
    });

    // createCountyMap(map, counties, countyData);

    // create linked view/retrieval

    // createChart();
    chart2();
}

function chart2() {
    legend({
        color: d3.scaleOrdinal(['a','b'], ['red','blue']),
        title: "Unemployment rate (%)",
        tickSize: 3,
        ticks: 4,
        svgHtml: 'svg#d3Chart'
    })
}

function createChart() {
    let data = [
        {
            "group": "banana",
            "Nitrogen": "50",
            "normal": "50",
        }
    ]
    let columns = ['Nitrogen', 'normal', 'stress']
    let margin = ({ top: 30, right: 10, bottom: 0, left: 30 })
    let height = data.length * 25 + margin.top + margin.bottom
    let formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")
    let yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove())

    let xAxis = g => g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 100, "s"))
        .call(g => g.selectAll(".domain").remove())

    let series = d3.stack()
        .keys(columns)
        (data)
        .map(d => (d.forEach(v => v.key = d.key), d))

    let color = d3.scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(d3.schemeSpectral[series.length])
        .unknown("#ccc")

    let y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, 100])
        .padding(0.08)

    let x = d3.scaleLinear()
        .domain([0, 100])
        .range([margin.left, width - margin.right])



    const svg = d3.select("#d3Chart")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d[0]))
        .attr("y", (d, i) => y(d.data.name))
        .attr("width", 100)
        .attr("height", 10)
        .append("title")
        .text(d => `
                    ${d.data.name} ${d.key}
                    ${formatValue(d.data[d.key])}
        `);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    return svg.node();
}

function createCountyMap(map, counties, countyData) {
    // create map
    const countyTopo = topojson.feature(counties, counties.objects.usa_election);
    const projection = d3.geoAlbersUsa().fitSize([width, height], countyTopo);
    const path = d3.geoPath().projection(projection);
    
    map.selectAll('.counties')
        .data(countyTopo.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', d => countyChoropleth(countyData, d.properties.GEOID, divergingScheme))
        .style('stroke-width', '0.5')
        .style('stroke', 'black')
        .on('mouseover', d => console.log('over!',d))
        .on('mouseout', () => console.log('out!'));
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
function countyChoropleth(csv, fips, divergingScheme) {
    // console.log('fips', fips);
    let record = csv.filter(e => e.county_fips == fips);
    if (record.length) {
        let r = record[0];
        let repTotal = r.rep/r.total * 100;
        let demTotal = r.dem/r.total * 100;
        console.log('repTotal',repTotal*100);
        return divergingScheme(demTotal - repTotal)
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
