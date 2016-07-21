
const svg_width = 1000,svg_height = 800;
var json = Array();
var svgContainer = d3.select("body")
						.append("svg")
						.attr("width",svg_width)
						.attr("height",svg_height);
d3.json("testData.json",function(error,data){
	if (error) throw error;
	var count = 0;
	const y_coor = 50,line_start = 50,verti_length = 750,line_length = 800;
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
				.attr("y",130)
				.attr("width",50)
				.attr("height",20)
				.attr("stroke", "#cd6260")
    			.attr("stroke-width", 0)
    			.attr("fill", "none")
    			.attr("fill-opacity",0.4)
    			.style("pointer-events", "none")

 	var commonInfo = flagGroup.append("text")
 					 .attr("x", line_start-50)
	                 .attr("y", 150)
	                 .text(null)
	                 .attr("font-family", "sans-serif")
	                 .attr("font-size", "15px")
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
	this.addOneGroup = function(one){
		this.group.push(one);
	}
}
function oneCoor(x,y){
	this.x = x;
	this.y = y;	
}
function drawInCommonTranscript(oneTranscript,commonGroup,groups){
	const y_coor = 100,line_start = 50,line_length = 800,rect_height = 20;

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
    						   .attr("y",y_coor )
    						   .attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
    						   .attr("height",rect_height)
    						   .attr("fill-opacity",0.4)
    						   .style("fill",function(d){return "#BDA6F9"})
    						   
    							
    var svgLineFunction = d3.line()
    						.x(function(d) {return d.x})
    						.y(function(d) {return d.y});
    						
    
    
    for(var i = 0; i<exonArray.length;i++){

    	if (i == (exonArray.length-1))
    	 	break;
    	var coorArray = Array()
    	coorArray.push(new oneCoor(axisScale(exonArray[i].end),y_coor));
    	coorArray.push(new oneCoor(axisScale((exonArray[i].end+exonArray[i+1].start)/2), y_coor-30));
    	coorArray.push(new oneCoor(axisScale(exonArray[i+1].start),y_coor));
    	var lineGraph = exonGroup.append("path")
                        			.attr("d", svgLineFunction(coorArray))
                        			.attr("stroke", "#539987")
                        			.attr("stroke-width", 1)
                        			.attr("fill", "none");
    }

    groups.addOneGroup(exonGroup);



}					
function drawOneTranscript(oneTranscript,svgContainer,count,groups){
	const line_start = 50,line_length = 800, rect_height = 30;
	var y_coor = 200 + 40 * count;
	//var color = d3.scaleOrdinal(d3.schemeCategory20b);
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
    						   .style("fill",function(d){return "#BDA6F9"})
    						   .on("mouseover", function(d){
    						   		div.style("display", "inline");
    						   		d3.select(this)
    						   		  .attr("stroke-width", 1.5)
                       				  .attr("stroke", "#8b64f7");
    						   })
						       .on("mousemove", function(d){
						       		div.text("exon "+d.exon_number+" : "+d.start+"~"+d.end+"\n"+d.exon_id)
										.style("left", (d3.event.pageX + 10) + "px")
										.style("top", (d3.event.pageY - 50) + "px")
						       })
						       .on("mouseout", function(d){
						       		div.style("display", "none");
						       		d3.select(this)
    						   		  .attr("stroke-width", 0)
						       })
    //create UTRs in one transcript
    var utrGroup = oneTranscriptGroup.append("g");
    var utrs = utrGroup.selectAll("rect")
								.data(utrArray)
								.enter()
								.append("rect");
	var utrsAttributes = utrs.attr("x",function(d){return axisScale(d.start)})
    						 .attr("y",y_coor - rect_height/6)
    						 .attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
    						 .attr("height",rect_height/3)
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
    						 .attr("y",y_coor - rect_height/6)
    						 .attr("width",function(d){return axisScale(d.end) - axisScale(d.start)})
    						 .attr("height",rect_height/3)
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
									temp_groups[i].selectAll("rect").attr("stroke", "#9B489B").attr("stroke-width", 1);
					   				temp_groups[i].selectAll("path").attr("stroke", "#9B489B").attr("stroke-width", 1)
									continue;
								}
								temp_groups[i].selectAll("path").attr("stroke-width",0);
							}
					    })
					    .on("mouseout",function(){
					     	var temp_groups = groups.group
							for(var i =0;i<temp_groups.length;i++){
								temp_groups[i].selectAll("rect").attr("stroke-width", 0);
								temp_groups[i].selectAll("path").attr("stroke", "#539987").attr("stroke-width", 1)
							}
					   		
					    })
}





