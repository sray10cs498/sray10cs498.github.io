// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 70},
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scene-1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("/data/steph_mvp_season.csv", function(data) {
  console.log(data)
  // Add X axis
  var x = d3.scaleLinear()
    .domain([4, 12])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // text label for the x axis
  svg.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," +
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("3-Pointers Attempted Per Game");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([1, 6])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("3-Pointers Made Per Game");

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  var tooltip = d3.select("#scene-1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // A function that change this tooltip when the user hover a point.
   // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
   var mouseover = function(d) {
     tooltip
       .style("opacity", 1)
   }

   var mousemove = function(d) {
     // console.log(d3.mouse(this));
     // console.log(d3.event.pageX, d3.event.pageY);
     tooltip
       .html('<b>' + d.Player + "</b><br>3-Pointers Made: " + d.three_m + "<br>3-Pointers Attempted: "  + d.three_a  +  "<br>3-Point Shooting %: " + d.three_eff * 100 + "%")
       .style("left", d3.event.pageX+45 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
       .style("top", d3.event.pageY + "px")
   }

   // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
   var mouseleave = function(d) {
     tooltip
       .transition()
       .duration(200)
       .style("opacity", 0)
   }

   // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data.filter(function(d,i){return i<50})) // the .filter part is just to keep a few dots on the chart, not all of them
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.three_a); } )
      .attr("cy", function (d) { return y(d.three_m); } )
      .attr("r", 10)
      .style("fill", "#69b3a2")
      .style("opacity", 0.5)
      .style("stroke", "white")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave );

  const annotations = [
  {
    note: {
      title: "Stephen Curry"
    },
    x: 325,
    y: 80,
    dy: 50,
    dx: -50
  }];
  const makeAnnotations = d3.annotation()
  .annotations(annotations);
  svg.append("g")
    .call(makeAnnotations);
});
