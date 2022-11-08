
function drawKeywordCount(course, parentElementID) {
    //console.log("drawKeywordCount(" + course + "," + parentElementID + ")");
    clearUnits();

    function clearUnits() {
        d3.select("#"+parentElementID).selectAll("svg").remove();
    }

    google.charts.load('current');
    google.charts.setOnLoadCallback(init);

    function init() {
        // Load the spreadsheet data using a query
        var url = 'https://docs.google.com/spreadsheets/d/11BcByHOP4BhCnN3YeADMSn5qcqP_xR6ODQT9UC6Flmg/gviz/tq?sheet=' + course;
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

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 40, left: 100 },
            width = 460 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#" + parentElementID)
            .append("svg")
            .attr("id","plot")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Use d3 to parse the string as csv data
        var data = d3.csvParse(csvData);
        var keywords = new Array();

        // Iterate over all rows of our d3 data and append keywords to the words array
        data.forEach(function (d) {
            // Split the keywords on the comma to create an array of keywords
            var local_keywords = d['Keywords'].split(",");
            // Trim off any whitespace
            local_keywords = local_keywords.map(s => s.trim());
            // Append these keywords to our "words" array
            keywords = keywords.concat(local_keywords);
        });
        //console.log(keywords);

        // This should also sort the data
        var rollup1 = d3.rollups(keywords, group => group.length, w => w)
            .sort(([, a], [, b]) => d3.descending(a, b))
            .slice(0, 250)
            .map(([text, value]) => ({ text, value }));

        //console.log(rollup1);
        var xdomain = 0;
        var rollup = new Array();

        rollup1.forEach(function(d) {
            // Find out the domain size by finding the maximum value
            if (d.value > xdomain) xdomain = d.value;

            // Truncate the array to remove the single 
            if (d.value > 1) rollup = rollup.concat(d);
        });

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, xdomain])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(rollup.map(function (d) { return d.text; }))
            .padding(1);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Lines
        svg.selectAll("myline")
            .data(rollup)
            .enter()
            .append("line")
            .attr("x1", function (d) { return x(d.value); })
            .attr("x2", x(0))
            .attr("y1", function (d) { return y(d.text); })
            .attr("y2", function (d) { return y(d.text); })
            .attr("stroke", "grey");

        // Circles
        svg.selectAll("mycircle")
            .data(rollup)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.value); })
            .attr("cy", function (d) { return y(d.text); })
            .attr("r", "7")
            .style("fill", "#69b3a2")
            .attr("stroke", "black");
    }
}

