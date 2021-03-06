var colorPicker = ["#90C3D4", "#C390D4", "#D4A190", "#A1D490"];
var map = { AAEL: 'AA', AGAP: 'AG', CPIJ: 'CQ', FBgn: 'DM' };
var flags = [];

function beginDrawBoxPlot(keys, oneGeneData, index) {
    d3.select('#boxplotDetail' + index).append("svg")
        .attr("width", 800)
        .attr("height", 400)
        .append('text').text('Loading figure, please wait.')
        .attr("font-family", "'Dosis', sans-serif").attr("font-size", "18px").attr("fill", "#0a116f")
        .attr('x', 5).attr('y', 200).attr('width', 400).attr('height', 100)

    var urlFpkm = "";
    var transcript_id = [];
    var transcripts = oneGeneData["transcript"];
    var samples = $("#samplesChoose" + index).val();
    /*  for(var i = 0;i<transcripts.length;i++){
            transcript_id.push(transcripts[i].transcript_id);
        }*/
    for (var i = 0; i < transcripts.length; i++) {
        if (transcripts[i].transcript_id.substr(11, 1) != "T") {
            transcript_id.push(transcripts[i].transcript_id);
        }
    }

    var count = 0;
    var objectsToPvalue = new Array(transcript_id.length);
    var boxPlotDatas = new Array(transcript_id.length);
    var all_dlresult = new Array();
    var tr_dlresult = {}
    for (var i = 0; i < transcript_id.length; i++) {
        var oneId = transcript_id[i];
        d3.json(urlFpkm + oneId + "&samples_choose=" + samples, function(error, fpkmdata) {
            var object = makeFpkmArray(fpkmdata, index);
            var fpkmArray = fpkmdata['fpkmArray'];
            var fpkmDataArray = [];
            var fpkmColor = [];
            //console.log(fpkmdata);
            //Object.keys(fpkmdata).forEach((key) => tr_dlresult[key] = fpkmdata[key]);
            for (var j = 0; j < fpkmArray.length; j++) {
                fpkmDataArray.push(fpkmArray[j].fpkm);
                var colorIndex = pickColor(fpkmArray[j].sampleName, index, keys);
                fpkmColor.push(colorPicker[colorIndex]);
            }
            var oneBoxPlotData = {
                y: fpkmDataArray,
                type: 'box',
                jitter: 0.3,
                pointpos: 0,
                name: fpkmdata['nameID'],
                boxmean: true,
                marker: {
                    size: 5,
                    symbol: 'circle-dot',
                    color: fpkmColor
                },
                line: {
                    width: 1.5
                },
                boxpoints: 'all'
                    // boxpoints: 'Outliers'
            };
            var pos = transcript_id.indexOf(fpkmdata['nameID']);
            //boxPlotDatas.splice(pos,0,oneBoxPlotData); 
            boxPlotDatas[pos] = oneBoxPlotData;
            objectsToPvalue[pos] = object;
            count = count + 1;
            if (count === transcript_id.length) {
                beginDraw(boxPlotDatas, index);
                if (flags[index] === 0) {
                    calPvalue(objectsToPvalue, index);
                    //console.log(index)
                    //console.log("fff"+flags[index])
                    flags[index] == 1;
                }
            }
    //for download
            all_dlresult.push(fpkmdata);
        });
    }
    $("#box_dlbutton" + index).unbind("click");
    $("#box_dlbutton" + index).click(function() {
        //str = JSON.stringify(all_dlresult, null, 4);  
        download('expression_data_fpkm.csv', ConvertToCSV(all_dlresult));
    })
}

function beginDraw(boxPlotDatas, index) {
    var layout = {
        title: 'Expression level of transcripts',
        yaxis: {
            domain: [0, 30],
            title: 'FPKM',
            autorange: true,
            showgrid: true,
            zeroline: true,
            //dtick: 2,
            rangemode: "tozero", //包括到0
            gridcolor: 'rgb(200, 200, 200)',
            gridwidth: 1,
            zerolinecolor: 'rgb(200, 200, 200)',
            zerolinewidth: 2
        },
        xaxis: {
            title: 'Transcript ID',
        },
        paper_bgcolor: 'rgb(255, 255, 255)',
        plot_bgcolor: 'rgb(255, 255, 255)',
        showlegend: false //boxplot旁邊的圖示
    }
    d3.select('#boxplotDetail' + index).selectAll('svg').remove()
    Plotly.newPlot('boxplotDetail' + index, boxPlotDatas, layout);
}

function drawBoxPlot(oneGeneData, index) {
    flags.push(0)
    var urlAllSamples = "http://isoplot.iis.sinica.edu.tw/find_allSamples?species=";
    var spe = map[oneGeneData.gene_id.substr(0, 4)]
    d3.json(urlAllSamples + spe, function(error, samplesData) {
        var keys = [];
        Object.getOwnPropertyNames(samplesData).forEach(function(val, idx, array) {
            keys.push(val);
            var options = samplesData[val];
            for (var i = 0; i < options.length; i++) {
                $("<option>", {
                    value: options[i].sample_val,
                    'data-section': val,
                    selected: "selected",
                    text: options[i].sample_des
                }).appendTo($("#samplesChoose" + index))
            }
        });
        $("#samplesChoose" + index).treeMultiselect({
            startCollapsed: true,
            hideSidePanel: true,
            sortable: true
                // onChange:function(allSelectedItems,addedItems,removedItems){
                //  each of which is an array of objects with the properties text, value, initialIndex, and section
                // }
        });
        $('#selectbox' + index).children('.tree-multiselect').css('width', "330px")
        $('#selectbox' + index).children('.tree-multiselect').find('.title').each(function(index) {
            $(this).css('background', colorPicker[index]);
        })

        $("#box_button" + index).click(function() {
            //$('#boxplotDetail'+index).children().remove()
            Plotly.purge('boxplotDetail' + index);
            beginDrawBoxPlot(keys, oneGeneData, index)
        })
        beginDrawBoxPlot(keys, oneGeneData, index);
    });
}

function pickColor(sample, index, keys) {
    var section = $("#samplesChoose" + index).find('option[value=' + sample + ']').attr('data-section')
    return keys.indexOf(section)
}

function makeFpkmArray(fpkmdata, index) {
    var tranID = fpkmdata['nameID'];
    var fpkmArray = fpkmdata['fpkmArray'];
    var oneObject = { samples: [] };
    for (var i = 0; i < fpkmArray.length; i++) {
        var section = $("#samplesChoose" + index).find('option[value=' + fpkmArray[i].sampleName + ']').attr('data-section')
        if (oneObject.hasOwnProperty(section)) {
            oneObject[section].push(fpkmArray[i].fpkm);
        } else {
            oneObject[section] = [fpkmArray[i].fpkm];
            oneObject['samples'].push(section);
        }
    }
    oneObject['samples'].sort();
    oneObject.transID = tranID;
    oneObject['samples'] = sortcol(oneObject['samples']);
    return oneObject
}

function calPvalue(objectsToPvalue, index) {
    var rowH = $('<tr><th></th></tr>')
    for (var t = 0; t < objectsToPvalue[0].samples.length; t++) {
        var sample = objectsToPvalue[0].samples[t];
        rowH.append($("<th>" + sample + "</th>"))
    }
    $('#thead' + index).children().remove()
    $("#tbody" + index).children().remove()
    $('#thead' + index).append(rowH)
    for (var i = 0; i < objectsToPvalue.length; i++) {
        var row = $('<tr><td>' + objectsToPvalue[i]['transID'] + '</td></tr>')
        for (var t = 0; t < objectsToPvalue[i].samples.length; t++) {
            var sample = objectsToPvalue[i].samples[t];
            var x = objectsToPvalue[i][sample],
                y = [];
            for (var j = 0; j < objectsToPvalue.length; j++) {
                if (i === j)
                    continue;
                else {
                    y = y.concat(objectsToPvalue[j][sample])
                }
            }
            var one = mannwhitneyu.test(x, y, alternative = 'two-sided')
            var outone = ""
            if (one.p === 0) { outone = "NA"; } else if (one.p < 0.001) { outone = "***"; } else if (one.p < 0.01) { outone = "**"; } else if (one.p < 0.05) { outone = "*"; } else { outone = "ns" }
            // console.log(objectsToPvalue[i]['transID']+' '+sample+" "+one.p)

            //row.append($('<td>'+one.p+'</td>'))
            row.append($('<td>' + outone + '</td>'))
        }
        $("#tbody" + index).append(row)
        $("td:contains('*')").css("background-color", "rgb(255, 245, 198)");
        $("td:contains('**')").css("background-color", "rgb(255, 235, 188)");
        $("td:contains('***')").css("background-color", "rgb(255, 225, 168)");
        $("td:contains('NA')").css("background-color", "#d1d1d1");
    }

}

//convert the data to a file, and using 'data URIs'
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

//format our JSON object into csv foramt for download
function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var header = [];
    for (var index in array[0]["fpkmArray"]) {
        header.push(array[0]["fpkmArray"][index].sampleName);
    }
    header = header.sort();
    str += ' ,';
    str += header.join();
    str += '\r\n';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        line += array[i]["nameID"];
        line += ',';
        for (var j = 0; j < header.length; j++) {
            var fvalue = array[i]["fpkmArray"].filter(function(obj) {
                return obj.sampleName == header[j];
            });
            line += fvalue[0].fpkm;
            line += ','
        }
        str += line + '\r\n';
    }
    return str;
}

function sortcol(obj) { //arrange the table in correct order
    var newobj = obj;
    if (obj.length > 1) {
        if (obj[0] === "adult") {
            newobj = obj.slice(1);
            newobj.push(obj[0]);
        }
    }
    /*  if (obj.length===4){ 
            newobj=[ "embryo", "larva", "pupa","adult" ];   
        }
        else if(obj.length===2){
        newobj=["larva", "adult" ];
        }*/
    return newobj
}
