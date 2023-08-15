function pieChart() {
    // set the dimensions and margins of the graph
    const width = 800,
    height = 800,
    margin = 60,
    legendWidth = 90,
    lengendHeight = 20;
    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin - legendWidth;
    let totalDonation = 0;
    let svg;
    let defaultDataSet;
    let maxDataLength;
    
    function chart(selector, data, selectionDispatcher){
        maxDataLength = data.length;
        // calculate the sum of the donation.
        for(let i = 0; i < data.length; i++){
          totalDonation = totalDonation + (+data[i].amount);         
        }

        // sort data
        data.sort(function(b, a) {
            return a.amount - b.amount;
        });

        // Simplfy the dataset. If length of dataset is larger than 3, only gain the largest 
        // three state donation amount and use {other, amount} to replace other information.
        let newData = [];
        if (data.length <= 3) {
            newData = data
        } else {
        let other =0;
        for(let i = 0; i < data.length; i++){
            if(i < 3){
            newData.push({stateName: data[i].stateName, amount:+data[i].amount});
            } else {
            other = other + (+data[i].amount);
            }
        }
        newData.push({stateName: 'other', amount:other});
        }
        defaultDataSet = newData;
        

        // append the svg object
        svg = d3.select(selector)
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);
        
        updatePieChart(svg, newData)
        
        return chart;
    }

    function updatePieChart(svg, newData) {
        svg.selectAll('path').remove()
        svg.selectAll('text').remove()

        // Add the title of the pie chart
        svg.append('text')
            .attr('y',-330)
            .style('stroke', 'black')
            .text('Geographical Donation Pie Chart')
            .style("text-anchor", "middle")
            .style('font-size', '50px');

        svg.selectAll('circle').remove()
        const colorCategory24 = ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc",
            "#e5d8bd","#fddaec","#f2f2f2", "#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9",
            "#fff2ae","#f1e2cc","#cccccc", "#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3",
            "#fdb462","#b3de69"]
        const color = d3.scaleOrdinal().range(colorCategory24);
        
        const pie = d3.pie()
        .value(function(d) {return d.amount})

        const data_ready = pie(newData)

        // shape helper to build arcs:
        const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

        svg
        .selectAll('mySlices')
        .data(data_ready)
        .join('path')
            .attr('d', arcGenerator)
            .attr('fill', function(d){ return(color(d.data.stateName)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        svg.selectAll('legend')
          .data(data_ready)
          .join('circle')
            .attr('cx', radius+margin/2 - 15)
            .attr('cy', (d,i)=> -radius + i * lengendHeight)
            .attr('r', 8)
            .attr('fill', d => color(d.data.stateName))

        svg
        .selectAll('legend')
        .data(data_ready)
        .join('text')
        .text(function(d){ return d.data.stateName +':'+ (Number.parseFloat(d.data.amount/totalDonation*100)).toFixed(2) + "%"})
        .attr('x', radius + margin/2)
        .attr('y', (d,i) => -radius + i * lengendHeight + 5)
        .style("font-size", 12)
    }
    
    chart.updateSelection = function (selectedData) {
        let unselectedStateDonation = totalDonation
        let updatedData = [];
        if (selectedData.length == 0){
            updatePieChart(svg, defaultDataSet)
        } else {
            for(let i = 0; i < selectedData.length; i++){  
                updatedData.push({stateName: selectedData[i].stateName, amount:+selectedData[i].amount});
                unselectedStateDonation = unselectedStateDonation - (+selectedData[i].amount);
            }
            if (selectedData.length !== maxDataLength) {
                updatedData.push({stateName: 'other', amount:+unselectedStateDonation})
            }
            updatePieChart(svg, updatedData)
        }

    }
    return chart;
}
  