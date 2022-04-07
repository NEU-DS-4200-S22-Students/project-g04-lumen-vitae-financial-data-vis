// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  d3.csv('data/GeographicalTotalDonation.csv').then(data => {

    let geoDonationBubbleMap = bubbleMap()
      ('#bubbleMap', data)
  });

})());