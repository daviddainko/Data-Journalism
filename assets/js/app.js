var svgWidth = 960;
var svgHeight = 540;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight+60);

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.right})`);

    // Import Data
d3.csv('./assets/data/data.csv')
    .then(function(stateData){

    // Parse data as numbers
    stateData.forEach(function(data){
        data.poverty = +data.poverty
        data.healthcare = +data.healthcare
    });

    var xMin = d3.min(stateData, d => d.poverty*0.95)
    var xMax = d3.max(stateData, d => d.poverty*1.05)
    var yMin = d3.min(stateData, d => d.healthcare*0.98)
    var yMax = d3.max(stateData, d => d.healthcare*1.02)

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0,width]);

    var yLinearScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

        // Create circles
    chartGroup.selectAll('circle')
        .data(stateData)
        .enter()
        .append('circle')
        .attr('cx', d => xLinearScale(d.poverty))
        .attr('cy', d => yLinearScale(d.healthcare))
        .attr('r', '15')
        .attr('fill', 'lightblue')
        .attr('opacity','0.5')

    chartGroup.append('text')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .selectAll('tspan')
        .data(stateData)
        .enter()
        .append('tspan')
            .attr('x', d => xLinearScale(d.poverty))
            .attr('y', d => yLinearScale(d.healthcare-0.2))
            .text(d => d.abbr);

    // Append Axes to the chart
    chartGroup.append('g')
        .attr('transform', `translate(0, ${height+20})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);


    // Create axes labels
    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 40)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .attr('class', 'axisText')
        .text('Lacks Healthcare (%)') 

    chartGroup.append('text')
        .attr('transform', `translate(${width/2}, ${height + margin.top + 30})`)
        .attr('class', 'axisText')
        .text("In Poverty (%)")

});
