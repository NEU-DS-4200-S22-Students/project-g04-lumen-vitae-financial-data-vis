
// A helper function that helps to clean and count data
function counter(arr) {
  const count = {};

  for (const element of arr) {
    if (count[element]) {
      count[element] += 1;
    } else {
      count[element] = 1;
    }
  }
  // console.log(count)
  var other = 0
  for (const element of Object.keys(count)) {
    if (count[element] < 10) {
      other = other + count[element]
      delete count[element]
    }
  }

  count["other"] = other

  // clean data to d3 likes
  result = []
  for (const element of Object.values(count)) {
    result.push({ "count": element })
  }

  return [result, Object.keys(count)]
}

// 3 ring dount chart 
function multiDountChart(data) {
  // console.log(data)
  // clean and get the data d3 want for each ring
  const arrayColumn = (arr, n) => arr.map(x => x[n]);

  DnCounter = counter(arrayColumn(data, "numberOfChildrenSponsored"))
  // console.log(DnCounter)

  SorCounter = counter(arrayColumn(data, "state"))
  // console.log(SorCounter)

  PtCounter = counter(arrayColumn(data, "paymentType"))
  // console.log(PtCounter)


  // get clean data
  cleanedData = [DnCounter[0], SorCounter[0], PtCounter[0]]
  // labels 
  labels = [DnCounter[1], SorCounter[1], PtCounter[1]]
  // set up colors for each ring
  colors = [d3.scaleOrdinal(d3.schemeCategory10), d3.scaleOrdinal(d3.schemeDark2), d3.scaleOrdinal(d3.schemeTableau10)]

  // set up svg width height and etc
  var width = 1000;
  var height = 1000;
  var donutWidth = 75;
  var radius1 = Math.min(width, height) / 2;
  var svg = d3.select('#vis-svg-1')
    .attr('width', width)
    .attr('height', height);

  // start a pie function to get the data
  var pie = d3.pie()
    .value(function (d) { return d.count; })
    .sort(null);

  // recursion will generate 3 ring
  for (let i = 0; i < 3; i++) {

    // get color 
    var color1 = colors[i]

    // genereate image
    var svg1 = svg.append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    // calculate angle
    var arc1 = d3.arc()
      .innerRadius(radius1 - donutWidth)
      .outerRadius(radius1);

    labelRadius = (radius1 + radius1 - donutWidth) / 2

    radius1 = radius1 - donutWidth

    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    // generate the ring
    svg1.selectAll('path')
      .data(pie(cleanedData[i]))
      .enter()
      .append('path')
      .attr('d', arc1)
      .attr('fill', function (d, i) {
        return color1(i);
      });


    // genereate label
    svg1.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 20)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(pie(cleanedData[i]))
      .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .selectAll("tspan")
      .data(d => `${labels[i][d.index]}`.split(/\n/))
      .join("tspan")
      .attr("x", 0)
      .attr("y", (_, i) => `${i * 1.1}em`)
      .attr("font-weight", (_, i) => i ? null : "bold")
      .text(d => d);
  }

}

// the main function to start the data transport
d3.csv('data/CircularRingVis.csv', function (d) {
  return {
    numberOfChildrenSponsored: d.DN,
    state: d.SoR,
    paymentType: d.PT,
  };
}).then(multiDountChart);