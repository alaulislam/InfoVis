// var dataset = [];
// for (var i = 0; i < 25; i++){
//     var newNumber = Math.random() * 25;
//     dataset.push(newNumber);
// }

// var dataset = [ 25, 7, 5, 26, 11 ];

// var x = d3.scale.linear()
//     .domain([0, d3.max(dataset)])
//     .range([0, 600]);

// d3.select(".chart")
//   .selectAll("div")
//     .data(dataset)
//   .enter().append("div")
//     .style("width", function(d) { return x(d) + "px"; })
//     .text(function(d) { return d; });




// var x = d3.scale.linear()
//     .domain([5, d3.max(dataset)])
//     .range([0, 300]);


// d3.select("body").selectAll("div")
// .data(dataset)
// .enter()
// .append("div")
// .attr("class", "barChart")
// .style("height", function(d) { 
//     var barHeight = x(d);
//     return barHeight + "px"; 
// });



//Width and height
var w = 500;
var h = 100;
var barPadding = 1;

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", function(d, i) {
           return i * (w / dataset.length);
   })
   .attr("y", function(d) {
           return h - (d * 4);
   })
   .attr("width", w / dataset.length - barPadding)
   .attr("height", function(d) {
           return d * 4;
   })
   .attr("fill", function(d) {
        return "rgb(0, 0, " + (d * 10) + ")";
   });

svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
           return d;
   })
   .attr("x", function(d, i) {
           return i * (w / dataset.length) + 5;
   })
   .attr("y", function(d) {
           return h - (d * 4) + 15;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white");