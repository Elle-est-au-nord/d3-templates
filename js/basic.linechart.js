var w = 550;
var h = 400;

var dataFile = "test-data.csv",
    xName = "year", // column name for x-axis in the csv
    xAxisLabel = "Years",
    xLabelxPosition = 0, xLabelyPosition = 40,
    yName = "value1", // column name for y-axis in the csv
    yAxisLabel = "Value"
    yLineLabelxPosition = -5, yLineLabelyPosition = -17,
    lineColor = "#729fcf";

function transformLineXdata(data) {
  var parseTime = d3.timeParse("%Y");
  return parseTime(data);
}
function transformLineYdata(data) {
  return +data; // '+' converts to numbers
}


// Define the svg element, the plot dimensions (and margins)
var linesvg = d3.select("#linechart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var margin = {top: 30, right: 30, bottom: 60, left: 50},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom,
    lineg = linesvg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var linex = d3.scaleTime()
     .rangeRound([0, width]);

var liney = d3.scaleLinear()
     .rangeRound([height, 0]);

d3.csv(dataFile, function(d) {
  return {xData:  transformLineXdata(d[xName]),
          yData:  transformLineYdata(d[yName])};
}, function(error, data) {
  if (error) throw error;

// Define the span of x and y axis
var maxLineY= d3.max(data, function(d) { return d.yData; });
linex.domain(d3.extent(data, function(d) { return d.xData; }));
liney.domain([0, maxLineY]);

var line = d3.line()
  .x(function(d) { return linex(d.xData); })
  .y(function(d) { return liney(d.yData); });

lineg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(linex))
	       .append("text") // Add x-axis label
	       .attr("fill", "#000")
	       .attr("x", (width / 2) + xLabelxPosition)
	       .attr("y", xLabelyPosition)
	       .style("font-size", "14px")
	       .text(xAxisLabel);

lineg.append("g")
     .call(d3.axisLeft(liney))
   .append("text") // Add y-axis label
     .attr("fill", "#000")
     .attr("x", yLineLabelxPosition)
     .attr("y", yLineLabelyPosition)
     .style("font-size", "14px")
     .text(yAxisLabel);

lineg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2.5)
      .attr("d", line);
});
