$(document).ready(() => {
    let w = 900, h = 500;

    const container = d3.select("body") //get the <body> element from the DOM
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .attr('class', 'container')
        .style("background-color", "rgba(0,0,0,0.2)");

    const innerRect = container.append("rect") //put a new rect in the svg
        .datum(400)
        .attr("width", d => d * 2) // 400 * 2 = 800
        .attr("height", d => d) // 400
        .attr("class", "innerRect") //class name
        .attr("x", 50) //position from left on the x (horizontal) axis
        .attr("y", 50) //position from top on the y (vertical) axis
        .style("fill", "#FFFFFF"); //fill color

    //Example 2.3 line 1
    var cityPop = [
        { 
            city: 'Madison',
            population: 233209
        },
        {
            city: 'Milwaukee',
            population: 594833
        },
        {
            city: 'Green Bay',
            population: 104057
        },
        {
            city: 'Superior',
            population: 27244
        }
    ];

        //above Example 2.8 line 20
    //find the minimum value of the array
    var minPop = d3.min(cityPop, function(d){
        return d.population;
    });

    //find the maximum value of the array
    var maxPop = d3.max(cityPop, function(d){
        return d.population;
    });

    //scale for circles center y coordinate
    var y = d3.scaleLinear()
        .range([450, 50])
        .domain([
            0,
            700000
        ]);

    var x = d3.scaleLinear()
        .range([100, 950])
        .domain([0,4]);

    var color = d3.scaleLinear()
        .range([
            "#FDBE85",
            "#D94701"
        ])
        .domain([
            minPop,
            maxPop
        ]);

    //Example 2.6 line 3
    var circles = container.selectAll(".circles") //create an empty selection
        .data(cityPop) //here we feed in an array
        .enter() //one of the great mysteries of the universe
        .append("circle") //inspect the HTML--holy crap, there's some circles there
        .attr("class", "circles")
        .attr("id", function(d){
            return d.city;
        })
        .attr("r", function(d){
            //calculate the radius based on population value as circle area
            var area = d.population * 0.01;
            return Math.sqrt(area/Math.PI);
        })
        .attr("cx", function(d, i){
            //use the index to place each circle horizontally
            return x(i);
        })
        .attr("cy", function(d){
            return y(d.population);
        })
        .style('fill', (d, i) => color(d.population))
        .style('stroke', '#000');

    //Example 3.6 line 1...create y axis generator
    var yAxis = d3.axisLeft(y)
        .scale(y);

    //create axis g element and add axis
    var axis = container.append("g")
        .attr("class", "axis")
        .attr('transform', 'translate(50, 0)')
        .call(yAxis);

    var title = container.append('text')
        .attr('class', 'title')
        .attr('text-anchor', 'middle')
        .attr('x', 450)
        .attr('y', 30)
        .text('City Population');

    //Example 3.14 line 1...create circle labels
    var labels = container.selectAll(".labels")
        .data(cityPop)
        .enter()
        .append("text")
        .attr("class", "labels")
        .attr("text-anchor", "left")
        .attr("y", function (d) {
            //vertical position centered on each circle
            return y(d.population) - 2;
        });

    //first line of label
    var nameLine = labels.append("tspan")
        .attr("class", "nameLine")
        .attr("x", function (d, i) {
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .text(function (d) {
            return d.city;
        });

    // create format generator
    var format = d3.format(',');

    //second line of label
    var popLine = labels.append("tspan")
        .attr("class", "popLine")
        .attr("x", function (d, i) {
            //horizontal position to the right of each circle
            return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
        })
        .attr('dy', '15') // vertical offset
        .text(function (d) {
            return "Pop. " + format(d.population);
        });

});