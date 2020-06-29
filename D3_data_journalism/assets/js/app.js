// @TODO: YOUR CODE HERE!

    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
        top: 20,
        right: 40,
        bottom: 60,
        left: 100
    };
    
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    /// APPEND SVG ELEMENTS  
    //=====================
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("weight", svgWidth);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    //Import data from CSV
    //=====================

    d3.csv("assets/data/data.csv").then(function(health) {
        // if (error) throw error;
        console.log(health);

        // PARSE DATA
        //=====================
        health.forEach(function(data) {
            data.poverty = +data.poverty;
            data.obesity = +data.obesity;            
        });


        /// CREATE SCALE X TO CHART
        //=====================
        var xLinearScale = d3.scaleLinear()
        .domain([8.5, d3.max(health, d => d.poverty)])
        .range([0, width]);

        /// CREATE SCALE Y TO CHART  
        //=====================      
        var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(health, d => d.obesity)])
        .range([height, 0]);

        /// CREATE AXIS
        //=====================
        var yAxis = d3.axisLeft(yLinearScale);
        var xAxis = d3.axisBottom(xLinearScale)
        .ticks(8);
    
        chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis);
    
        chartGroup.append("g")
                .call(yAxis);

         /// CREATE CIRCLES 
        ///=====================   
        var circlesGroup = chartGroup.selectAll("circle")
                .data(health)
                .enter()
                .append("circle")
                .attr("cx", d => xLinearScale(d.poverty))
                .attr("cy", d => yLinearScale(d.obesity))
                .attr("r", "15")
                .attr("fill", "#008080")
                .attr("stroke", "black")
                .attr("stroke-width", "3")
                .attr("opacity", "0.75");

    // Step 1: Initialize Tooltip
    // =================
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}<br><strong>Poverty: ${d.poverty}%<br><strong>Obesity: ${d.obesity}%</strong>`);
    });
    chartGroup.call(toolTip);

  // Step 3: Create "mouseover" event listener to display tooltip
  // ==================
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
  // Step 4: Create "mouseout" event listener to hide tooltip
  // ==================
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

        // CREATE TEXT LABELS 
        // ==================

        var text = chartGroup.append("g").selectAll("text")
                .data(health)
                .enter()
                .append("text")
                .attr("x", d => xLinearScale(d.poverty))
                .attr("y", d => yLinearScale(d.obesity))
                .attr("font-size", "10")
                .style("text-anchor", "middle")
                .text(d => (d.abbr));

        // CREATE AXES LABELS 
        // ==================
          
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 10)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("axis-text", "true")
            .attr("text-anchor", "middle")
            .attr("font-weight", "700")
            .text("Lacks HealthCare (%)");

            chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`) 
            .attr("axis-text", "true")
            .attr("text-anchor", "middle")
            .attr("font-weight", "700")
            .text("In Poverty (%)");
    }).catch(function(error) {
        console.log(error);
    });
