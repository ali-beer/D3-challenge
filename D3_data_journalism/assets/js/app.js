// make responsive - as you resize your page, the chart resizes accordingly
function makeResponsive() {

    // if the SVG area is NOT empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");

    // '!' = not
    if (!svgArea.empty()) { 
        svgArea.remove();
    }

    // svg params
    var svgHeight = window.innerHeight;
    var svgWidth = window.innerWidth;

    // margins
    var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 60
    };

    // chart area minus margins
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    // create svg container
    var svg = d3.select("#scatter").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // shift everything over by the margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

   

    // Import Data
    d3.csv("assets/data/data.csv").then(function(demData) {

      // Parse Data/Cast as numbers
      // ==============================
      demData.forEach(function(d) {
          d.poverty = +d.poverty;
          d.healthcare = +d.healthcare;
        });
    
        console.log(demData);
    
      // Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
          .domain([8, d3.max(demData, d => d.poverty)+2])
          // map our values to be evenly spaced over width of the chart
          .range([0, chartWidth]);
    
      var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(demData, d => d.healthcare)+2])
          .range([chartHeight, 0]);
      
      // Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);

      // set x to the bottom of the chart
      chartGroup.append("g")
          .style("font", "14px sans-serif")
          .attr("class", "axis")
          .attr("transform", `translate(0, ${chartHeight})`)
          .call(bottomAxis);

      // set y to the y axis
      chartGroup.append("g")
          .style("font", "14px sans-serif")
          .attr("class", "axis")
          .call(leftAxis);

  

      // Create circles and text
      // ==============================
      // Create and place the blocks containing the circles and the text
      var elemBlocks = chartGroup.selectAll("g")
        .data(demData)
        .enter()
        .append("g")   
        
      // Create the circle for each block
      var circle = elemBlocks.append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "17")
        .attr("fill", "blue")
        .attr("opacity", ".3");

      // Create the text for each block
      elemBlocks.append("text")
        .text(function(d) {return d.abbr})
        .attr("text-anchor", "middle")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare)+6)

      
      // Create axes labels
      // ==============================
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", (0 - chartHeight/2 - 60))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

      chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 50})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
 
     

    // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
        });

      // Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);

      // Create event listeners to display and hide the tooltip
      // ==============================
      elemBlocks.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
      .on("mouseout", function(data, index) {
         toolTip.hide(data);
        });
      })
};  




// need to call makeResponsive so that our plot is shown
// when page loads
makeResponsive();

// Event listener for window resize. 
// When the browser window is resized, makeResponsive() is called.
// format for binding events - select an element and then we specify 
// inside of .on what event we want to listen to. 
// window is a special variable that refers to the window of the webpage 
// don't ever declare a variable called window otherwise will introduce some bugs
// d3.select window - and on resize event, run makeResponsive
d3.select(window).on("resize", makeResponsive);