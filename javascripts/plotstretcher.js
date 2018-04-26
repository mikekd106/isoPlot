/* plotstretcher.js | Copyright 2017, isoPlot. | MIT Licensed */
function plot(file, container, ay1, ay2, tranA, tranB) {
  //r zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);
  var filename = file;

  //var data=require(filename);
  //var datasize= data.length;

  var width = 1235,
    height = 285;
  active = d3.select(null);

  var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed)


  var svg = d3.select(container)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    /*	.call(d3.zoom()   //this works, but wont locate in the middle
            .scaleExtent([1 / 2, 4])
            .on("zoom", zoomed))*/

    .call(d3.zoom().on("zoom", function() {
      g.attr("transform", d3.event.transform)
    }))

  svg
    .call(zoom);
  var tranA_name = svg.append("text").text(tranA)
    .attr("font-family", "'Dosis', sans-serif").attr("font-size", "13px").attr("fill", "#0a116f")
    .attr('x', 10).attr('y', 30);

  var tranB_name = svg.append("text").text(tranB)
    .attr("font-family", "'Dosis', sans-serif").attr("font-size", "13px").attr("fill", "#0a116f")
    .attr('x', 10).attr('y', 65);

  var g = svg.append("g");

  d3.json(filename, function(data) {
    var datasize = data.length;
    var scaling = d3.scaleLinear() //since the data is bigger than the canvas, scale it!
      .domain([0, datasize])
      .range([0, 850]);
    addstrline(110, 960, 25, g) //draw the middle line for the intron
    addstrline(110, 960, 60, g)
    var sten_a = (findfirstexon(data, "a"));
    var start_a = sten_a[0]
    var end_a = sten_a[1]
    var exonanno_a = [
      [start_a - 1, ((end_a + 1) - (start_a - 1))]
    ]; //first exon
    while (true) {
      sten_a = (findnextexon(data, end_a, "a"));
      start_a = sten_a[0], end_a = sten_a[1];
      if (end_a === data.length) {
        break;
      }
      exonanno_a.push([start_a - 1, ((end_a + 1) - (start_a - 1))]); //all middle exons
    }
    exonanno_a.push([start_a - 1, ((end_a + 1) - (start_a - 1))]); //add last exon

    var sten_b = (findfirstexon(data, "b"));
    var start_b = sten_b[0]
    var end_b = sten_b[1]
    var exonanno_b = [
      [start_b, ((end_b + 1) - (start_b - 1))]
    ]; //first exon, the 2 here is to prevent the removal of duplicate data, i am out of better solution....
    while (true) {
      sten_b = (findnextexon(data, end_b, "b"));
      start_b = sten_b[0], end_b = sten_b[1];
      if (end_b === data.length) {
        break;
      }
      exonanno_b.push([start_b, ((end_b + 1) - (start_b - 1))]); //all middle exons
    }
    exonanno_b.push([start_b, ((end_b + 1) - (start_b - 1))]); //add last exon

    g.selectAll("rect") //plot the background for the alignment, and later plot the border to the front
      .data(exonanno_a)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return scaling(d[0]) + 110
      })
      .attr("y", ay1)
      .attr("width", function(d, i) {
        return scaling(d[1])
      })
      .attr("height", 20)
      .attr("fill", "#D8DCFF")
      .attr("stroke", "transparent")

    g.selectAll("rect") //the second one
      .data(exonanno_b, function(d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return scaling(d[0]) + 110
      })
      .attr("y", ay2)
      .attr("width", function(d, i) {
        return scaling(d[1])
      })
      .attr("height", 20)
      .attr("fill", "#D8DCFF")
      .attr("stroke", "transparent")



    g.selectAll("line")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", function(d, i) {
        return scaling(i) + 110;
      })
      .attr("x2", function(d, i) {
        return scaling(i) + 110;
      })
      .attr("y1", ay1)
      .attr("y2", ay1 + 20)
      .attr("stroke", function(d) {
        if (d.a === '-') {
          return "#C6C7C4"
        } else if (d.a === 'i') {
          return "#f975b2"
        } else if (d.a === 'n') {
          return "transparent"
        } else if (d.a === 'o') {
          return "transparent"
        } else {
          return "#FFE1A8"
        };

      })

    g.selectAll("line")
      .data(data, function(d) {
        return d;
      })
      .enter()
      .append("line")
      .attr("x1", function(d, i) {
        return scaling(i) + 110;
      })
      .attr("x2", function(d, i) {
        return scaling(i) + 110;
      })
      .attr("y1", ay2)
      .attr("y2", ay2 + 20)
      .attr("stroke", function(d) {
        if (d.b === '-') {
          return "#C6C7C4"
        } else if (d.b === 'i') {
          return "#f975b2"
        } else if (d.b === 'n') {
          return "transparent"
        } else if (d.b === 'o') {
          return "transparent"
        } else {
          return "#FFE1A8"
        };

      });

    g.selectAll("notathing") //plot the border to the front, notathing and cannot possibly overlap is to prevent the data being considered as repeat
      .data(exonanno_a, function(d) {
        return d.id + " cannot possibly overlap!!";
      })
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return scaling(d[0]) + 110
      })
      .attr("y", ay1)
      .attr("width", function(d, i) {
        return scaling(d[1])
      })
      .attr("height", 20)
      .attr("ry", 1)
      .attr("rx", 1)
      .attr("fill", "transparent")
      .attr("stroke", "#2d0acc")
      .attr("stroke-width", 1);

    g.selectAll("notathing") //the second one
      .data(exonanno_b, function(d) {
        return d.id + " cannot possibly overlap";
      })
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return scaling(d[0]) + 110
      })
      .attr("y", ay2)
      .attr("width", function(d, i) {
        return scaling(d[1])
      })
      .attr("height", 20)
      .attr("ry", 1)
      .attr("rx", 1)
      .attr("fill", "transparent")
      .attr("stroke", "#2d0acc")
      .attr("stroke-width", 1);



  }) //end of dataplot


  svg.append("rect")
    .attr("class", "backgroundstr")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

  function findfirstexon(data, count) {
    var start = 0,
      end = 0;
    for (i = 0; i < data.length; i++) {
      var check = true;
      if (i + 30 < data.length) { //dont want to end at "o" position
        if (data[i][count] === 'o') {
          for (j = 0; j < 30; j++) {
            if (data[i + j][count] === 'a' || data[i + j][count] === 'i' || data[i + j][count] === '-') {
              check = false;
            }
          }
          if (check && data[i + 29][count] === 'n') {
            end = i;
            break;
          }
        }
      }
      if (data[i][count] === 'n') {
        end = i;
        break;
      }
    }
    return [start, end]
  }

  function findnextexon(data, lastend, count) {
    var tstart = 0,
      tend = data.length;
    for (i = lastend; i < data.length; i++) {
      if (data[i][count] === 'a' || data[i][count] === 'i' || data[i][count] === '-') {
        tstart = i;
        break;
      }
    }

    for (i = tstart; i < data.length; i++) {
      var check = true;
      if (i + 30 < data.length) { //dont want to end at "o" position
        if (data[i][count] === 'o') {
          for (j = 0; j < 30; j++) {
            if (data[i + j][count] === 'a' || data[i + j][count] === 'i' || data[i + j][count] === '-') {
              check = false;
            }
          }
          if (check && data[i + 29][count] === 'n') {
            tend = i;
            break;
          }
        }
      }
      if (data[i][count] === 'n') {
        tend = i;
        break;
      }
    }
    return [tstart, tend]
  }

  function zoomed() {
    g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
    g.attr("transform", d3.event.transform); // updated for d3 v4
  }

  function reset() {
    active.classed("active", false);
    active = d3.select(null);

    svg.transition()
      .duration(750)
      // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
      .call(zoom.transform, d3.zoomIdentity); // updated for d3 v4
  }


}

function addstrline(x1, x2, y, obj) {
  var myLine = obj.append("svg:line")
    .attr("x1", x1)
    .attr("y1", y)
    .attr("x2", x2)
    .attr("y2", y)
    .style("stroke", "#2d0acc")
    .attr("stroke-width", 2);
}
