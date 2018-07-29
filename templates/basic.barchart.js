var w = 960;
var h = 500;

// *** EDIT TO CUSTOMISE ***
var dataFile = "test-data.csv",
    xName = "year", // column name for x-axis in the csv
    xAxisLabel = "Years",
    xLabelxPosition = 0, xLabelyPosition = 40,
    yName = "value1", // column name for y-axis in the csv
    yAxisLabel = "Value",
    yLabelxPosition = 0, yLabelyPosition = -15,
    barColor= "#3366cc";

function transformXdata(data) {
  return data;
}
function transformYdata(data) {
  return +data; // '+' converts to numbers
}
// **************************

// Define the svg element, the plot dimensions (and margins)
var svg = d3.select("#barchart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

 var margin = {top: 40, right: 10, bottom: 60, left: 40},
     width = w - margin.left - margin.right,
     height = h - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

// Define the svg subelements 'g'
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(dataFile, function(d) {
  return {xData: transformXdata(d[xName]),
    			yData: transformYdata(d[yName])};
}, function(error, data) {
  if (error) throw error;

  // Define the span of x and y axis
  var maxY= d3.max(data, function(d) { return d.yData; });
  x.domain(data.map(function(d) { return d.xData; }));
  y.domain([0, maxY]);

  // Add the x-axis
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
  	.append("text") // Add x-axis label
  		.attr("fill", "#000")
  		.attr("x", (width /2) + xLabelxPosition)
  		.attr("y", xLabelyPosition)
  		.style("font-size", "14px")
  		.text(xAxisLabel);

  // Add the y-axis
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
    .append("text") // Add y-axis label
  		.attr("fill", "#000")
      .attr("x", yLabelxPosition)
  		.attr("y", yLabelyPosition)
  		.style("font-size", "14px")
  		.text(yAxisLabel);

  // Add one bar per data point
  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
  		.attr("fill", barColor)
      .attr("x", function(d) { return x(d.xData); })
      .attr("y", function(d) { return y(d.yData); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.yData); });
});
