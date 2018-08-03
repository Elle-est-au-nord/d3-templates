var xAxis = {"label": "Years", "x": -60, "y": 80},
    y2Name = "value2", // column name for y-axis (line) in the csv
    yBLAxisLabel = "Values",
    barColorBL = "#3366cc", lineColorBL = "#16a085",
    plotTitleBL = {"name": "Template for a bar+line chart", "x": 150, "y": 25},
    plotLegendBL = {"pos": {"x": -180, "y": 60},
                    "data": [{"name": yName, "color": barColorBL},
                  	     {"name": y2Name, "color": lineColorBL}]};
function transformXdataBL(data) {
  return data;
}
function transformYdataBL(data) {
  return +data;
}
// **************************
// Define the svg element, the plot dimensions (and margins)
var svgBL = d3.select("#barlinechart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var marginBL = {top: 50, right: 20, bottom: 50, left: 30},
    widthBL = w - marginBL.left - marginBL.right,
    heightBL = h - marginBL.top - marginBL.bottom;

var xBL = d3.scaleBand().rangeRound([0, widthBL]).padding(0.1),
    yBL = d3.scaleLinear().rangeRound([heightBL, 0]);
// Define the svg subelements 'g'
var gBL = svgBL.append("g")
    .attr("transform", "translate(" + marginBL.left + "," + marginBL.top + ")");
d3.csv(dataFile, function(d) {
  return {xDataBL: transformXdataBL(d[xName]),
    	  yDataBL: transformYdataBL(d[yName]),
          y2DataBL: transformYdataBL(d[y2Name])}; // '+' converts to numbers
}, function(error, data) {
  if (error) throw error;
  // Define the span of x and y axis
  var maxYBL= Math.max(d3.max(data, function(d) { return d.yDataBL; }), d3.max(data, function(d) { return d.y2DataBL; }));
  xBL.domain(data.map(function(d) { return d.xDataBL; }));
  yBL.domain([0, maxYBL]);

  var lineBL = d3.line()
   .x(function(d) { return xBL(d.xDataBL); })
   .y(function(d) { return yBL(d.y2DataBL); });
  // Add the x-axis
  gBL.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + heightBL + ")")
      .call(d3.axisBottom(xBL));
	svgBL.append("text") // Add x-axis label
      .attr("fill", "#000")
  		.attr("x", (widthBL /2) + xAxis.x)
  		.attr("y", heightBL + xAxis.y)
  		.style("font-size", "14px")
  		.text(xAxis.label);
  // Add the y-axis
  gBL.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(yBL).ticks(10))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em");
	svgBL.append("text") // Add y-axis label
  	  .attr("fill", "#000")
  		.attr("x", 0)
  		.attr("y", maxYBL)
  		.style("font-size", "14px")
  		.text(yBLAxisLabel);
  // Add one bars (y)
  var widthBar = xBL.bandwidth();
  gBL.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", barColorBL)
      .attr("x", function(d) { return xBL(d.xDataBL); })
      .attr("y", function(d) { return yBL(d.yDataBL); })
      .attr("width", widthBar)
      .attr("height", function(d) { return heightBL - yBL(d.yDataBL); });

  // Add line (y2)
  gBL.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", lineColorBL)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("transform", "translate(" + widthBar / 2 + ",0)")
      .attr("stroke-width", 2.5)
      .attr("d", lineBL);

	// Add a title
	svgBL.append("svg:text")
  		.style("font-size", "18px")
		.attr("class", "title")
	   	.attr("x", plotTitleBL.x)
	   	.attr("y", plotTitleBL.y)
	   	.text(plotTitleBL.name);

  // Add a legend
  var legendBL = svgBL.append("g")
	  .attr("class", "legend")
	  .attr("height", 100)
	  .attr("width", 100)
    .attr("transform", "translate(" + plotLegendBL.pos.x + "," + plotLegendBL.pos.y + ")");
  var plotDataBL = plotLegendBL.data;
  legendBL.selectAll("rect")
      .data(plotDataBL)
      .enter()
      .append("rect")
	  	.attr("x", widthBL - 65)
    	.attr("y", function(d, i){ return i *  20;})
	  	.attr("width", 10)
	  	.attr("height", 10)
	  	.style("fill", function(d) {
        return d.color;
      });

    legendBL.selectAll("text")
      .data(plotDataBL)
      .enter()
      .append("text")
    	.attr("fill", "#000")
	  	.attr("x", widthBL - 52)
    	.attr("y", function(d, i){ return i *  20 + 9;})
	  	.text(function(d) {
        return d.name;
      });

});
