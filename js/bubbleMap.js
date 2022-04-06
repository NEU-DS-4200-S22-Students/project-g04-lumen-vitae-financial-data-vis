function bubbleMap() {
    const width = 1000
    const height = 1000
    const translate = (coords) => {
      const [x, y] = projection([+coords.lon, +coords.lat])
      return `translate(${x},${y})`
    }
    
  function chart(selector, data) {
    const extent = d3.extent(data.map(d => +d.amount))
    const radius =d3.scaleSqrt().domain(extent).range([10,40]);

    let svg = d3.select(selector)
        .attr('width', width)
        .attr('height',height);
    
    const projection = d3.geoMercator()
        .center([-100,40])
        .scale(850)
        .translate([ width/2, height/2 ])

    d3.json('data/gz_2010_us_040_00_500k.json').then( function(mapData){
      // Filter data
      mapData.features = mapData.features.filter(d => {console.log(d.properties.NAME); return d.properties.NAME !=="Alaska" && d.properties.NAME !=="Hawaii"})
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
      
      const Tooltip = d3.select('vis-hold')
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 1)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = function(event, d) {
        Tooltip.style("opacity", 1)
      }
      var mousemove = function(event, d) {
        console.log(d)
        Tooltip
          .html(d.stateName + "<br>" + "long: " + d.lon + "<br>" + "lat: " + d.lat)
          .style("left", (event.x)/2 + "px")
          .style("top", (event.y)/2 - 30 + "px")
      }
      var mouseleave = function(event, d) {
        Tooltip.style("opacity", 0)
      }
      
      // Set the color group
      const colorGroup =  d3.scaleOrdinal(d3.schemeDark2)
      // Add circles
      svg.selectAll('myCircles')
      .data(data)
      .join("circle")
        .attr("cx", d => projection([d.lon, d.lat])[0])
        .attr("cy", d => projection([d.lon, d.lat])[1])
        .attr("r", d=> radius(d.amount))
        .style("fill", (i) => colorGroup(i))
        .attr("stroke", "#69Wb3a2")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .5)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
    })
  
    // Add the legend
    const legend = svg.append('g')
      .attr("fill", "#777")
      .attr("transform", `translate(${width - 80},${height - 300})`)
      .attr("text-anchor", "middle")
      .style("font", "10px sans-serif")
      .selectAll(".legend")
      .data([1000, 10000, 100000])
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
    return chart; 
  }
  return chart;
}