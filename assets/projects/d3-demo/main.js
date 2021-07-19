$(document).ready(() => {
    setMap();
    // testThis();
});

//set up choropleth map
function setMap() {
    //use queue to parallelize asynchronous data loading
    const files = [
        '../assets/projects/d3-demo/election16_modified.csv',
        '../assets/projects/d3-demo/election20_modified.csv',
        '../assets/projects/d3-demo/usa_election.json'
    ];
    

    //map frame dimensions
    const width = 960,
        height = 960;

    //create new svg container for the map
    let map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    const promises = [];
    for (let file of files) {
        if (file.includes('.json')) promises.push(d3.json(file));
        else if (file.includes('.csv')) promises.push(d3.csv(file));
    }

    Promise.all(promises).then((values) => {
        let [e16, e17, usaGeom] = values;
        let usa = topojson.feature(usaGeom, usaGeom.objects.usa_election);
        const projection = d3.geoAlbersUsa().fitSize([width, height], usa);
        const path = d3.geoPath().projection(projection);

        var regions = map.selectAll(".regions")
            .data(usa.features)
            .enter()
            .append('path')
            .attr('d', path)
            .style("fill", "red")
            .style("stroke-width", "1")
            .style("stroke", "black");
    });
};
