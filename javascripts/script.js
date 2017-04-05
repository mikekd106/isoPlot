
function drawData(oneGeneData,index){ 
	
	const svg_width = 880,svg_height = 230;//svg_height = 1000;
	d3.select("body").select("#svgOverview"+index).selectAll("svg").remove();
	var svgContainer = d3.select("body").select("#svgOverview"+index)
							.append("svg")
							.attr("width",svg_width)
							.attr("height",svg_height);
	
	const geneInfoKey = ['Gene ID','Gene name','Location','Strand'];
	var transcripts = oneGeneData["transcript"];
	var groups = new groupInfor();
	groups.countBorder(transcripts);
	var geneInfo = [oneGeneData["gene_id"],oneGeneData["gene_name"],oneGeneData["chr"]+" "+groups.start_pos+"~"+groups.end_pos,oneGeneData["strand"]];	
	const mosqDic = {AAEL:'Aedes_aegypti', AGAP:'Anopheles_gambiae', CPIJ:'Culex_quinquefasciatus'};
	var count = 0;
	const line_start = 50;
	var geneInfoGroup = svgContainer.append("g");
	var commonGroup = svgContainer.append("g");

	for(var t=0;t<=geneInfo.length;t++){
		if(t === geneInfo.length){
			geneInfoGroup.append("text").attr("x", line_start).attr("y", 20+25*t).text("Overview").attr("font-family", "'Dosis', sans-serif").attr("font-size", "15px").attr("fill", "#392B58");		
			break;
		}
		if(t===0){
			var url = "";
		 	if(geneInfo[t].substr(0,4) === 'FBgn'){
		 		url = "http://flybase.org/reports/"+geneInfo[t]+".html"
		 	}else{
		 		url = "https://www.vectorbase.org/"+mosqDic[geneInfo[t].substr(0,4)]+"/Gene/Summary?g="+geneInfo[t];
		 	}

			geneInfoGroup.append("a").attr("xlink:href", url).attr("target","_parent")
						 .append("text").attr("x", line_start).attr("y", 20+25*t).text(geneInfoKey[t]+" : "+geneInfo[t]).attr("font-family", "'Dosis', sans-serif").attr("font-size", "15px").attr("fill", "#0a116f")
						 .on("mouseover", function(d){
						 	d3.select(this).attr('fill','#C390D4')
						 })
						 .on('mouseout',function(d){
						 	d3.select(this).attr("fill", "#0a116f")
						 })	
		}else{
			geneInfoGroup.append("text").attr("x", line_start).attr("y", 20+25*t).text(geneInfoKey[t]+" : "+geneInfo[t]).attr("font-family", "'Dosis', sans-serif").attr("font-size", "15px").attr("fill", "#0a116f");
		}

	}

	for(var i = 0 ;i<transcripts.length;i++){
		drawInCommonTranscript(transcripts[i],commonGroup,groups,index);
	}
	drawPointerLine(groups,svgContainer,123,80,true,index);

	const div2_height = 350,one_block_height = 70;

	var svg2_height, count = 0;
	if(transcripts.length*70 >= div2_height){
		svg2_height = (transcripts.length +1)*70
	}else{
		svg2_height = div2_height;
	}
	// document.getElementById("isoform_div").style.display="";
	// document.getElementById("svg2_id").style.display="";
	d3.select("body").select("#svgDetail"+index).selectAll("svg").remove();
        
	var svgContainer2 = d3.select("body").select("#svgDetail"+index).append("svg").attr("width",svg_width).attr("height",svg2_height);
	    //.attr("viewBox", "0,0,"+svg_width+","+svg2_height)
	    
	var transcriptsContaniner = svgContainer2.selectAll("svg").data(transcripts).enter().append("svg")
									.attr("width",svg_width)
    								.attr("height",one_block_height)
    								.attr("x",0)
    								.attr("y",function(d,i){return 70*i})
    								.each(function(d,i){
    									var thatContainer = d3.select(this);
    									drawOneTranscript(transcripts[i],thatContainer,i,groups,index);
    								});

	drawPointerLine(groups,svgContainer2,5,svg2_height-10,false,index);
	
}
function drawPointerLine(groups,svgContainer,start,length,isCommon,index){
	var start_pos = groups.start_pos, 
		end_pos = groups.end_pos;
	const y_coor = start,verti_length = length,line_start = 50,line_length = 800;
	var axisScale_back = d3.scaleLinear().domain([line_start, line_start+line_length]).range([start_pos,end_pos]);

	var flagGroup = svgContainer.append("g")

	if(isCommon){
		var commonCor = flagGroup.append("rect")
				.attr("x",line_start-50)
				.attr("y",183)
				.attr("width",50)
				.attr("height",15)
				.attr("stroke", "black")
        		.attr("stroke-dasharray","0.9")
    			.attr("stroke-width", 0)
    			.attr("fill", "none")
    			.attr("fill-opacity",0.4)
    			.style("pointer-events", "none")

	 	var commonInfo = flagGroup.append("text")
	 					 .attr("x", line_start-50)
		                 .attr("y", 198)
		                 .text(null)
		                 .attr("font-family", "'Dosis', sans-serif")
		                 .attr("font-size", "13px")
		                 .attr("fill", "#0a116f");
	
	}
	
	var commonLine = flagGroup.append("line")
				.attr("x1", line_start)
                .attr("y1", y_coor)
                .attr("x2", line_start)
                .attr("y2", y_coor+verti_length)
                .attr("stroke-width", 0)
                .attr("stroke-dasharray","0.9")
                .attr("stroke", "black")
                .style("pointer-events", "none")

    groups.addOneline(flagGroup);

    svgContainer.on("mouseover",function(){
    				var verti_line = document.getElementById("verti_line"+index);
    				if(verti_line.checked){
			   			for(t=0;t<groups.lines.length;t++){
			   				groups.lines[t].select("rect").attr("stroke-width",0.5);
			   				groups.lines[t].select("line").attr("stroke-width",0.5);
			   			}
			   		}
			   })
			   .on("mousemove",function(){
			   		var verti_line = document.getElementById("verti_line"+index);
    				if(verti_line.checked){
				   		var moveX = (d3.event.pageX - line_start);
				   		if(moveX < 0 || moveX > line_length){
					   		for(t=0;t<groups.lines.length;t++){
					   			groups.lines[t].select("rect").attr("stroke-width",0);
					   			groups.lines[t].select("line").attr("stroke-width",0);
					   			groups.lines[t].select("text").text(null);
					   		}
				   		}
				   		else{
			   				for(t=0;t<groups.lines.length;t++){
				   				groups.lines[t].select("rect").attr("stroke-width",0.5);
				   				groups.lines[t].select("line").attr("stroke-width",0.5);
				   				groups.lines[t].select("text").text(Math.round(axisScale_back(d3.event.pageX)));
				   				groups.lines[t].attr("transform","translate("+moveX+",0)").raise();
				   			}

				   			
				   		}
				   	}
			   })
			   .on("mouseout",function(){
				   	for(t=0;t<groups.lines.length;t++){
			   			groups.lines[t].select("rect").attr("stroke-width",0);
			   			groups.lines[t].select("line").attr("stroke-width",0);
			   			groups.lines[t].select("text").text(null);
			   		}
			   });           
}
function groupInfor(){
	this.group = Array();
	this.lines = Array();
	this.exonConnectMap = new Map();
	this.start_pos;
	this.end_pos;
	this.addOneline = function(one){
		this.lines.push(one);
	}
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
function drawInCommonTranscript(oneTranscript,commonGroup,groups,index){
	const y_coor = 150,line_start = 50,line_length = 800,rect_height = 30;

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
    						   .attr("fill-opacity",0.2)
    						   .style("fill",function(d){return "#BDA6F9"})
    						   
    							
    var svgLineFunction = d3.line()
    						.x(function(d) {return d.x})
    						.y(function(d) {return d.y});
    
    var svgCurveFunction = d3.line()
			    .x(function(d) {return d.x})
			    .y(function(d) {return d.y})
			    .curve(d3.curveBundle.beta(1));
    
    
    for(var j = 0; j<exonArray.length;j++){

    	if (j == (exonArray.length-1))
    	 	break;
    	var coorArray = new Array()
    	coorArray.push(new oneCoor(axisScale(exonArray[j].end),y_coor));
    	coorArray.push(new oneCoor(axisScale((exonArray[j].end+exonArray[j+1].start)/2), y_coor-20));
    	coorArray.push(new oneCoor(axisScale(exonArray[j+1].start),y_coor));
    	
    	var lineGraph;
    	if(document.getElementById("curve"+index).checked){
    		lineGraph = exonGroup.append("path")		
									.attr("d", svgCurveFunction(coorArray))
									.attr("stroke", "#888888")
									.attr("stroke-width", 1)
							  		.attr("fill", "none");
    	}else{
    		lineGraph = exonGroup.append("path")
                        			.attr("d", svgLineFunction(coorArray))
                        			.attr("stroke", "#888888")
                        			.attr("stroke-width", 1)
                              		.attr("fill", "none");
    	}
		
        var rects = exonGroup.selectAll("rect").filter(function(d,i){return i===j || i===(j+1)});
        groups.addOneConnect(exonArray[j].exon_id,exonArray[j+1].exon_id,lineGraph,rects);
    }

    groups.addOneGroup(exonGroup);



}					
function drawOneTranscript(oneTranscript,oneSvgContainer,count,groups,index){
	const line_start = 50,line_length = 800, rect_height = 30;
	var y_coor = 50 ;
	var transcript_id = oneTranscript["transcript_id"],
		special_pos = transcript_id.indexOf("-")+1,
		start_pos = groups.start_pos,
		end_pos = groups.end_pos;
	
	var exonArray = oneTranscript["exons"],
		utrArray = oneTranscript["UTR"],
		cdsArray = oneTranscript["CDS"];

	var axisScale = d3.scaleLinear().domain([start_pos,end_pos]).range([line_start,line_start+line_length]);
	
 	var div = d3.select("body").append("div")
    			.attr("class", "tooltip")
    			.style("display", "none");

    
    var oneTranscriptGroup = oneSvgContainer.append("g");
    var id = oneTranscriptGroup.append("text")
 					 .attr("x", line_start)
	                 .attr("y", y_coor - rect_height/2 - 5)
	                 .text("Transcript_ID : "+transcript_id)
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
    if(exonArray.length>0){
	    //create Exons in one transcript 
	    var exonBackColor = "#BDA6F9";
	    if(transcript_id.substr(special_pos,1) === "S")
	    	exonBackColor = "#FFE1A8"; 
	    if(transcript_id.substr(special_pos,1) === "T")
	    	exonBackColor = "#C6C7C4";                       
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
	    						   .style("fill",function(d){return exonBackColor})
	    						   .attr("class",function(d){return d.exon_id})
	    						   .on("mouseover", function(d){
	    						   		div.style("display", "inline");
	    						   		d3.select(this)
	                				   		  .attr("stroke-width", 1.5)
	                       				  .attr("stroke", "#8b64f7");

	                       				var temp_map = groups.exonConnectMap;
	                       				var set = temp_map.entries();

	                       				while(true){
	                       					var iterator = set.next();
	                       					if(iterator.done === true)
	                       						break
	                       					var temp = iterator.value
	                       					if(checkIdExit(temp[0],d.exon_id)){
	                       						temp[1].line.attr("stroke", "#8b64f7").attr("stroke-width", 1);
	                       						temp[1].rects.attr("stroke", "#340aa8").attr("stroke-width", 1.5);
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
							       .on("click",function(d){
							       		var transcriptId = transcript_id;
							       		var sortItems = function(a,b){
											var prior_one = 0,prior_two = 0;
											if(a.transcript_id === transcriptId){
												prior_one = 2;
												if(checkIdExit(b.exons,d.exon_id,"exon"))
													prior_two = 1;	
											}
											else if(b.transcript_id === transcriptId){
												prior_two = 2;
												if(checkIdExit(a.exons,d.exon_id,"exon"))
													prior_one = 1;
											}
											else{
												if(checkIdExit(a.exons,d.exon_id,"exon"))
													prior_one = 1;
												if(checkIdExit(b.exons,d.exon_id,"exon"))
													prior_two = 1;
											}
											
											return prior_two - prior_one;

										}
							       		d3.select("#svgDetail"+index).select("svg").selectAll("svg")
							       				.sort(sortItems)
							       				.transition()
							       				.delay(function (d, i) {
											        return i * 40;
											    })
							       				.duration(200)
							       				.attr('x',0)
							       				.attr('y',function(d,i){
							       					return i*70
							       				});
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
              				view.attr("xlink:href","click2.png ")
							var temp_groups = groups.group;
							var inde = count;
							for(var i =0;i<temp_groups.length;i++){
								if(inde === i){
									temp_groups[i].selectAll("rect").attr("stroke", "#340aa8").attr("stroke-width", 1.5);
					   				temp_groups[i].selectAll("path").attr("stroke", "#340aa8").attr("stroke-width", 1);
									continue;
								}
								temp_groups[i].selectAll("path").attr("stroke-width",0);
							}
					    })
					    .on("mouseout",function(){
                			view.attr("xlink:href","click.png ")
					     	var temp_groups = groups.group
							for(var i =0;i<temp_groups.length;i++){
								temp_groups[i].selectAll("rect").attr("stroke-width", 0);
								temp_groups[i].selectAll("path").attr("stroke", "#888888").attr("stroke-width", 1)
							}
					   		
					    })
					    .on('click',function(){
					    	var tab = $(this).parent().closest('div').attr('id').substr(9,1)
					    	var inde = count;
					    	d3.select('#boxplotDetail'+tab).select('.boxlayer')
					    		.selectAll('.trace.boxes')
					    		.each(function(d,i){
					    			if(i === inde){
					    				d3.select(this).select('.box').style('stroke','red');
					    			}
					    		})
					    	//console.log(d3.select('#boxplotDetail'+tab).select('.boxlayer').selectAll('trace boxes'))
					    })

	function checkIdExit(arr, val, type) {
	    if(arguments.length === 2){
		    return arr.some(function(arrVal) {
		        return val === arrVal;
		    });
		}else if(arguments.length === 3){
			return arr.some(function(arrVal) {
		        return val === arrVal.exon_id;
		    });
		}
	}
}



