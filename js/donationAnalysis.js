function donationAnalysis() {
    // set the dimensions and margins of the graph
    const width = 800,
    height = 800,
    margin = 40;
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
        
        updateDonationAnalysis(svg, newData)
        
        return chart;
    }

    function updateDonationAnalysis(svg, newData) {
        svg.selectAll('text').remove()

        svg.append('text')
            .attr('y',-330)
            .style('stroke', 'black')
            .text('Geographical Donation List')
            .style("text-anchor", "middle")
            .style('font-size', '50px');

        svg.append('text')
            .attr('y',-270)
            .style('stroke', 'black')
            .text('Total Donation Amounts: ' + totalDonation)
            .style("text-anchor", "middle")
            .style('font-size', '30px');
        
        for(let i = 0; i < newData.length; i++){
          svg.append('text')
            .attr('y', -240 + 25 * (i+1))
            .style('stroke', 'blue')
            .text(newData[i].stateName + ":  " + newData[i].amount)
            .style("text-anchor", "middle")
            .style('font-size', '25px');     
        }
    }
    
    chart.updateSelection = function (selectedData) {
        let unselectedStateDonation = totalDonation
        let updatedData = [];
        if (selectedData.length == 0){
            updateDonationAnalysis(svg, defaultDataSet)
        } else {
            for(let i = 0; i < selectedData.length; i++){  
                updatedData.push({stateName: selectedData[i].stateName, amount:+selectedData[i].amount});
                unselectedStateDonation = unselectedStateDonation - (+selectedData[i].amount);
            }
            if (selectedData.length !== maxDataLength) {
                updatedData.push({stateName: 'other', amount:+unselectedStateDonation})
            }
            updateDonationAnalysis(svg, updatedData)
        }

    }
    return chart;
}
  