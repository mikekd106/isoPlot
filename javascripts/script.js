
const svg_width = 1000,svg_height = 1000;
var json = Array();
var svgContainer = d3.select("body")
						.append("svg")
						.attr("width",svg_width)
						.attr("height",svg_height);
d3.json("testData.json",function(error,data){
	if (error) throw error;
	var count = 0;
	const y_coor = 50,line_start = 50,verti_length = 950,line_length = 800;
	
	var commonGroup = svgContainer.append("g");
	var groups = new groupInfor();
	for(var i in data){
		drawOneTranscript(data[i],svgContainer,count++,groups);
		drawInCommonTranscript(data[i],commonGroup,groups);
	}
	var start_pos = data[0].start, end_pos = data[0].end
	var axisScale_back = d3.scaleLinear().domain([line_start, line_start+line_length]).range([start_pos,end_pos]);

	var flagGroup = svgContainer.append("g")

	var commonCor = flagGroup.append("rect")
				.attr("x",line_start-50)
				.attr("y",140)
				.attr("width",50)
				.attr("height",20)
				.attr("stroke", "black")
        .attr("stroke-dasharray","0.9")
    			.attr("stroke-width", 0)
    			.attr("fill", "none")
    			.attr("fill-opacity",0.4)
    			.style("pointer-events", "none")

 	var commonInfo = flagGroup.append("text")
 					 .attr("x", line_start-50)
	                 .attr("y", 160)
	                 .text(null)
	                 .attr("font-family", "sans-serif")
	                 .attr("font-size", "10px")
	                 .attr("fill", "#09649a");

	var commonLine = flagGroup.append("line")
				.attr("x1", line_start)
                .attr("y1", y_coor)
                .attr("x2", line_start)
                .attr("y2", y_coor+verti_length)
                .attr("stroke-width", 0)
                .attr("stroke", "black")
                .style("pointer-events", "none")

    svgContainer.on("mouseover",function(){
			   		commonLine.attr("stroke-width",0.5)
			   		commonCor.attr("stroke-width", 0.5)
			   		
			   })
			   .on("mousemove",function(){
			   		var move = (d3.event.pageX - line_start);
			   		if(move < 0 || move > line_length){
			   			commonLine.attr("stroke-width",0)
			   			commonCor.attr("stroke-width", 0)
			   			commonInfo.text(null)
			   		}
			   		else{
			   			commonLine.attr("stroke-width",0.5)
              .attr("stroke-dasharray","0.9")
			   			commonCor.attr("stroke-width", 0.5)
			   			commonInfo.text((axisScale_back(d3.event.pageX)).toFixed(2))
			   
			   			flagGroup.attr("transform","translate("+move+",0)").raise();
			   			
			   		}
			   })
			   .on("mouseout",function(){
			   		commonLine.attr("stroke-width",0)
			   		commonInfo.text(null)
			   		commonCor.attr("stroke-width", 0)
			   });           
	

});
function groupInfor(){
	this.group = Array()
	this.exonConnectMap = new Map();
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
}
function oneCoor(x,y){
	this.x = x;
	this.y = y;	
}
function drawInCommonTranscript(oneTranscript,commonGroup,groups){
	const y_coor = 100,line_start = 50,line_length = 800,rect_height = 30;

	var transcript_id = oneTranscript["transcript_id"],
		start_pos = oneTranscript["start"],
		end_pos = oneTranscript["end"];

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
	var y_coor = 200 + 50 * count;
	var transcript_id = oneTranscript["transcript_id"],
		start_pos = oneTranscript["start"],
		end_pos = oneTranscript["end"];
	
	var exonArray = oneTranscript["exons"],
		utrArray = oneTranscript["UTR"],
		cdsArray = oneTranscript["CDS"];

	var axisScale = d3.scaleLinear().domain([start_pos,end_pos]).range([line_start,line_start+line_length]);
	
 	var div = d3.select("body").append("div")
    			.attr("class", "tooltip")
    			.style("display", "none");

    var oneTranscriptGroup = svgContainer.append("g");
	//create a line in one transcript
	var line = oneTranscriptGroup.append("line")
            		   .attr("x1", axisScale(start_pos))
	                   .attr("y1", y_coor)
	                   .attr("x2", axisScale(end_pos))
	                   .attr("y2", y_coor)
	                   .attr("stroke-width", 0.7)
                       .attr("stroke", "black")
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
                       						temp[1].rects.attr("stroke", "#8b64f7").attr("stroke-width", 1.5);
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
                       				  .attr("stroke", "#7a91ff");
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
	
	var viewGroup = oneTranscriptGroup.append('g');
	var view = viewGroup.append("image")
						.attr("x",20)
						.attr("y",y_coor - rect_height/2)
						.attr("width",25)
						.attr("height",30)
						.attr("xlink:href","Mike.jpg ")
						.on("mouseover",function(){
							var temp_groups = groups.group;
							var index = count;
							for(var i =0;i<temp_groups.length;i++){
								if(index === i){
									temp_groups[i].selectAll("rect").attr("stroke", "#8b64f7").attr("stroke-width", 1.5);
					   				temp_groups[i].selectAll("path").attr("stroke", "#8b64f7").attr("stroke-width", 1);
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




