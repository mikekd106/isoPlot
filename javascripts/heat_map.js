/**
* heat_map.js
* Copyright 2017, isoPlot.
* Licensed under the MIT license
*/
function heatmap_display(columnsID, rowsID, heatmapId) {
  for(var i= columnsID.length - 1; i >= 0; i--){
    if( 
columnsID[i].substr(11,1) === "T") 
columnsID.splice(i, 1);
//delete columnsID[x];
    }

     for(var i= rowsID.length - 1; i >= 0; i--) {
    if( rowsID[i].substr(11,1) === "T") 
rowsID.splice(i, 1);
//delete rowsID[x];
    }

    var margin = {
            top: 150,
            right: 500,
            bottom: 150,
            left: 100
        },
        cellSize = 24,
        col_number = columnsID.length,
        row_number = rowsID.length,
        width = cellSize * col_number, // - margin.left - margin.right,
        height = cellSize * row_number, // - margin.top - margin.bottom,
        //gridSize = Math.floor(width / 24),
        legendElementWidth = cellSize * 1.5,
        colorBuckets = '10',
        colors = ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"].reverse(),
        rowLabel = rowsID, // change to gene name or probe id
        colLabel = columnsID; // change to contrast name
    // hcrow = [49,11,30,4,18,6,12,20,19,33,32,26,44,35,38,3,23,41,22,10,2,15,16,36,8,25,29,7,27,34,48,31,45,43,14,9,39,1,37,47,42,21,40,5,28,46,50,17,24,13], // change to gene name or probe id
    // hccol = [6,5,41,12,42,21,58,56,14,16,43,15,17,46,47,48,54,49,37,38,25,22,7,8,2,45,9,20,24,44,23,19,13,40,11,1,39,53,10,52,3,26,27,60,50,51,59,18,31,32,30,4,55,28,29,57,36,34,33,35], // change to gene name or probe id


    var loading=d3.select(heatmapId).append("svg")
        .attr("width", 800)
        .attr("height", 400)
var imgs = loading.selectAll("image").data([0]);
            imgs.enter()
            .append("svg:image")
            .attr("xlink:href", "images/Loading_icon.gif")
            .attr("x", 70)
             .attr("y", 70)
             .attr("width", 150)
            .attr("height", 150)
		.attr("title","By Ahm masum (Own work) [CC BY-SA 4.0 (http://creativecommons.org/licenses/by-sa/4.0)], via Wikimedia Commons");

var loadtext=loading.append('text').text('Loading a large document, might take some time, thank you!')
        .attr("font-family", "'Dosis', sans-serif").attr("font-size", "15px").attr("fill", "#0a116f")
        .attr('x', 15).attr('y', 200).attr('width', width).attr('height',200)
               




    var urlAlign = "http://isoplot.iis.sinica.edu.tw/find_align?columnsID="
    var urlAlignFile = 'http://isoplot.iis.sinica.edu.tw/find_alignfile?'
    d3.json(urlAlign + columnsID + "&rowsID=" + rowsID, function(error, data) {
        d3.select(heatmapId).selectAll("svg").remove()

        var colorScale = d3.scaleQuantize()
            .domain([0, 100])
            .range(colors);

        var svg = d3.select(heatmapId).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var rowSortOrder = false;
        var colSortOrder = false;
        var rowLabels = svg.append("g")
            .selectAll(".rowLabelg")
            .data(rowLabel)
            .enter()
            .append("text")
            .text(function(d) {
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return i * cellSize;
            })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + cellSize / 1.5 + ")")
            .attr("class", function(d, i) {
                return "rowLabel mono r" + i;
            })
            .on("mouseover", function(d) {
                d3.select(this).classed("text-hover", true);
            })
            .on("mouseout", function(d) {
                d3.select(this).classed("text-hover", false);
            })
            .on("click", function(d, i) {
                rowSortOrder = !rowSortOrder;
                sortbylabel("r", i, rowSortOrder);
            });
        //d3.select("#order").property("selectedIndex", 4).node().focus();;

        var colLabels = svg.append("g")
            .selectAll(".colLabelg")
            .data(colLabel)
            .enter()
            .append("text")
            .text(function(d) {
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return i * cellSize;
            })
            .style("text-anchor", "left")
            .attr("transform", "translate(" + cellSize / 2 + ",-6) rotate (-90)")
            .attr("class", function(d, i) {
                return "colLabel mono c" + i;
            })
            .on("mouseover", function(d) {
                d3.select(this).classed("text-hover", true);
            })
            .on("mouseout", function(d) {
                d3.select(this).classed("text-hover", false);
            })
            .on("click", function(d, i) {
                colSortOrder = !colSortOrder;
                sortbylabel("c", i, colSortOrder);
            });
        //d3.select("#order").property("selectedIndex", 4).node().focus();;

        var heatMap = svg.append("g").attr("class", "g3")
            .selectAll(".cellg")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return d.col * cellSize;
            })
            .attr("y", function(d) {
                return d.row * cellSize;
            })
            .attr("class", function(d) {
                return "cell cell-border cr" + (d.row) + " cc" + (d.col);
            })
            .attr("width", cellSize)
            .attr("height", cellSize)
            .style("fill", function(d) {
                if (d.value != null)
                    return colorScale(d.value)
                else
                    return "white"
            })
            .on("click", function(d) {
                var index = heatmapId.substr(8);
                document.getElementById("transcriptA" + index).innerHTML = colLabel[d.col];
                document.getElementById("transcriptB" + index).innerHTML = rowLabel[d.row];
                var tranA = document.getElementById("transcriptA" + index).innerHTML;
                var tranB = document.getElementById("transcriptB" + index).innerHTML;

                d3.select("body").select("#speTrans" + index).selectAll("svg").remove();

                //var tranArray = [];
                d3.json(urlAlignFile + "transcriptA=" + tranA + "&transcriptB=" + tranB, function(error, data) {
                    //thi = $("#download_btn" + heatmapId.substr(8))
                    var url = 'http://isoplot.iis.sinica.edu.tw/allalignjson/' + data.fileName + '.json';
                    //thi.after($("<a>").css('display', 'none').attr('href', url).attr('download', data.fileName).attr('id', 'file' + heatmapId.substr(8)))
                    //console.log(data.fileName);
                    //console.log(url);
                    var ay1 = 15;
                    var ay2 = 50;
                    if (tranA[0] > tranB[0]) {
                        ay1 = 50;
                        ay2 = 15;
                    } else if (tranA[0] === tranB[0]) {
                        if (tranA[1] > tranB[1]) {
                            //console.log(tranA[1],tranB[1]);					
                            ay1 = 50;
                            ay2 = 15;
                        }
                    };

                    plot(url, "#speTrans" + index, ay1, ay2,tranA, tranB);
                    //document.getElementById('file' + heatmapId.substr(8)).click()
                    //thi.next('#file' + heatmapId.substr(8)).remove()
                    //console.log(tranA,tranB);
                })

            })
            .on("mouseover", function(d) {
                //highlight text
                d3.select(this).classed("cell-hover", true);
                d3.select(heatmapId).selectAll(".rowLabel").classed("text-highlight", function(r, ri) {
                    return ri == (d.row);
                });
                d3.select(heatmapId).selectAll(".colLabel").classed("text-highlight", function(c, ci) {
                    return ci == (d.col);
                });

                //Update the tooltip position and value
                d3.select("#tooltip")
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
		.style("width", "120px")
                    .select("#value")
                    .html("Transcripts:" + "<br/>"+ rowLabel[d.row] + ","  +  "<br/>"+ colLabel[d.col]  +  "<br/>"+ "Identity: " + d.value +  "<br/>"); //row-col-idx:"+d.row+","+d.col+"\ncell-xy "+this.x.baseVal.value+", "+this.y.baseVal.value);  
                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);
            })
            .on("mouseout", function() {
                d3.select(this).classed("cell-hover", false);
                d3.select(heatmapId).selectAll(".rowLabel").classed("text-highlight", false);
                d3.select(heatmapId).selectAll(".colLabel").classed("text-highlight", false);
                d3.select("#tooltip").classed("hidden", true);
            });

        var legend = svg.selectAll(".legend")
            .data([0.0, 10.0, 20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0, 90.0])
            .enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", function(d, i) {
                return legendElementWidth * i;
            })
            .attr("y", height + (cellSize * 2))
            .attr("width", legendElementWidth)
            .attr("height", cellSize)
            .style("fill", function(d, i) {
                return colors[i];
            });

        legend.append("text")
            .attr("class", "mono")
            .text(function(d) {
                return d;
            })
            .attr("width", legendElementWidth)
            .attr("x", function(d, i) {
                return legendElementWidth * i;
            })
            .attr("y", height + (cellSize * 4));

//----plot alignment result for the first cell
	var firsttranA=columnsID[0];
	var firsttranB=rowsID[0];
                d3.json(urlAlignFile + "transcriptA=" + firsttranA + "&transcriptB=" +  firsttranB, function(error, data) {
                    //thi = $("#download_btn" + heatmapId.substr(8))
                    var url = 'http://isoplot.iis.sinica.edu.tw/allalignjson/' + data.fileName + '.json';
                    var ay1 = 15;
                    var ay2 = 50;
                    if (firsttranA[0] > firsttranB[0]) {
                        ay1 = 50;
                        ay2 = 15;
                    } else if (firsttranA[0] === firsttranB[0]) {
                        if (firsttranA[1] > firsttranB[1]) {
                            //console.log(tranA[1],tranB[1]);					
                            ay1 = 50;
                            ay2 = 15;
                        }
                    };
        plot(url, "#speTrans" + heatmapId.substr(8), ay1, ay2,firsttranA, firsttranB);
});


        // Change ordering of cells
        function sortbylabel(rORc, i, sortOrder) {
            var t = svg.transition().duration(1000);
            var log2r = [];
            var sorted; // sorted is zero-based index
            d3.select(heatmapId).selectAll(".c" + rORc + i)
                .filter(function(ce) {
                    log2r.push(ce.value);
                });
            if (rORc == "r") { // sort log2ratio of a gene
                sorted = d3.range(col_number).sort(function(a, b) {
                    if (sortOrder) {
                        return log2r[b] - log2r[a];
                    } else {
                        return log2r[a] - log2r[b];
                    }
                });
                t.selectAll(".cell")
                    .attr("x", function(d) {
                        return sorted.indexOf(d.col) * cellSize;
                    });
                t.selectAll(".colLabel")
                    .attr("y", function(d, i) {
                        return sorted.indexOf(i) * cellSize;
                    });
            } else { // sort log2ratio of a contrast
                sorted = d3.range(row_number).sort(function(a, b) {
                    if (sortOrder) {
                        return log2r[b] - log2r[a];
                    } else {
                        return log2r[a] - log2r[b];
                    }
                });
                t.selectAll(".cell")
                    .attr("y", function(d) {
                        return sorted.indexOf(d.row) * cellSize;
                    });
                t.selectAll(".rowLabel")
                    .attr("y", function(d, i) {
                        return sorted.indexOf(i) * cellSize;
                    });
            }
        }

        $("#download_btn" + heatmapId.substr(8)).click(function() {
            var urlGenes = "http://isoplot.iis.sinica.edu.tw/find_gene?gene_name=";
            var index = heatmapId.substr(8);
            var tranA = document.getElementById("transcriptA" + index).innerHTML;
            var tranB = document.getElementById("transcriptB" + index).innerHTML;
            //var tranArray = [];
            d3.json(urlAlignFile + "transcriptA=" + tranA + "&transcriptB=" + tranB, function(error, data) {

                thi = $("#download_btn" + heatmapId.substr(8))
                var url = 'http://isoplot.iis.sinica.edu.tw/allout/' + data.fileName + '.stretcher';
                thi.after($("<a>").css('display', 'none').attr('href', url).attr('download', data.fileName).attr('id', 'file' + heatmapId.substr(8)))
                document.getElementById('file' + heatmapId.substr(8)).click()
                thi.next('#file' + heatmapId.substr(8)).remove()
            })


        })
    });
}

function drawSpeTranscript(oneTranscript, oneSvgContainer) {
    const line_start = 50,
        line_length = 800,
        rect_height = 30;
    var y_coor = 50;
    var transcript_id = oneTranscript["transcript_id"],
        special_pos = transcript_id.indexOf("-") + 1,
        start_pos = oneTranscript["start"],
        end_pos = oneTranscript["end"];

    var exonArray = oneTranscript["exons"],
        utrArray = oneTranscript["UTR"],
        cdsArray = oneTranscript["CDS"];

    var axisScale = d3.scaleLinear().domain([start_pos, end_pos]).range([line_start, line_start + line_length]);


    var oneTranscriptGroup = oneSvgContainer.append("g");
    var id = oneTranscriptGroup.append("text")
        .attr("x", line_start)
        .attr("y", y_coor - rect_height / 2 - 5)
        .text("Transcript_ID : " + transcript_id)
        .attr("font-family", "'Dosis', sans-serif")
        .attr("font-size", "13px")
        .attr("fill", "#0a116f");
    //create a line in one transcript
    var line = oneTranscriptGroup.append("line")
        .attr("x1", axisScale(start_pos))
        .attr("y1", y_coor)
        .attr("x2", axisScale(end_pos))
        .attr("y2", y_coor)
        .attr("stroke-width", 0.7)
        .attr("stroke", "black")
    if (exonArray.length > 0) {
        //create Exons in one transcript 
        var exonBackColor = "#BDA6F9";
        if (transcript_id.substr(special_pos, 1) === "S")
            exonBackColor = "#FFE1A8";
        var exonGroup = oneTranscriptGroup.append("g");
        var exons = exonGroup.selectAll("rect")
            .data(exonArray)
            .enter()
            .append("rect");

        var exonsAttributes = exons.attr("x", function(d) {
                return axisScale(d.start)
            })
            .attr("y", y_coor - rect_height / 2)
            .attr("ry", 2)
            .attr("rx", 2)
            .attr("width", function(d) {
                return axisScale(d.end) - axisScale(d.start)
            })
            .attr("height", rect_height)
            .style("fill", function(d) {
                return exonBackColor
            })
            .attr("class", function(d) {
                return d.exon_id
            })


    }
    if (utrArray.length > 0) {
        //create UTRs in one transcript
        var utrGroup = oneTranscriptGroup.append("g");
        var utrs = utrGroup.selectAll("rect")
            .data(utrArray)
            .enter()
            .append("rect");
        var utrsAttributes = utrs.attr("x", function(d) {
                return axisScale(d.start)
            })
            .attr("ry", 2)
            .attr("rx", 2)
            .attr("y", y_coor)
            .attr("width", function(d) {
                return axisScale(d.end) - axisScale(d.start)
            })
            .attr("height", rect_height / 2)
            .style("fill", function(d) {
                return "#ECA0C3"
            })

    }
    if (cdsArray.length > 0) {
        //create CDSs in one transcript						 
        var cdsGroup = oneTranscriptGroup.append("g");
        var cdss = cdsGroup.selectAll("rect")
            .data(cdsArray)
            .enter()
            .append("rect");
        var cdssAttributes = cdss.attr("x", function(d) {
                return axisScale(d.start)
            })
            .attr("ry", 2)
            .attr("rx", 2)
            .attr("y", y_coor)
            .attr("width", function(d) {
                return axisScale(d.end) - axisScale(d.start)
            })
            .attr("height", rect_height / 2)
            .style("fill", function(d) {
                return "#B4C1FF"
            })

    }
}
