'use strict';

import { legend } from './color-legend.js';

let year = 2020;
const blue = '#5d80b4';
const red = '#c66154';
const demShareNat = 0.514;
const repShareNat = 0.469;  
let demShare = demShareNat;
let repShare = repShareNat;
const duration = 1000;

$(document).ready(() => {
    setListeners();
    setMap();
});

function setListeners() {
    $('#transitionTest').on('click', () => adjustChart());
}

//set up choropleth map
function setMap() {
    //use queue to parallelize asynchronous data loading
    const root = '../assets/projects/d3-demo';

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
        createViz(counties, countyData);
    });
}


// --------------------------------------------------------
// map creation functions ---------------------------------
// --------------------------------------------------------
function createViz(counties, countyData) {
    const divergingScheme = d3.scaleDiverging([-100, 0, 100], d3.interpolateRdBu);

    // create legend
    legend({
        color: divergingScheme,
        title: "",
        svgHtml: 'svg#d3Legend',
        width: 250,
        tickFormat: (_, i) => ['R - 100', '50', '0', '50', '100 - D'][i]
    });

    createCountyMap(counties, countyData, divergingScheme);

    // create linked view/retrieval

    createChart();
}

function createChart() {
    let color = d3.scaleOrdinal(['d','r'],[red,blue]),
        title = 'Vote Share',
        tickSize = 6,
        width = 320,
        demShareStr = `${(demShare * 100).toFixed(1)}%`,
        repShareStr = `${(repShare * 100).toFixed(1)}%`,
        height = 44 + tickSize,
        graphHeight = 30,
        marginTop = 18,
        marginRight = 0,
        marginBottom = 16 + tickSize,
        marginLeft = 0,
        svgHtml = 'svg#d3Chart';

    const svg = d3.select(svgHtml)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    // adjust the bars
    svg.append("g")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
        .attr("id", (x) => {
            console.log('id', x);
            if (x === 'd') return 'demBar';
            else return 'repBar';
        })
        .attr("x", (x) => {
            if (x === 'd') return (width * demShare);
            else return -1;
        })
        .attr("y", marginTop)
        .attr("width", (e) => {
            if (e === 'd') return repShare * width;
            else return demShare * width;
        })
        .attr("height", graphHeight)
        .attr("fill", color);

    // add the title
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(title));

    // add the percentages
    svg.selectAll("g") 
        .append("text")
        .attr("id", (x,i) => {
            if (i === 0) return 'demTxt';
            else return 'repTxt';
        })
        .attr("x", (x, i) => {
            if (i === 0) return (width * demShare)/2;
            else return (width * demShare) + ((width * repShare)/2);
        })
        .attr("y", (x,i) => {
            if (i === 0) return 38;
            else return 10;
        })
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text((txt, i) => {
            console.log('TEXT', i);
            if (i === 0) return demShareStr;
            else return repShareStr;
        });
}

function adjustChart(name, dems, reps) {
    // let demShare = 0.2,
    //     repShare = 0.8;
    const width = 320;
    
    d3.select('rect#demBar')
        .transition()
        .duration(duration)
        .attr('x', width * dems)
        .attr('width', reps * width);

    d3.select('rect#repBar')
        .transition()
        .duration(duration)
        .attr('x', -1)
        .attr('width',dems * width);

            // add the percentages

    d3.select('text#demTxt')
        .transition()
        .duration(duration)
        .attr("x", (width * dems) / 2)
        .textTween(() =>{
            const i = d3.interpolate(demShare, dems);
            return (t) => `${(i(t) * 100).toFixed(1)}%`;
        });
    d3.select('text#repTxt')
        .transition()
        .duration(duration)
        .attr("x", (width * dems) + ((width * reps)/2))
        .textTween(() =>{
            const i = d3.interpolate(repShare, reps);
            return (t) => `${(i(t) * 100).toFixed(1)}%`;
        });

    demShare = dems;
    repShare = reps;
}

function createCountyMap(counties, countyData, divergingScheme) {
    const width = 960;
    const height = 350;
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

    // create map
    const countyTopo = topojson.feature(counties, counties.objects.usa_election);
    console.log('countyTopo',countyTopo);
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
        .on('mouseover', (event, d) => mouseOver(d.properties.GEOID, countyData));
        // .on('mouseout', () => console.log('out!'));
}


function mouseOver(fips, csv) {
    let r = csv.filter(e => e.county_fips === fips)[0];
    let name = r.county_name;
    let dems = r.dem / r.total;
    let reps = r.rep / r.total;
    adjustChart(name, dems, reps);
}


function createStateMap(map, states, state20, state16) {
    const width = 960;
    const height = 350;
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
