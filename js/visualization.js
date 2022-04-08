// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  d3.csv('data/GeographicalTotalDonation.csv').then(data => {

    // Initialize the shared dispatch object in D3 for several visualization.
    const dispatcher = d3.dispatch('linkFromBubbleMap', 'linkFromBarPlot')

    let geoDonationBubbleMap = bubbleMap()
      ('#bubbleMap', data, dispatcher)
    
    let geoDonationBarPlot = barPlot()
      ('#barPlot', data, dispatcher)
    
    let geoDonationPieChart = pieChart()
      ('#pieChart', data, dispatcher)
    
    let geoDonationAnalysis = donationAnalysis()
      ('#donationsAnalysis', data)

    // Register a callback that is triggered when a linkFromLineChart event is received.
    dispatcher.on('linkFromBubbleMap', function(selectedData) {
      geoDonationBarPlot.updateSelection(selectedData);
      geoDonationPieChart.updateSelection(selectedData);
      geoDonationAnalysis.updateSelection(selectedData);
    });

    // Register a callback that is triggered when a linkFromScatterplot event is received.
    dispatcher.on('linkFromBarPlot', function(selectedData) {
      geoDonationBubbleMap.updateSelection(selectedData);
      geoDonationPieChart.updateSelection(selectedData);
      geoDonationAnalysis.updateSelection(selectedData);
    });
  });

})());