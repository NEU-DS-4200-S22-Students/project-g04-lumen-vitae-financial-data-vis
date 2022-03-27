
function GroupedCircularRingChart(data) {

    // console.log(data)


    // data collect
    const arrayColumn = (arr, n) => arr.map(x => x[n]);

    DnCounter = counter(arrayColumn(data, "numberOfChildrenSponsored"))
    console.log(DnCounter)
    SorCounter = counter(arrayColumn(data, "state"))
    // console.log(SorCounter)
    PtCounter = counter(arrayColumn(data, "paymentType"))
    // console.log(PtCounter)

    var cleanedData = {
        "name": "DN", "children": [
            ""
        ]
    }




    // var nodeData = {
    //     "name": "TOPICS", "children": [{
    //         "name": "Topic A",
    //         "children": [{ "name": "Sub A1", "size": 4 }, { "name": "Sub A2", "size": 4 }]
    //     }, {
    //         "name": "Topic B",
    //         "children": [{ "name": "Sub B1", "size": 3 }, { "name": "Sub B2", "size": 3 }, {
    //             "name": "Sub B3", "size": 3
    //         }]
    //     }, {
    //         "name": "Topic C",
    //         "children": [{ "name": "Sub A1", "size": 4 }, { "name": "Sub A2", "size": 4 }]
    //     }]
    // };

    // var width = 1000;
    // var height = 1000;
    // var radius = Math.min(width, height) / 2;
    // var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, 4))


    // // Create primary <g> element
    // var g = d3.select('#vis-svg-1')
    //     .attr('width', width)
    //     .attr('height', height)
    //     .append('g')
    //     .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // // Data strucure
    // var partition = d3.partition()
    //     .size([2 * Math.PI, radius]);

    // // Find data root
    // var root = d3.hierarchy(nodeData)
    //     .sum(function (d) { return d.size });

    // // Size arcs
    // partition(root);
    // var arc = d3.arc()
    //     .startAngle(function (d) { return d.x0 })
    //     .endAngle(function (d) { return d.x1 })
    //     .innerRadius(function (d) { return d.y0 })
    //     .outerRadius(function (d) { return d.y1 });

    // // Put it all together
    // g.selectAll('path')
    //     .data(root.descendants())
    //     .enter().append('path')
    //     .attr("display", function (d) { return d.depth ? null : "none"; })
    //     .attr("d", arc)
    //     .style('stroke', '#fff')
    //     .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); });


}

function counter(arr) {
    const count = {};

    for (const element of arr) {
        if (count[element]) {
            count[element] += 1;
        } else {
            count[element] = 1;
        }
    }

    return count
}

// d3.csv('data/CircularRingVis.csv', function (d) {
//     return {
//         numberOfChildrenSponsored: d.DN,
//         state: d.SoR,
//         paymentType: d.PT,
//     };
// }).then(GroupedCircularRingChart);


function DonutChart(data, {

    title, // given d in data, returns the title text
    width = 1000, // outer width, in pixels
    height = 1000, // outer height, in pixels
    innerRadius = Math.min(width, height) / 3, // inner radius of pie, in pixels (non-zero for donut)
    outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
    labelRadius = (innerRadius + outerRadius) / 2, // center radius of labels
    format = ",", // a format specifier for values (in the label)
    names, // array of names (the domain of the color scale)
    colors, // array of colors for names
    stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
    strokeWidth = 1, // width of stroke separating wedges
    strokeLinejoin = "round", // line join of stroke separating wedges
    padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
} = {}) {

    // data collect
    const arrayColumn = (arr, n) => arr.map(x => x[n]);

    DnCounter = counter(arrayColumn(data, "numberOfChildrenSponsored"))
    console.log(Object.keys(DnCounter))
    SorCounter = counter(arrayColumn(data, "state"))
    // console.log(SorCounter)
    PtCounter = counter(arrayColumn(data, "paymentType"))
    // console.log(PtCounter)


    // Compute values.
    const N = Object.keys(DnCounter);
    const V = Object.values(DnCounter);
    const I = d3.range(N.length).filter(i => !isNaN(V[i]));

    // Unique the names.
    if (names === undefined) names = N;
    names = new d3.InternSet(names);

    // Chose a default color scheme based on cardinality.
    if (colors === undefined) colors = d3.schemeSpectral[names.size];
    if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);

    // Construct scales.
    const color = d3.scaleOrdinal(names, colors);

    // Compute titles.
    if (title === undefined) {
        const formatValue = d3.format(format);
        title = i => `${N[i]}\n${formatValue(V[i])}`;
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }

    // Construct arcs.
    const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    const svg = d3.select("#vis-svg-1")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", strokeLinejoin)
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => color(N[d.data]))
        .attr("d", arc)
        .append("title")
        .text(d => title(d.data));

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .selectAll("tspan")
        .data(d => {
            const lines = `${title(d.data)}`.split(/\n/);
            return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
        })
        .join("tspan")
        .attr("x", 0)
        .attr("y", (_, i) => `${i * 1.1}em`)
        .attr("font-weight", (_, i) => i ? null : "bold")
        .text(d => d);

    return Object.assign(svg.node(), { scales: { color } });
}

d3.csv('data/CircularRingVis.csv', function (d) {
    return {
        numberOfChildrenSponsored: d.DN,
        state: d.SoR,
        paymentType: d.PT,
    };
}).then(DonutChart);