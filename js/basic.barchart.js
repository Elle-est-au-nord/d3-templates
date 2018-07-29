var w = 550;
var h = 400;

var dataFile = "test-data.csv",
    xName = "year", // column name for x-axis in the csv
    xAxisLabel = "Years",
    xLabelxPosition = 0, xLabelyPosition = 40,
    yName = "value1", // column name for y-axis in the csv
    yAxisLabel = "Value",
    yBarLabelxPosition = 0, yBarLabelyPosition = -15,
    barColor= "#3366cc";

function transformBarXdata(data) {
  return data;
}
function transformBarYdata(data) {
  return +data; // '+' converts to numbers
}


// Define the svg element, the plot dimensions (and margins)
var barsvg = d3.select("#barchart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

 var margin = {top: 40, right: 10, bottom: 60, left: 40},
     width = w - margin.left - margin.right,
     height = h - margin.top - margin.bottom;

var barx = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    bary = d3.scaleLinear().rangeRound([height, 0]);

// Define the svg subelements 'g'
var barg = barsvg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(dataFile, function(d) {
  return {xData: transformBarXdata(d[xName]),
    	  yData: transformBarYdata(d[yName])};
}, function(error, data) {
  if (error) throw error;

  // Define the span of x and y axis
  var maxY= d3.max(data, function(d) { return d.yData; });
  barx.domain(data.map(function(d) { return d.xData; }));
  bary.domain([0, maxY]);

  // Add the x-axis
  barg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(barx))
  	.append("text") // Add x-axis label
  		.attr("fill", "#000")
  		.attr("x", (width /2) + xLabelxPosition)
  		.attr("y", xLabelyPosition)
  		.style("font-size", "14px")
  		.text(xAxisLabel);

  // Add the y-axis
  barg.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(bary).ticks(10))
    .append("text") // Add y-axis label
  		.attr("fill", "#000")
      .attr("x", yBarLabelxPosition)
      .attr("y", yBarLabelyPosition)
      .style("font-size", "14px")
      .text(yAxisLabel);

  // Add one bar per data point
  barg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", barColor)
      .attr("x", function(d) { return barx(d.xData); })
      .attr("y", function(d) { return bary(d.yData); })
      .attr("width", barx.bandwidth())
      .attr("height", function(d) { return height - bary(d.yData); });
});
