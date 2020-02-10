// var width = 1000,
//     height = 450;

var width = 250,
    height = 200;
 
var barFlag = true;

var paddingBar = [40, 110, 50, 140];

var paddingScatter = [10, 300, 40, 300];


var svg = d3.select("#svgCanvas")
    .append("svg")
    .attr("width", width) 
    .attr("height", height)
    .attr("align","center");
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var colours = {
    SleepQty: "#4694FF",
    scatter: "#ffd92f"
};

var minScatter = 1,
    maxScatter = 12;

var format = d3.format(",");

d3.csv("data/SleepData.csv", row, function(data) {
    // data.sort(function(a, b) {
    //     return d3.ascending(a.SleepQty, b.SleepQty);
    // });

    //console.log(Object.values(data));
    // data.forEach(function (d) {
    //    console.log("After Sorting:"+ d.SleepQty);
    // });

    var dayNameShort = data.map(function(d) {
        return d.dayNameShort;
    });


    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.SleepQty;
        })])
        //.range([100, 10]); 
       .range([height - paddingBar[2], paddingBar[0]]); // height = 450  ,  paddingBar[2] = 50, paddingBar[0] = 40

    var xScaleBar = d3.scaleBand() // bar chart bar width
        .domain(dayNameShort)
     //.range([paddingBar[3], width - paddingBar[1]])   //var paddingBar = [40, 110, 50, 140];
        .range([0, width]) // followed by xScaleScatter Range
        .padding(0.2);

    var xScaleScatter = d3.scaleLinear() //var paddingScatter = [10, 300, 40, 300];
        .domain([minScatter, maxScatter])
        .range([paddingScatter[3], width - paddingScatter[1]]);

    var radiusScale = d3.scaleSqrt() // scatter point size
        .domain([0, d3.max(data, function(d) {
            return d.SleepQty;
        })])
        .range([30, 20]);

    var xAxisBar = d3.axisBottom(xScaleBar);

    var xAxisScatter = d3.axisBottom(xScaleBar); // No need xScaleScatter, because same weekdays name for both bar & scatter
        // .ticks(5)
        // .tickFormat(function(d, i) {
        //     return i ? format(d) : null;
        // })
        // .tickSizeInner(-(height - paddingScatter[0] - paddingScatter[2]));

    var yAxis = d3.axisLeft(yScale)
        .tickValues([10, 300, 40, 300])
        .tickSizeInner(-(width - paddingBar[1] - paddingBar[3]));

    var duration = 1500;

    var previousType = "bar";

    data.forEach(function(d) {
        d.radius = radiusScale(d.dayNumber); // circle will be small or big depending on the day number sequence
    });

    var gXBar = svg.append("g")
        .attr("class", "xAxis xAxisBar")
        .attr("transform", "translate(0," + (height - paddingBar[2]) + ")");

    gXBar.call(xAxisBar)
        .selectAll(".tick text")
        .style("font-size", "9px")
        .call(wrap, xScaleBar.step());

    var gXScatter = svg.append("g")
        .attr("class", "xAxis xAxisScatter")
        .attr("transform", "translate(0," + (height - paddingScatter[2]) + ")")
        .style("opacity", 0);

    gXScatter.call(xAxisScatter);

    var gY = svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + paddingBar[3] + ",0)");

    gY.call(yAxis);

    var barTitle = svg.append("text")
        .attr("x", paddingBar[3] + (width - paddingBar[3] - paddingBar[1]) / 2)
        .attr("y", 26)
        .attr("class", "barTitle")
        .style("text-anchor", "middle")
        .text("");

    var xAxisText = svg.append("text")
        .attr("class", "axisText")
        .attr("x", paddingBar[3] + (width - paddingBar[3] - paddingBar[1]) / 2)
        .style("text-anchor", "middle")
        .attr("y", height - paddingBar[2] + 46)
        .text("Week day");

    var yAxisText1 = svg.append("text")
        .attr("class", "axisText")
        .style("text-anchor", "end")
        .attr("x", paddingScatter[3] - 46)
        .attr("y", paddingScatter[0] + (height - paddingScatter[2] - paddingScatter[0]) / 2)
        .text("");

    var yAxisText2 = svg.append("text")
        .attr("class", "axisText")
        .style("text-anchor", "end")
        .attr("x", paddingScatter[3] - 46)
                .attr("y", paddingScatter[0] + (height - paddingScatter[2] - paddingScatter[0]) / 2 + 14)
        .text("");

    var scatterGroup = svg.append("g")
        .attr("class", "scatterGroup");

    var diagonalLine = scatterGroup.append("line")
        .attr("x1", paddingScatter[3])
        .attr("x2", paddingScatter[3])
        .attr("y1", height - paddingScatter[2])
        .attr("y2", height - paddingScatter[2])
        .style("stroke-width", 3)
        .style("stroke-dasharray", "6,6")
        .style("stroke", "#aaa");

    var verticalPath = scatterGroup.append("path")
        .attr("d", "M" + paddingScatter[3] + "," + paddingScatter[0] + " L" +
            (width - paddingScatter[1]) + "," + paddingScatter[0] + " L" +
            paddingScatter[3] + "," + (height - paddingScatter[2]) + "Z")
        .style("opacity", 0)
        .on("mousemove", function() {
            d3.select(this).style("opacity", 0.1);
            tooltip.html("Labeling Text1..")
                .style("top", d3.event.pageY - 20 + "px")
                .style("left", d3.event.pageX + 20 + "px")
                .style("opacity", .95)
        }).on("mouseout", function() {
            d3.select(this).style("opacity", 0);
            tooltip.style("opacity", 0);
        });

    var horizontalPath = scatterGroup.append("path")
        .attr("d", "M" + paddingScatter[3] + "," + (height - paddingScatter[2]) + " L" +
            (width - paddingScatter[1]) + "," + paddingScatter[0] + " L" +
            (width - paddingScatter[1]) + "," + (height - paddingScatter[2]) + "Z")
        .style("opacity", 0)
        .on("mousemove", function() {
            d3.select(this).style("opacity", 0.1);
            tooltip.html("Labeling Text2...")
                .style("top", d3.event.pageY - 20 + "px")
                .style("left", d3.event.pageX + 20 + "px")
                .style("opacity", .95)
        }).on("mouseout", function() {
            d3.select(this).style("opacity", 0);
            tooltip.style("opacity", 0);
        });

    var verticalBarText = scatterGroup.append("text")
        .attr("x", paddingScatter[3] + 100)
        .attr("y", paddingScatter[0] + 80)
        .style("opacity", 0)
        .attr("class", "scatterText")
        .attr("text-anchor", "middle")
        .text("Div Label1")
        .append("tspan")
        .attr("dy", "1.3em")
        .attr("x", paddingScatter[3] + 100)
        .text("Labeling Text3...");

    var bars = svg.selectAll(null)
        .data(data, function(d) {
            return d.dayNameShort;
        })
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return xScaleBar(d.dayNameShort)
        })
        .attr("y", height - paddingBar[2])
        .attr("height", 0)
        .attr("width", xScaleBar.bandwidth())
        .style("fill", colours.SleepQty)
        .style("stroke", "darkslategray")
        .style("stroke-opacity", 0);

    drawBars("SleepQty");

    d3.select("#barSleepQty").on("click", function() {
        drawBars("SleepQty");
    });

    d3.select("#scatter").on("click", function() {
        drawScatter();
    });

   // var paddingBar = [40, 110, 50, 140];

//    var cc = clickcancel();
//     d3.select('#svgCanvas').call(cc);
//     cc.on('click', function() {
//         d3.select('#svgCanvas').text(d3.select('#svgCanvas').text() + 'click, ');
//     });
//     cc.on('dblclick', function() {
//         d3.select('#svgCanvas').text(d3.select('#svgCanvas').text() + 'dblclick, ');
//     });
    
   function drawBars(sleep) {

        horizontalPath.style("pointer-events", "none");

        verticalPath.style("pointer-events", "none");

        var horizontalOrVertical = sleep === "SleepQty" ? "Sleep Qty" : "Target Sleep Qty"

        //barTitle.text("Bar Title text...: " + horizontalOrVertical);

        var thisTicks = sleep === "SleepQty" ? [15, 30, 45, 60] : [20, 40, 60, 80];

        // data.sort(function(a, b) {
        //     return d3.ascending(a[sleep], b[sleep]);
        // });

        // yScale.domain([0, d3.max(data, function(d) { // yScale already defined for Sleep Qty
        //         return d[sleep];
        //     })])
        //     .range([height - paddingBar[2], paddingBar[0]]);

        // xScaleBar.domain(data.map(function(d) {
        //     return d.dayNameShort;
        // }));

        bars.transition()
            .duration(duration)
            .attr("rx", 0) //bar dimension--skewed/circled/rectangle
            .attr("ry", 0)

            .attr("x", function(d) {
                return xScaleBar(d.dayNameShort)
            })
            .attr("y", function(d) {
                return yScale(d[sleep])
            })
            .attr("height", function(d) {
                return height - paddingBar[2] - yScale(d[sleep])
            })
            .attr("width", xScaleBar.bandwidth())
            .style("fill", colours[sleep])
            .style("stroke-opacity", 0);

        bars.on("mousemove", function(d) {
            bars.style("opacity", .3);
            d3.select(this).style("opacity", 1);
            tooltip.html("Week day: " + d.dayName + "<br style=\"line-height:180%;\">Scatter Plot Labeling1 " + horizontalOrVertical + ":<br>" + format(d[sleep]) )
                .style("top", d3.event.pageY - 20 + "px")
                .style("left", d3.event.pageX + 20 + "px")
                .style("opacity", .95)
        }).on("mouseout", function() {
            bars.style("opacity", 1);
            tooltip.style("opacity", 0)
        })

        svg.selectAll(".xAxisBar .tick").each(function(d) {
            d3.select(this).transition()
                .duration(duration)
                .attr("transform", "translate(" + (xScaleBar(d) + xScaleBar.bandwidth() / 2) + ",0)");
        });

        yAxis.tickValues(thisTicks)
            .tickSizeInner(-(width - paddingBar[1] - paddingBar[3]));

        gY.transition()
            .duration(duration)
            .attr("transform", "translate(" + paddingBar[3] + ",0)")
            .call(yAxis);

        if (previousType != "bar") {
            gXBar.transition()
                .duration(duration)
                .style("opacity", 1);

            gXScatter.transition()
                .duration(duration)
                .style("opacity", 0);

            scatterGroup.selectAll(".scatterText")
                .transition()
                .style("opacity", 0);

            diagonalLine.transition()
                .style("opacity", 0)
                .on("end", function() {
                    diagonalLine.attr("x2", paddingScatter[3])
                        .attr("y2", height - paddingScatter[2])
                        .style("opacity", 1);
                });

            xAxisText.transition()
                .duration(duration)
                .attr("y", height - paddingBar[2] + 46)
                .text("Week Days");

            yAxisText1.transition()
                .duration(duration)
                .text("")
                // .attr("x", paddingBar[3] - 46)
                // .attr("y", paddingBar[0] + (height - paddingBar[2] - paddingBar[0]) / 2);
                .attr("x", paddingScatter[3] - 46)
                .attr("y", paddingScatter[0] + (height - paddingScatter[2] - paddingScatter[0]) / 2);

            yAxisText2.transition()
                .duration(duration)
                .text("")
                .attr("x", paddingScatter[3] - 46)
                .attr("y", paddingScatter[0] + (height - paddingScatter[2] - paddingScatter[0]) / 2 + 14);

            barTitle.transition()
                .duration(duration)
                .style("opacity", 1);

        }

        previousType = "bar";

    }

    function drawScatter() {

        yScale.domain([minScatter, maxScatter])
            .range([height - paddingScatter[2], paddingScatter[0]]);

        // bars.sort(function(a, b) {
        //     return d3.descending(a.dayNumber, b.dayNumber)
        // });

        bars.transition()
            .duration(duration)
            .attr("rx", function(d) {
                return d.radius / 2;
            })
            .attr("ry", function(d) {
                return d.radius / 2;
            })
            // .attr("y", function(d) {
            //     return yScale(d.SleepQty) - d.radius / 2;
            // })
            // .attr("x", function(d) {  // exact position for 
            //     return xScaleScatter(d.SleepQty) - d.radius / 2;
            // })
            .attr("height", function(d) {
                return d.radius + 10;
            })
            .attr("width", function(d) { // increasing the size of the scatter point
                return d.radius + 10;
            })
            .style("fill", colours.scatter)
            .style("stroke-opacity", 1);


        bars.on("mousemove", function(d) {
            bars.style("opacity", .2);
            d3.select(this).style("opacity", 1);
            tooltip.html("Week day: " + d.dayName + "<br style=\"line-height:180%;\">Day Count: " + format(d.dayNumber)  + "<br>Sleep Hour(Qty):: " + format(d.SleepQty))
                .style("top", d3.event.pageY - 20 + "px")
                .style("left", d3.event.pageX + 20 + "px")
                .style("opacity", .95)
        }).on("mouseout", function() {
            bars.style("opacity", 1)
            tooltip.style("opacity", 0)
        })

        svg.on("dblclick",function(d){  
            if(!barFlag){
                drawScatter(); 
                barFlag = true;
            }else {
                drawBars("SleepQty");
                barFlag = false;
            }
            
        });

        yAxis.ticks(5)
            .tickValues(null)
            .tickSizeInner(-(width - paddingScatter[1] - paddingScatter[3]));

        gY.transition()
            .duration(duration)
            .attr("transform", "translate(" + paddingScatter[3] + ",0)")
            .call(yAxis);

        if (previousType != "scatter") {
            gXBar.transition()
                .duration(duration)
                .style("opacity", 0);

            gXScatter.transition()
                .duration(duration)
                .style("opacity", 1);

            // diagonalLine.transition()
            //     .delay(duration)
            //     .duration(duration)
            //     .attr("x2", width - paddingScatter[1])
            //     .attr("y2", paddingScatter[0])
            //     .on("end", function() {
            //         scatterGroup.selectAll(".scatterText")
            //             .transition()
            //             .duration(500)
            //             .style("opacity", 1);
            //         horizontalPath.style("pointer-events", "all");
            //         verticalPath.style("pointer-events", "all");
            //     });

            xAxisText.transition()
                .duration(duration)
                .attr("y", height - paddingScatter[2] + 30)
                .text("");

            yAxisText1.transition()
                .duration(duration)
                .text("")
                .attr("x", paddingScatter[3] - 46)
                .attr("y", paddingScatter[0] + (height - paddingScatter[2] - paddingScatter[0]) / 2);

            yAxisText2.transition()
                .duration(duration)
                .text("")
                .attr("x", paddingScatter[3] - 46)
                .attr("y", paddingScatter[0] + (height - paddingScatter[2] - paddingScatter[0]) / 2 + 14);
            barTitle.transition()
                .duration(duration)
                .style("opacity", 0);
        }

        previousType = "scatter";

    }

});

function row(d) {
    d.SleepQty = +d.SleepQty;
    d.dayNumber = +d.dayNumber;
    return d;
}

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

// function clickcancel() {
//     var event = d3.dispatch('click', 'dblclick');
//     function cc(selection) {
//         var down,
//             tolerance = 5,
//             last,
//             wait = null;
//         // euclidean distance
//         function dist(a, b) {
//             return Math.sqrt(Math.pow(a[0] - b[0], 2), Math.pow(a[1] - b[1], 2));
//         }
//         selection.on('mousedown', function() {
//             down = d3.mouse(document.body);
//             last = +new Date();
//         });
//         selection.on('mouseup', function() {
//             if (dist(down, d3.mouse(document.body)) > tolerance) {
//                 return;
//             } else {
//                 if (wait) {
//                     window.clearTimeout(wait);
//                     wait = null;
//                     event.dblclick(d3.event);
//                 } else {
//                     wait = window.setTimeout((function(e) {
//                         return function() {
//                             event.click(e);
//                             wait = null;
//                         };
//                     })(d3.event), 300);
//                 }
//             }
//         });
//     };
//     return rebind(cc, event, 'on');
// }

// function rebind(target, source) {
//     var i = 1,
//       n = arguments.length,
//       method;
//     while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
//     return target;
//   };
  
//   function d3_rebind(target, source, method) {
//     return function() {
//       var value = method.apply(source, arguments);
//       return value === source ? target : value;
//     };
//   }

