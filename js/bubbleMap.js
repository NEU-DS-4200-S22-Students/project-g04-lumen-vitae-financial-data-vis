function bubbleMap() {
  const width = 1000
  const height = 1000
  const translate = (coords) => {
    const [x, y] = projection([+coords.lon, +coords.lat])
    return `translate(${x},${y})`
  }
  brushEnd = false
  let allBubbles;
    
  function chart(selector, data, selectionDispatcher) {
    const extent = d3.extent(data.map(d => +d.amount))
    const radius =d3.scaleSqrt().domain(extent).range([10,60]);

    let svg = d3.select(selector)
        .append('svg')
        .attr('width', width)
        .attr('height',height);
    
    const projection = d3.geoMercator()
        .center([-100,40])
        .scale(850)
        .translate([ width/2, height/2 ])

    d3.json('data/gz_2010_us_040_00_500k.json').then( function(mapData){
      // Filter data
      mapData.features = mapData.features.filter(d => {return d.properties.NAME !=="Alaska" && d.properties.NAME !=="Hawaii"})
      // Draw the map
      svg.append("g")
          .selectAll("path")
          .data(mapData.features)
          .join("path")
          .attr("fill", "grey")
          .attr("d", d3.geoPath()
            .projection(projection)
          )
          .style("stroke", "black")
          .style("opacity", .3)
      
      // Set the color group
      const colorGroup =  d3.scaleOrdinal(d3.schemeDark2)
      // Add circles
      let circles = svg.selectAll('myCircles')
      .data(data)
      .join("circle")
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy", d => projection([d.lon, d.lat])[1])
        .attr("r", d=> radius(d.amount))
        .attr("class", "circle")
        .style("fill", (i) => colorGroup(i))
        .attr("stroke", "#69Wb3a2")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .5)

      allBubbles = circles;

      // Add the brushing functionality in the linechart
      const brush = d3.brush()
        .on("start brush", brushed)
        .on("end",endBrushed);

      svg.call(brush)

      function brushed({selection}) {
        if (!brushEnd){
          if (selection) {
            // selection isn't null, so let's figure out the extent
            const [[x0, y0], [x1, y1]] = selection;
            // Change the points style by setting the enclosed points' class to "selected"
            circles.classed('selected', d => x0 <= projection([d.lon, d.lat])[0] && projection([d.lon, d.lat])[0] <= x1 && y0 <= projection([d.lon, d.lat])[1] && projection([d.lon, d.lat])[1] <= y1)
          } else {
            // When click the area out of the rectangle, all the points would be not selected
            circles.classed('selected', false)
          }

          // Calling the dispatch 'linkFromLineChart' function with the arguments of selected data 
          // after classing the selected points during the brushing.
          selectionDispatcher.call('linkFromBubbleMap', this, svg.selectAll('.selected').data())
        }
      }

      // Pretty tricky functinon.
      // Change the brushEnd field to avoid endless loop.
      function endBrushed() {
        if(!brushEnd){
          brushEnd = true
          d3.select(this).call(brush.clear)
          brushEnd = false
        }
      }
    })
    
    // Add the title of the vis
    svg.append('text')
      .attr('x', 150)
      .attr('y', 130)
      .style('stroke', 'black')
      .text('Donation Source Bubble Map')
      .style('font-size', '50px')
      .attr('fill', 'black');
  
    // Add the legend
    const legend = svg.append('g')
      .attr("fill", "#777")
      .attr("transform", `translate(${width - 80},${height - 300})`)
      .attr("text-anchor", "middle")
      .style("font", "10px sans-serif")
      .selectAll(".legend")
      .data([1000, 30000, 100000])
      .join("g")
  
    legend.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("cy", d => -radius(d))
      .attr("r", radius);
  
    legend.append("text")
      .attr("y", d => -2 * radius(d))
      .attr("dy", "1.3em")
      .text(d => d)
    
    svg.append("text")
      .attr('x', 820)
      .attr('y', 720)
      .style('stroke', 'black')
      .text('Size: Donation Amount')
      .style('font-size', '13px')
      .attr('fill', 'black');

    svg.append("text")
      .attr('x', 820)
      .attr('y', 740)
      .style('stroke', 'black')
      .text('Number: Threshold Amount')
      .style('font-size', '13px')
      .attr('fill', 'black');
    
    return chart; 
  }

  chart.updateSelection = function (selectedData) {
    allBubbles.classed('selected', d => selectedData.includes(d))
  }

  return chart;
}