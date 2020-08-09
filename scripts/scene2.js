// set the dimensions and margins of the graph
var margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 60
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
function basicy() {
    var ret = d3.line()
        .x(function (d) {
            return x(d.year);
        })
    return ret;
}
var valueline = basicy()
    .y(function (d) {
        return y(d.three_a);
    });

// var valueline2 = basicy()
//     .y(function (d) {
//         return y(d.two_a);
//     });

var div = d3.select("#scene-2").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#scene-2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Get the data
var datalist = [];
d3.csv("data/three_point_change.csv", function (error, data) {
    if (error) throw error;
    // scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.year;
    }));
    y.domain([1000, d3.max(data, function (d) {
        return d.three_a
    })]);

    // add the valueline path.
    var dataArray = [{
        "name": "Average Three Pointers Attempted over the season",
        "x": 100,
        "y": 50,
        "class": "line-text",
        "class2": "line",
        "dataline": valueline
    }]
    for (var i = 0; i < dataArray.length; i++) {
        svg.append("text").text(dataArray[i].name)
            .attr("x", dataArray[i].x)
            .attr("y", dataArray[i].y);
        svg.append("rect")
            .attr("x", dataArray[i].x - 70)
            .attr("y", dataArray[i].y - 11)
            .attr("width", 50)
            .attr('height', 10)
            .attr('class', dataArray[i].class)
        svg.append("path")
            .data([data])
            .attr("class", dataArray[i].class2)
            .attr("d", dataArray[i].dataline)
    }

    // add the dots with tooltips
    var fixeddot = svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5)
    // var fixeddot2 = svg.selectAll("dot")
    //     .data(data)
    //     .enter().append("circle")
    //     .attr("r", 5)


    fixeddot.attr("cx", function (d) {
            return x(d.year);
        })
        .attr("cy", function (d) {
            return y(d.three_a);
        })
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("<p>Year: " + d.year + "</p> <p>3-Pointers Attempted Per Game: " + d.three_a + "</p>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        });

    // fixeddot2.attr("cx", function (d) {
    //         return x(d.year);
    //     })
    //     .attr("cy", function (d) {
    //         return y(d.two_a);
    //     })
    //     .on("mouseover", function (d) {
    //         div.transition()
    //             .duration(200)
    //             .style("opacity", .9);
    //         div.html("<p>년도:" + d.year + "</p> <p>PGDI:" + d.two_a + "</p>")
    //             .style("left", (d3.event.pageX) + "px")
    //             .style("top", (d3.event.pageY - 28) + "px");
    //     });


    // add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // text label for the x axis
    svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Year");

    // add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("3-Pointers Attempted over a season");

    const annotations = [
    {
      note: {
        title: "2015-16",
        label: "Stephen Curry's MVP Season"
      },
      x: 585,
      y: 175,
      dy: 80,
      dx: 80
    }];
    const makeAnnotations = d3.annotation()
    .annotations(annotations);
    svg.append("g")
      .call(makeAnnotations);

});
