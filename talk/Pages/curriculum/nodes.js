// Change this value to make the tooltip box wider/narrower
var tooltipWidth = 350;

/**
 * 
 * @param {*} d data row from sheet data to convert to HTML string
 */
function formatTooltipInfo(d, iconPrefix) {
  var ttStr = "<div style=\"max-width="+tooltipWidth+"px;word-wrap:break-word;font: 11px Arial;\">";
  ttStr += "<b>" + d['Unit Title'] + " ("+d['Core or Option']+")</b><br/>";
  ttStr += "<b>Level:</b> " + d['Level'] + " &nbsp&nbsp<b>Semester:</b> "+d['Semester'].toString() +" &nbsp&nbsp<b>Credits:</b> "+d['Credit Value']+"<br/>";
  ttStr += "<b>Keywords:</b> " + d['Keywords'] + "<br/><br/>";
  ttStr = ttStr + "<b>Aims:</b><br/>"+d['Aims'].replace(/(?:\r\n|\r|\n)/g, '<br/>')+"<br/><br/>";
  ttStr += "<b>Intended learning outcomes:</b><br/>" + d['Intended Learning Outcomes'].replace(/(?:\r\n|\r|\n)/g, '<br/>') + "<br/>";
  
  ttStr += "<img src=" + iconPrefix + d['Icon'] + " width="+tooltipWidth+"px><br/><br/>";
  ttStr += "<b>Image Credit:</b> " + d['Credit'] + "<br/>";
  ttStr += "</div>";
  return ttStr;
}

/**
   * Erase all elements for a fresh start
   */

function drawUnits(course, parentElementID) {
  console.log("drawUnits(" + course + "," + parentElementID + ")");
  clearUnits();  

  function clearUnits() {
    d3.select("#L4").remove();
    d3.select("#L5").remove();
    d3.select("#L6").remove();
    d3.select("#L7").remove();
    d3.select("#tooltip").remove();
  }

  google.charts.load('current');
  google.charts.setOnLoadCallback(init);
  
  function init() {
    // Load the spreadsheet data using a query
    //var url = 'https://docs.google.com/spreadsheets/d/11BcByHOP4BhCnN3YeADMSn5qcqP_xR6ODQT9UC6Flmg/gviz/tq?sheet=BAVE'; // BAVE
    var url = 'https://docs.google.com/spreadsheets/d/11BcByHOP4BhCnN3YeADMSn5qcqP_xR6ODQT9UC6Flmg/gviz/tq?sheet=' + course; // BACATA
    //var url = 'https://docs.google.com/spreadsheets/d/11BcByHOP4BhCnN3YeADMSn5qcqP_xR6ODQT9UC6Flmg/gviz/tq?sheet=BACAAD'; // BACAAD
    var query = new google.visualization.Query(url);
    query.setQuery('select *');
    query.send(processSheetsData);
  }

  function processSheetsData(response) {
    var gdata = response.getDataTable();
    var columns = gdata.getNumberOfColumns();
    var rows = gdata.getNumberOfRows();

    // append column headings
    var csvData = "";
    for (var c = 0; c < columns; c++) {
      csvData += "\"" + gdata.getColumnLabel(c) + "\"";
      csvData += (c == columns - 1) ? '\n' : ',';
    }
    // append row headings
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < columns; c++) {
        csvData += "\"" + gdata.getFormattedValue(r, c) + "\"";
        csvData += (c == columns - 1) ? '\n' : ',';
      }
    }

    // Use d3 to parse the string as csv data
    var data = d3.csvParse(csvData);

    // The path to our icons
    var iconPrefix = "unit_icons/";

    // Create a tooltip div for displaying tooltip information
    var tooltip = d3.select("body")
      .append("div")
      .attr('id','tooltip')
      .attr('data-html', 'true')
      .attr('class', 'tooltip-hover')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('z-index', 10)
      .style('visibility', 'visible')
      .style('background-color', 'white')
      .style('text-align', 'left')
      .style('padding', '4px')
      .style('border-radius', '4px')
      .style('font-weight', 'bold')
      .style('color', 'black')
      .style('font', '12px sans-serif')
      .style('border-style', 'solid')
      .style('opacity', 0.9)
      .style('border-width', '1px')
      .style('min-width', tooltipWidth+"px")
      .style('max-width', tooltipWidth+"px");

    d3.select("#" + parentElementID)
      .style("display", "block")
      .style("width", "100%")
      .style("margin", "0px 0px 0px 0px");

    d3.select("#" + parentElementID)
      .append("div").attr("id", "L4").style("background-color","powderblue").append("br").append("br");
    d3.select("#" + parentElementID)
      .append("div").attr("id", "L5").style("background-color","lightgreen").append("br").append("br");
    d3.select("#" + parentElementID)
      .append("div").attr("id", "L6").style("background-color","pink").append("br").append("br");
    d3.select("#" + parentElementID)
      .append("div").attr("id", "L7").append("br").append("br");

    // Iterate over all rows of our d3 data
    data.forEach(function (d) {

      // This is the full path to our icon
      var imgStr = iconPrefix.concat(d['Icon']);

      d3.select("#L" + d['Level'])
        .insert("img")
        .attr("src", imgStr)
        .style('border-radius', '10px')
        .style('padding', '2px')
        .style('height', '100px')
        .on("mousemove", function (event) {
          tooltip.style("visibility", "visible")
            .html(formatTooltipInfo(d, iconPrefix))
            .style("top", event.pageY + "px")
            .style("left", event.pageX + "px");
        })
        .on("mouseout", function () {
        });
    });
  }
}
