'use strict';

import { legend } from './color-legend.js';

let year = 2020;
const blue = '#5d80b4';
const red = '#c66154';
const width = 960;
const height = 350;

$(document).ready(() => {
    setMap();
});

//set up choropleth map
function setMap() {
    //use queue to parallelize asynchronous data loading
    const root = '../assets/projects/d3-demo';

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
    promises.push(d3.csv(`${root}/election20_modified.csv`, (d) => {
        return {
            year: +d.year,
            state: d.state,
            state_po: d.state_po,
            county_fips: d.county_fips,
            county_name: d.county_name,
            dem: +d.dem,
            rep: +d.rep,
            total: +d.total
        };
    }));
    promises.push(d3.json(`${root}/counties.json`));

    Promise.all(promises).then((values) => {
        let [countyData, counties] = values;
        // createStateMap(map, states, state20, state16);
        createViz(map, counties, countyData);

    });
}


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

    createCountyMap(map, counties, countyData, divergingScheme);

    // create linked view/retrieval

    createChart();
}

function createChart() {
    let color = d3.scaleOrdinal(['a','b'],[red,blue]),
        title = 'Vote Share',
        tickSize = 6,
        width = 320,
        height = 44 + tickSize,
        graphHeight = 30,
        marginTop = 18,
        marginRight = 0,
        marginBottom = 16 + tickSize,
        marginLeft = 0,
        ticks = width / 64,
        tickFormat,
        tickValues,
        svgHtml = 'svg#d3Chart';

    const svg = d3.select(svgHtml)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x = d3.scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
        .attr("x", (x) => {
            console.log('x', x);
            if (x === 'a') return 25;
            else return 51;
            return x;
        })
        .attr("y", marginTop)
        // .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("width", (e) => {
            console.log('e', e);
            console.log(Math.max(0, x.bandwidth() - 1));
            if (e === 'a') return 25;
            else return 159 + 200;
            return Math.max(0, x.bandwidth() - 1);
        })
        .attr("height", graphHeight)
        .attr("fill", color);

    tickAdjust = () => { };
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        // .call(d3.axisBottom(x)
        //     .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        //     .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        //     .tickSize(tickSize)
        //     .tickValues(tickValues))
        // .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(title));

}


function createCountyMap(map, counties, countyData, divergingScheme) {
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
    // console.log('countyData', csv);
    // console.log('fips', fips);
    let record = csv.filter(e => e.county_fips === fips);
    if (record.length) {
        let r = record[0];
        let repTotal = r.rep/r.total * 100;
        let demTotal = r.dem/r.total * 100;
        console.log('repTotal',repTotal*100);
        return divergingScheme(demTotal - repTotal);
    } else {
        // console.log('fips', fips);
        return 'black';
    }
}


function stateWinners(csv, fips) {
    let record = csv.filter(e => e.fips === fips);
    // console.log('record', record);

    if (record.length) {
        let r = record[0];
        if (r.dem === '-') return red;
        else return blue;
    } else {
        let new_fips = fips.split('-')[0];
        record = csv.filter(e => e.fips === new_fips);
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
