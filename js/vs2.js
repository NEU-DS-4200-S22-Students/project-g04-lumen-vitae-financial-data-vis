
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
  for (const element of Object.entries(count)) {
    result.push({ "count": element[1], "label": element[0] })
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
  cleanedData = [PtCounter[0], SorCounter[0], DnCounter[0]]
  // labels 
  labels = [PtCounter[1], SorCounter[1], DnCounter[1]]
  // set up colors for each ring
  colors = [d3.scaleOrdinal(d3.schemeCategory10), d3.scaleOrdinal(d3.schemeDark2), d3.scaleOrdinal(d3.schemeTableau10)]

  // set up svg width height and etc
  var width = 1000;
  var height = 1000;
  var donutWidth = 75;
  var radius1 = Math.min(width, height) / 2;
  var svg = d3.select('#circularRing')
    .attr('width', width)
    .attr('height', height);

  // start a pie function to get the data
  var pie = d3.pie()
    .value(function (d) { return d.count; })
    .sort(null).padAngle(.005);

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

    radius1 = radius1 - donutWidth - 20

    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    // generate the ring
    svg1.selectAll('path')
      .data(pie(cleanedData[i]))
      .enter()
      .append('path')
      .attr('d', arc1)
      .attr('fill', function (d, i) {
        return color1(i);
      })
      .on("click", function (d, i, j) {
        // console.log(i)

        svg.selectAll('.label').text(i["data"]["label"])
        svg.selectAll('.value').text(i["data"]["count"])
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
      .data(d => {
        label = labels[i][d.index]
        
        if (label.length > 5) {
          label = label.substring(0,5) + "..."
        }
        console.log(label)
        return `${label}`.split(/\n/)
      })
      .join("tspan")
      .attr("x", 0)
      .attr("y", (_, i) => `${i * 1.1}em`)
      .attr("font-weight", (_, i) => i ? null : "bold")
      .text(d => d);
  }

  svg1.append("svg:circle")
    .attr("r", radius1 * 0.8)
    .style("fill", "#E7E7E7")

  svg1.append('text')
    .attr('class', 'center-txt type')
    .attr('y', radius1 * -0.4)
    .attr('text-anchor', 'middle')
    .style('font-weight', 'bold')
    .text("Details");
  svg1.append('text')
    .attr('class', 'center-txt label')
    .attr('text-anchor', 'middle');
  svg1.append('text')
    .attr('class', 'center-txt value')
    .attr('y', radius1 * 0.4).attr('text-anchor', 'middle');

}

// the main function to start the data transport
d3.csv('data/CircularRingVis.csv', function (d) {
  return {
    numberOfChildrenSponsored: d.DN,
    state: d.SoR,
    paymentType: d.PT,
  };
}).then(multiDountChart);