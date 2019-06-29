// Build svg object
var svgWidth = 900;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group, and shift the chart by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function (healthData) {

    console.log(healthData)
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function (data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, data => data.healthcare)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, data => data.poverty)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // Step 5: Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% in Poverty");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Lacks Healthcare % ");

    // Step 6: Create Circles
    // ==============================
    var circles = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .classed("stateCircle", true)
      .attr("cx", data => xLinearScale(data.healthcare))
      .attr("cy", data => yLinearScale(data.poverty))
      .attr("r", "15")
      .attr("opacity", ".4");

    // Step 7: Add States to Circles
    // ==============================
    var stateAbbr = chartGroup.selectAll("text.stateText")
      .data(healthData)
      .enter() 
      .append("text")
      .classed("stateText", true)
      .attr("x", data => xLinearScale(data.healthcare))
      .attr("y", data => yLinearScale(data.poverty))
      .attr("font-size", 15)
      .text(data => data.abbr);
  });


