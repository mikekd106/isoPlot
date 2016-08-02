
function drawData(oneGeneData){ 
	
	const svg_width = 1000,svg_height = 300;//svg_height = 1000;
	d3.select("body").select("#svg_id").selectAll("svg").remove();
	var svgContainer = d3.select("body").select("#svg_id")
							.append("svg")
							.attr("width",svg_width)
							.attr("height",svg_height);
	
	const geneInfoKey = ['Gene_ID','Gene_name','Location','Strand'];
	var transcripts = oneGeneData["transcript"];
	var groups = new groupInfor();
	groups.countBorder(transcripts);
	var geneInfo = [oneGeneData["gene_id"],oneGeneData["gene_name"],oneGeneData["chr"]+" "+groups.start_pos+"~"+groups.end_pos,oneGeneData["strand"]];	
	
	var count = 0;
	const y_coor = 80,line_start = 50,verti_length = 920,line_length = 800;
	var geneInfoGroup = svgContainer.append("g");
	var commonGroup = svgContainer.append("g");

	for(var t=0;t<=geneInfo.length;t++){
		if(t === geneInfo.length){
			geneInfoGroup.append("text").attr("x", line_start).attr("y", 20*(t+1)).text("Overview").attr("font-family", "sans-serif").attr("font-size", "10px").attr("fill", "#392B58");		
			break;
		}
		geneInfoGroup.append("text").attr("x", line_start).attr("y", 20*(t+1)).text(geneInfoKey[t]+" : "+geneInfo[t]).attr("font-family", "sans-serif").attr("font-size", "10px").attr("fill", "#0a116f");

	}

	geneInfoGroup.append("rect").attr("x",line_start).attr("y",175).attr("width",5).attr("height",5).style("fill","#BDA6F9")
	geneInfoGroup.append("text").attr("x", line_start+5).attr("y", 180).text(" : Exon").attr("font-family", "sans-serif").attr("font-size", "10px").attr("fill", "#0a116f");
	geneInfoGroup.append("rect").attr("x",line_start).attr("y",185).attr("width",5).attr("height",5).style("fill","#ECA0C3")
	geneInfoGroup.append("text").attr("x", line_start+5).attr("y", 190).text(" : UTR").attr("font-family", "sans-serif").attr("font-size", "10px").attr("fill", "#0a116f");
	geneInfoGroup.append("rect").attr("x",line_start).attr("y",195).attr("width",5).attr("height",5).style("fill","#B4C1FF")
	geneInfoGroup.append("text").attr("x", line_start+5).attr("y", 200).text(" : CDS").attr("font-family", "sans-serif").attr("font-size", "10px").attr("fill", "#0a116f");
	for(var i = 0 ;i<transcripts.length;i++){
		//drawOneTranscript(transcripts[i],svgContainer,count++,groups);
		drawInCommonTranscript(transcripts[i],commonGroup,groups);
	}
	
	const iframe2_height = 500;
	d3.select("body").select("#iframe_id").selectAll("iframe").remove();
	var iframe = document.createElement('iframe');
	iframe.frameBorder = 0;
	iframe.width = svg_width;
	iframe.height = iframe2_height;
	iframe.id = "iframe2";
	iframe.setAttribute("src", "iframetest.html");	

	var oneDiv = document.getElementById('iframe_id');
	oneDiv.appendChild(iframe);
	

	var iframetest = document.getElementById("iframe2");
	var innerDoc = iframetest.contentDocument || iframetest.contentWindow.body;
	//var innerBody = innerDoc.document.body;

	var svg2_height, count = 0;;
	if(transcripts.length*50 >= iframe2_height){
		svg2_height = (transcripts.length + 1 )*50
	}else{
		svg2_height = iframe2_height;
	}
	var svgContainer2 = d3.select(innerDoc).select("body").select("#svg_transcripts_id")	
							.append("svg")
							.attr("width",svg_width)
							.attr("height",svg2_height);
	
	if(svgContainer2.empty()){
		alert(1);
	}else{
		alert(2);
	}	
	// for(var i = 0 ;i<transcripts.length;i++){
	// 	drawOneTranscript(transcripts[i],svgContainer2,count++,groups);
	// }

	// var start_pos = groups.start_pos, end_pos = groups.end_pos;
	// var axisScale_back = d3.scaleLinear().domain([line_start, line_start+line_length]).range([start_pos,end_pos]);

	// var flagGroup = svgContainer.append("g")

	// var commonCor = flagGroup.append("rect")
	// 			.attr("x",line_start-50)
	// 			.attr("y",158)
	// 			.attr("width",50)
	// 			.attr("height",12)
	// 			.attr("stroke", "black")
 //        		.attr("stroke-dasharray","0.9")
 //    			.attr("stroke-width", 0)
 //    			.attr("fill", "none")
 //    			.attr("fill-opacity",0.4)
 //    			.style("pointer-events", "none")

 // 	var commonInfo = flagGroup.append("text")
 // 					 .attr("x", line_start-50)
	//                  .attr("y", 170)
	//                  .text(null)
	//                  .attr("font-family", "sans-serif")
	//                  .attr("font-size", "10px")
	//                  .attr("fill", "#0a116f");

	// var commonLine = flagGroup.append("line")
	// 			.attr("x1", line_start)
 //                .attr("y1", y_coor)
 //                .attr("x2", line_start)
 //                .attr("y2", y_coor+verti_length)
 //                .attr("stroke-width", 0)
 //                .attr("stroke", "black")
 //                .style("pointer-events", "none")

 //    svgContainer.on("mouseover",function(){
 //    				var verti_line = document.getElementById("verti_line");
 //    				if(verti_line.checked){
	// 		   			commonLine.attr("stroke-width",0.5)
	// 		   			commonCor.attr("stroke-width", 0.5)
	// 		   		}
	// 		   })
	// 		   .on("mousemove",function(){
	// 		   		var verti_line = document.getElementById("verti_line");
 //    				if(verti_line.checked){
	// 			   		var move = (d3.event.pageX - line_start);
	// 			   		if(move < 0 || move > line_length){
	// 			   			commonLine.attr("stroke-width",0)
	// 			   			commonCor.attr("stroke-width", 0)
	// 			   			commonInfo.text(null)
	// 			   		}
	// 			   		else{
	// 			   			commonLine.attr("stroke-width",0.5).attr("stroke-dasharray","0.9")
	// 			   			commonCor.attr("stroke-width", 0.5)
	// 			   			commonInfo.text(Math.round(axisScale_back(d3.event.pageX)))		   			
	// 			   			flagGroup.attr("transform","translate("+move+",0)").raise();
				   			
	// 			   		}
	// 			   	}
	// 		   })
	// 		   .on("mouseout",function(){
	// 		   		commonLine.attr("stroke-width",0)
	// 		   		commonInfo.text(null)
	// 		   		commonCor.attr("stroke-width", 0)
	// 		   });           
	

}
function groupInfor(){
	this.group = Array()
	this.exonConnectMap = new Map();
	this.start_pos;
	this.end_pos;
	this.addOneGroup = function(one){
		this.group.push(one);
	}
	this.addOneConnect = function(id1,id2,line,rects){
		var key = new Array(2);
        key[0] = id1;
        key[1] = id2;
		if(!this.exonConnectMap.has(key)){
			var newObject = new Object();
			newObject["line"] = line;
			newObject["rects"] = rects;
			this.exonConnectMap.set(key,newObject);	
		}
		
	}
	this.countBorder = function(transArray){
		var countStart = new Array();
		var countEnd = new Array();
		for(var j = 0;j<transArray.length;j++){
			countStart.push(transArray[j].start);
			countEnd.push(transArray[j].end);
		}
		this.start_pos = Math.min.apply(null,countStart);
		this.end_pos = Math.max.apply(null,countEnd);
	}
}
function oneCoor(x,y){
	this.x = x;
	this.y = y;	
}
function drawInCommonTranscript(oneTranscript,commonGroup,groups){
	const y_coor = 125,line_start = 50,line_length = 800,rect_height = 30;

	var transcript_id = oneTranscript["transcript_id"],
		start_pos = groups.start_pos,
		end_pos = groups.end_pos;

	var axisScale = d3.scaleLinear().domain([start_pos,end_pos]).range([line_start, line_start+line_length]);

	var exonArray = oneTranscript["exons"];

	//create Exons in common transcript                   
    var exonGroup = commonGroup.append("g");
    var exons = exonGroup.selectAll("rect")
								.data(exonArray)
								.enter()
								.append("rect");
	var exonsAttributes = exons.attr("x",function(d){return axisScale(d.start)})
    						   .attr("ry",2)
			                   .attr("rx",2)
			                   .attr("y",y_coor )
    						   .attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
    						   .attr("height",rect_height)
    						   .attr("fill-opacity",0.4)
    						   .style("fill",function(d){return "#BDA6F9"})
    						   
    							
    var svgLineFunction = d3.line()
    						.x(function(d) {return d.x})
    						.y(function(d) {return d.y});
    						
    
    
    for(var j = 0; j<exonArray.length;j++){

    	if (j == (exonArray.length-1))
    	 	break;
    	var coorArray = new Array()
    	coorArray.push(new oneCoor(axisScale(exonArray[j].end),y_coor));
    	coorArray.push(new oneCoor(axisScale((exonArray[j].end+exonArray[j+1].start)/2), y_coor-20));
    	coorArray.push(new oneCoor(axisScale(exonArray[j+1].start),y_coor));
    	var lineGraph = exonGroup.append("path")
                        			.attr("d", svgLineFunction(coorArray))
                        			.attr("stroke", "#888888")
                        			.attr("stroke-width", 1)
                              		.attr("fill", "none");
        var rects = exonGroup.selectAll("rect").filter(function(d,i){return i===j || i===(j+1)});
        groups.addOneConnect(exonArray[j].exon_id,exonArray[j+1].exon_id,lineGraph,rects);
    }

    groups.addOneGroup(exonGroup);



}					
function drawOneTranscript(oneTranscript,svgContainer,count,groups){
	const line_start = 50,line_length = 800, rect_height = 30;
	//var y_coor = 50 + 50 * count;
	var y_coor = 265 + 50 * count;
	var transcript_id = oneTranscript["transcript_id"],
		start_pos = groups.start_pos,
		end_pos = groups.end_pos;
	
	var exonArray = oneTranscript["exons"],
		utrArray = oneTranscript["UTR"],
		cdsArray = oneTranscript["CDS"];

	var axisScale = d3.scaleLinear().domain([start_pos,end_pos]).range([line_start,line_start+line_length]);
	
 	var div = d3.select("body").append("div")
    			.attr("class", "tooltip")
    			.style("display", "none");

    var oneTranscriptGroup = svgContainer.append("g");
    var id = oneTranscriptGroup.append("text")
 					 .attr("x", line_start)
	                 .attr("y", y_coor - rect_height/2 - 5)
	                 .text("Transcript_ID : "+transcript_id)
	                 .attr("font-family", "sans-serif")
	                 .attr("font-size", "10px")
	                 .attr("fill", "#0a116f");
	//create a line in one transcript
	var line = oneTranscriptGroup.append("line")
            		   .attr("x1", axisScale(start_pos))
	                   .attr("y1", y_coor)
	                   .attr("x2", axisScale(end_pos))
	                   .attr("y2", y_coor)
	                   .attr("stroke-width", 0.7)
                       .attr("stroke", "black")
    if(exonArray.length>0){
	    //create Exons in one transcript                   
	    var exonGroup = oneTranscriptGroup.append("g");
	    var exons = exonGroup.selectAll("rect")
								.data(exonArray)
								.enter()
								.append("rect");
	
		var exonsAttributes = exons.attr("x",function(d){return axisScale(d.start)})
	    						   .attr("y",y_coor - rect_height/2)
	    						   .attr("ry",2)
				                   .attr("rx",2)
				                   .attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
	    						   .attr("height",rect_height)
	    						   .style("fill",function(d){return "#BDA6F9"})
	    						   .on("mouseover", function(d){
	    						   		div.style("display", "inline");
	    						   		d3.select(this)
	                				   		  .attr("stroke-width", 1.5)
	                       				  .attr("stroke", "#8b64f7");
	                       				  //.attr('stroke-alignment',"outer");
	                       				var temp_map = groups.exonConnectMap;
	                       				var set = temp_map.entries();

	                       				while(true){
	                       					var iterator = set.next();
	                       					if(iterator.done === true)
	                       						break
	                       					var temp = iterator.value
	                       					if(checkIdExit(temp[0],d.exon_id)){
	                       						temp[1].line.attr("stroke", "#8b64f7").attr("stroke-width", 1);
	                       						temp[1].rects.attr("stroke", "#5b34c7").attr("stroke-width", 1.5);
	                       					}else{
	                       						temp[1].line.attr("stroke-width",0);
	                       					}
	                       				}

	    						   })
							       .on("mousemove", function(d){
							       		div.text("exon "+d.exon_number+" : "+d.start+"~"+d.end+"\n"+d.exon_id)
											.style("left", (d3.event.pageX + 10) + "px")
											.style("top", (d3.event.pageY - 50) + "px")
							       })
							       .on("mouseout", function(d){
							       		div.style("display", "none");
							       		d3.select(this)
	    						   		  .attr("stroke-width", 0);
	                    

	    						   		var temp_map = groups.exonConnectMap;
	                       				var set = temp_map.entries();

	                       				while(true){
	                       					var iterator = set.next();
	                       					if(iterator.done === true)
	                       						break
	                       					var temp = iterator.value
	                   						temp[1].line.attr("stroke", "#888888").attr("stroke-width", 1);
	                   						temp[1].rects.attr("stroke-width",0);	
	                       				}
							       })
	}
	if(utrArray.length>0){
	    //create UTRs in one transcript
	    var utrGroup = oneTranscriptGroup.append("g");
	    var utrs = utrGroup.selectAll("rect")
									.data(utrArray)
									.enter()
									.append("rect");
		var utrsAttributes = utrs.attr("x",function(d){return axisScale(d.start)})
	    						 .attr("ry",2)
	                 .attr("rx",2)
	                 .attr("y",y_coor)
	    						 .attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
	    						 .attr("height",rect_height/2)
	    						 .style("fill",function(d){return "#ECA0C3"})
	    						 .on("mouseover", function(d){
	    						   		div.style("display", "inline");
	    						   		d3.select(this)
	    						   		  .attr("stroke-width", 1.5)
	                       				  .attr("stroke", "#df629c");

	    						 })
							     .on("mousemove", function(d){
							       		div.text("UTR : "+d.start+"~"+d.end)
											.style("left", (d3.event.pageX + 10) + "px")
											.style("top", (d3.event.pageY - 50) + "px")
							     })
							     .on("mouseout", function(d){
							       		div.style("display", "none");
							       		d3.select(this)
	    						   		  .attr("stroke-width", 0)
							     })
	}
	if(cdsArray.length>0){
	    //create CDSs in one transcript						 
	    var cdsGroup = oneTranscriptGroup.append("g");
	    var cdss = cdsGroup.selectAll("rect")
									.data(cdsArray)
									.enter()
									.append("rect");
		var cdssAttributes = cdss.attr("x",function(d){return axisScale(d.start)})
	    						 .attr("ry",2)
	                 .attr("rx",2)
	                 .attr("y",y_coor)
	    						 .attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
	    						 .attr("height",rect_height/2)
	    						 .style("fill",function(d){return "#B4C1FF"})
	    						 .on("mouseover", function(d){
	    						   		div.style("display", "inline");
	    						   		d3.select(this)
	    						   		  .attr("stroke-width", 1.5)
	                       				  .attr("stroke", "#8491dF");
	    						 })
							     .on("mousemove", function(d){
							       		div.text("CDS : "+d.start+"~"+d.end)
											.style("left", (d3.event.pageX + 10) + "px")
											.style("top", (d3.event.pageY - 50) + "px")
							     })
							     .on("mouseout", function(d){
							       		div.style("display", "none");
							       		d3.select(this)
	    						   		  .attr("stroke-width", 0)
							     })
	}
	var viewGroup = oneTranscriptGroup.append('g');
	var view = viewGroup.append("image")
						.attr("x",10)
						.attr("y",y_coor - rect_height/2)
						.attr("width",25)
						.attr("height",30)
						.attr("xlink:href","click.png ")
						.on("mouseover",function(){
							var temp_groups = groups.group;
							var index = count;
							for(var i =0;i<temp_groups.length;i++){
								if(index === i){
									temp_groups[i].selectAll("rect").attr("stroke", "#5b34c7").attr("stroke-width", 1.5);
					   				temp_groups[i].selectAll("path").attr("stroke", "#5b34c7").attr("stroke-width", 1);
									continue;
								}
								temp_groups[i].selectAll("path").attr("stroke-width",0);
							}
					    })
					    .on("mouseout",function(){
					     	var temp_groups = groups.group
							for(var i =0;i<temp_groups.length;i++){
								temp_groups[i].selectAll("rect").attr("stroke-width", 0);
								temp_groups[i].selectAll("path").attr("stroke", "#888888").attr("stroke-width", 1)
							}
					   		
					    })

	function checkIdExit(arr, val) {
	    return arr.some(function(arrVal) {
	        return val === arrVal;
	    });
	}

}


