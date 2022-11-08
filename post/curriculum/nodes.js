
/**
 * 
 * @param {*} d data row from sheet data to convert to HTML string
 */
function formatTooltipInfo(d, iconPrefix) {
  var ttStr = "<div style=\"max-width=300px;word-wrap:break-word;\">";
  ttStr += "<b>L" + d['Level'] + "(" + d['Core or Option'] + "): " + d['Unit Title'] + "</b><br/>";
  //ttStr = ttStr + "<b>Aims:</b><br/>"+d['Aims'].replace(/(?:\r\n|\r|\n)/g, '<br/>')+"<br/>";
  ttStr += "Having completed this unit the student is expected to:<br/>" + d['Intended Learning Outcomes'].replace(/(?:\r\n|\r|\n)/g, '<br/>') + "<br/>";
  ttStr += "<b>Keywords:</b> " + d['Keywords'] + "<br/>";
  ttStr += "<img src=" + iconPrefix + d['Icon'] + " width=300px><br/>";
  ttStr += "<b>Image Credit:</b> " + d['Credit'] + "<br/>";
  ttStr += "</div>";  
  return ttStr;
}


function drawUnits(course, parentElementID) {
  console.log("drawUnits(" + course + "," + parentElementID + ")");

  google.charts.load('current');
  google.charts.setOnLoadCallback(init);

  // Retrieve the element ID passed from the calling page
  console.log("parentElementID=" + parentElementID);

  function init() {
    // Load the spreadsheet data using a query
    //var url = 'https://docs.google.com/spreadsheets/d/11BcByHOP4BhCnN3YeADMSn5qcqP_xR6ODQT9UC6Flmg/gviz/tq?sheet=BAVE'; // BAVE
    var url = 'https://docs.google.com/spreadsheets/d/11BcByHOP4BhCnN3YeADMSn5qcqP_xR6ODQT9UC6Flmg/gviz/tq?sheet=' + course; // BACATA
    //var url = 'https://docs.google.com/spreadsheets/d/11BcByHOP4BhCnN3YeADMSn5qcqP_xR6ODQT9UC6Flmg/gviz/tq?sheet=BACAAD'; // BACAAD
    var query = new google.visualization.Query(url);
    query.setQuery('select *');
    query.send(processSheetsData);
  }

  /**
   * 
   * @param {*} response Creates the icons and draws 
   */
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
      .style('opacity', 0.8)
      .style('border-width', '1px')
      .style('min-width', '300px')
      .style('max-width', '300px');

    d3.select("#" + parentElementID)
      .style("display","inline-block")
      .style("width", "100%")
      .style("margin","0 40px 0 0");

    // Iterate over all rows of our d3 data
    data.forEach(function (d) {

      // This is the full path to our icon
      var imgStr = iconPrefix.concat(d['Icon']);

      d3.select("#" + parentElementID)
        .style("display","inline-block");

      d3.select("#" + parentElementID)
        .append("img")                    
        .attr("src", imgStr)
        .style('border-radius', '10px')
        .style('padding', '0px')
        .style('height', '100px')  
        .on("mouseover", function () {
          var ttStr = formatTooltipInfo(d, iconPrefix);
          tooltip.transition()
            .duration(500)
            .style("opacity", .9);

          var elbb = event.target.getBoundingClientRect();
          return tooltip.style("visibility", "visible")
            .html(ttStr)
            //.style("top", elbb.top + (elbb.bottom-elbb.top)  + "px")
            //.style("left", elbb.left + 0.5*(elbb.right-elbb.left) + "px");
            .style("top", (event.pageY - 30) + "px")
            .style("left", event.pageX + "px");
        })
        .on("mouseout", function () {
        });
    });
  }
}
