function barPlot() {
  // set the dimensions and margins of the graph
  const margin = {top: 30, right: 30, bottom: 70, left: 60},
  width = 1000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;
  let allBars;

  function chart(selector, data, selectionDispatcher){
    // append the svg object
    const svg = d3.select(selector)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // sort data
    data.sort(function(b, a) {
        return a.amount - b.amount;
    });

    const x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(d => d.stateName))
      .padding(0.2);

    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 250000])
      .range([ height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));    

    // Bars
    let bars = svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
        .attr('class', 'bars')
        .attr("x", d => x(d.stateName))
        .attr("y", d => y(d.amount))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.amount))
        .attr("fill", "#69b3a2")
        .on('mouseover',function(d){
          svg.selectAll('.selected').classed('selected', false)
          let hoverBar = svg.selectAll(':hover')
          hoverBar.classed('selected', true)
          selectionDispatcher.call('linkFromBarPlot', this, hoverBar.data())
        })
    allBars = bars;
        
    return chart;
  }

  chart.updateSelection = function (selectedData) {
    allBars.classed('selected', d => selectedData.includes(d))
  }
    
  return chart;
}
