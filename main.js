/*
  Implementing FCC https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-bar-chart
  Inspired by: https://codepen.io/freeCodeCamp/pen/GrZVaM
*/

const width = 800;
const height = 400;

let tooltip
let overlay
let svg

document.addEventListener('DOMContentLoaded', () => {
    tooltip = d3
    .select("#d3-container")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

    overlay = d3
      .select('#d3-container')
      .append('div')
      .attr('id', 'overlay')
      .style('opacity', 0)
  
    svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width + 100)
    .attr("height", height + 60)
})

fetch(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((res) => res.json())
  .then((res) => {
    const { data } = res;

    const xExtent = d3.extent(data, (d) => new Date(d[0]));
    const xScale = d3.scaleTime().domain(xExtent).range([0, width]);

    const xAxis = d3.axisBottom().scale(xScale);

    svg
      .append("g")
      .call(xAxis)
      .attr("id", "x-axis")
      .attr("transform", `translate(60, ${height})`);

    const [minGDP, maxGDP] = d3.extent(data, (d) => d[1]);
    const yScale = d3
      .scaleLinear()
      .domain([Math.min(0, minGDP), maxGDP])
      .range([height, 0]);

    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .call(yAxis)
      .attr("id", "y-axis")
      .attr("transform", "translate(60, 0)");

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d) => xScale(new Date(d[0])))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", 3)
      .attr("height", (d) => height - yScale(d[1]))
      .style("fill", "rebeccapurple")
      .attr("transform", "translate(60, 0)")
      .on('mouseover', (e, bar, i) => {
        overlay
          .transition()
          .duration(0)
          .style('height', yScale(bar[1]))
          .style('width', 3)
          .style('opacity', 0.9)
          .style('left', `${xScale(new Date(bar[0]))}px` )
          .style('top', `${height / 1.5}px`)

        tooltip
          .transition()
          .duration(100)
          .style('opacity', 0.9)
        
        tooltip
          .html(`<br /> $${bar[1].toFixed(2)} Billion`)
          .attr('data-date', bar[0])
          .style('left', `${xScale(new Date(bar[0]))}px` )
          .style('top', `${height / 1.5}px`)
      })
      .on('mouseout', () => {
        tooltip
          .transition()
          .duration(100)
          .style('opacity', 0)
        
        overlay
          .transition()
          .duration(100)
          .style('opacity', 0)
      });
  })
  .catch((err) => console.error({ err }));
