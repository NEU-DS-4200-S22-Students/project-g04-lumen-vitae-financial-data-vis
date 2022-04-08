function pieChart() {
    // set the dimensions and margins of the graph
    // set the dimensions and margins of the graph
    const width = 600,
    height = 600,
    margin = 40;
    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin
    let totalDonation = 0;
    let svg;
    let defaultDataSet;
    
    function chart(selector, data, selectionDispatcher){

        // calculate the sum of the donation.
        for(let i = 0; i < data.length; i++){
          totalDonation = totalDonation + (+data[i].amount);         
        }

        console.log(totalDonation)

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
        console.log(newData);
        

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
        const color = d3.scaleOrdinal()
        .range(d3.schemeSet2);
        
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

        svg
        .selectAll('mySlices')
        .data(data_ready)
        .join('text')
        .text(function(d){ return d.data.stateName +':  '+ (Number.parseFloat(d.data.amount/totalDonation*100)).toFixed(2) + "%"})
        .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
        .style("text-anchor", "middle")
        .style("font-size", 17)
    }
    
    chart.updateSelection = function (selectedData) {
        console.log(selectedData)
        let unselectedStateDonation = totalDonation
        let updatedData = [];
        if (selectedData.length == 0){
            updatePieChart(svg, defaultDataSet)
        } else {
            for(let i = 0; i < selectedData.length; i++){  
                updatedData.push({stateName: selectedData[i].stateName, amount:+selectedData[i].amount});
                unselectedStateDonation = unselectedStateDonation - (+selectedData[i].amount);
            }
            if (unselectedStateDonation !== 0) {
                updatedData.push({stateName: 'other', amount:+unselectedStateDonation})
            }
            updatePieChart(svg, updatedData)
        }

    }
    return chart;
}
  