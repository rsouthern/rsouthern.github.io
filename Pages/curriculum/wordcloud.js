function drawWordCloud(course, parentElementID) {
    // Start by clearing any existing wordcloud
    d3.select("#" + parentElementID).selectAll("svg").remove();

    // Load the data from the google sheet
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

        // Use d3 to parse the string as csv data
        var data = d3.csvParse(csvData);

        // Our empty words array
        var keywords = new Array();

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 10, bottom: 10, left: 10 },
            width = 450 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        // Iterate over all rows of our d3 data and append keywords to the words array
        data.forEach(function (d) {
            // Split the keywords on the comma to create an array of keywords
            var local_keywords = d['Keywords'].split(",");
            // Trim off any whitespace
            local_keywords = local_keywords.map(s => s.trim());
            // Append these keywords to our "words" array
            keywords = keywords.concat(local_keywords);
        });

        var rollup = d3.rollups(keywords, group => group.length, w => w)
            .sort(([, a], [, b]) => d3.descending(a, b))
            .slice(0, 250)
            .map(([text, value]) => ({ text, value }));
            
        console.log(rollup);

        const svg = d3.select("#" + parentElementID).append("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("text-anchor", "middle");

        const cloud = d3.cloud()
            .size([width, height])
            .words(rollup.map(d => Object.create(d)))
            .padding(padding)
            .rotate(rotate)
            .fontSize(d => Math.sqrt(d.value) * fontScale)
            .on("word", ({ size, x, y, rotate, text }) => {
                svg.append("text")
                    .attr("font-size", size)
                    .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
                    .text(text);
            });
    }
}