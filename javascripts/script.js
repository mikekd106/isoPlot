const svg_width = 1000,svg_height = 800;
var json = Array();
var svgContainer = d3.select("body")
.append("svg")
.attr("width",svg_width)
.attr("height",svg_height);
d3.json("testData.json",function(error,data){
	if (error) throw error;
	var count = 0;
	var commonGroup = svgContainer.append("g");
	for(var i in data){
		drawOneTranscript(data[i],svgContainer,count++);
		drawInCommonTranscript(data[i],commonGroup);
	}

});
function oneCoor(x,y){
	this.x = x;
	this.y = y;	
}
function drawInCommonTranscript(oneTranscript,commonGroup){
	const y_coor = 100,line_length = 800,rect_height = 20;

	var transcript_id = oneTranscript["transcript_id"],
	start_pos = oneTranscript["start"],
	end_pos = oneTranscript["end"];

	var axisScale = d3.scaleLinear().domain([start_pos,end_pos]).range([0,line_length]);

	var exonArray = oneTranscript["exons"];

		//create Exons in common transcript                   
		var exonGroup = commonGroup.append("g");
		var exons = exonGroup.selectAll("rect")
		.data(exonArray)
		.enter()
		.append("rect");
		var exonsAttributes = exons.attr("x",function(d){return axisScale(d.start)})
		.attr("y",y_coor )
		.attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
		.attr("height",rect_height)
		.style("fill",function(d){return "#BDA6F9"});

		var svgLineFunction = d3.line()
		.x(function(d) {return d.x})
		.y(function(d) {return d.y});


		for(var i in exonArray){

			console.log()
        	// if (i == (exonArray.length-1))
        	// 	break;
        	var coorArray = Array()
        	coorArray.push(new oneCoor(axisScale(exonArray[i].start),y_coor));
        	coorArray.push(new oneCoor(axisScale((exonArray[i].start+exonArray[i].end)/2), y_coor-30));
        	coorArray.push(new oneCoor(axisScale(exonArray[i].end),y_coor));
        	var lineGraph = exonGroup.append("path")
        	.attr("d", svgLineFunction(coorArray))
        	.attr("stroke", "#539987")
        	.attr("stroke-width", 1)
        	.attr("fill", "none");
        }




    }					
    function drawOneTranscript(oneTranscript,svgContainer,count){
    	const line_length = 800, rect_height = 20;
    	var y_coor = 200 + 30 * count;
		//var color = d3.scaleOrdinal(d3.schemeCategory20b);
		var transcript_id = oneTranscript["transcript_id"],
		start_pos = oneTranscript["start"],
		end_pos = oneTranscript["end"];
		
		var exonArray = oneTranscript["exons"],
		utrArray = oneTranscript["UTR"],
		cdsArray = oneTranscript["CDS"];

		var axisScale = d3.scaleLinear().domain([start_pos,end_pos]).range([0,line_length]);
		
		var oneTranscriptGroup = svgContainer.append("g");
		//create a line in one transcript
		var line = oneTranscriptGroup.append("line")
		.attr("x1", axisScale(start_pos))
		.attr("y1", y_coor)
		.attr("x2", axisScale(end_pos))
		.attr("y2", y_coor)
		.attr("stroke-width", 2)
		.attr("stroke", "black");
        //create Exons in one transcript                   
        var exonGroup = oneTranscriptGroup.append("g");
        var exons = exonGroup.selectAll("rect")
        .data(exonArray)
        .enter()
        .append("rect");
        var exonsAttributes = exons.attr("x",function(d){return axisScale(d.start)})
        .attr("y",y_coor - rect_height/2)
        .attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
        .attr("height",rect_height)
        .style("fill",function(d){return "#BDA6F9"});
        //create UTRs in one transcript
        var utrGroup = oneTranscriptGroup.append("g");
        var utrs = utrGroup.selectAll("rect")
        .data(utrArray)
        .enter()
        .append("rect");
        var utrsAttributes = utrs.attr("x",function(d){return axisScale(d.start)})
        .attr("y",y_coor - rect_height/4)
        .attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
        .attr("height",rect_height/2)
        .style("fill",function(d){return "#ECA0C3"});
        //create CDSs in one transcript						 
        var cdsGroup = oneTranscriptGroup.append("g");
        var cdss = cdsGroup.selectAll("rect")
        .data(cdsArray)
        .enter()
        .append("rect");
        var cdssAttributes = cdss.attr("x",function(d){return axisScale(d.start)})
        .attr("y",y_coor - rect_height/4)
        .attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
        .attr("height",rect_height/2)
        .style("fill",function(d){return "#B4C1FF"});



    }						  

	// function myFunction(text) {
	//     var h = document.createElement("H1");
	//     var t = document.createTextNode(text);
	//     h.appendChild(t);
	//     document.body.appendChild(h);
	// }