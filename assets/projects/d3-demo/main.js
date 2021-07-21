let year = 2016;

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
    

    //map frame dimensions
    // TODO combine the state spreadsheets, select by year, avoid if statements

    const width = 960,
        height = 425;

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
        console.log('state20',state20);
        console.log('states',states);
        let stateTopo = topojson.feature(states, states.objects.usa_election_state);
        const projection = d3.geoAlbersUsa().fitSize([width, height], stateTopo);
        const path = d3.geoPath().projection(projection);

        var regions = map.selectAll(".regions")
            .data(stateTopo.features)
            .enter()
            .append('path')
            .attr('d', path)
            .style("fill", d => {
                // console.log('d',d);
                if (year === 2020) return stateWinners(state20, d.properties.STATEFIP);
                else return stateWinners(state16, d.properties.STATEFIP);
            })
            .style("stroke-width", "1")
            .style("stroke", "black");
    });
};

function stateWinners(csv, fips) {
    let record = csv.filter(e => e.fips == fips);
    console.log('record', record);

    if (record.length) {
        let r = record[0];
        if (r.dem == '-') return 'red'
        else return 'blue'
    }
    return 'yellow'
}
