"use strict";
exports.__esModule = true;
var fs = require("fs");
var csv_parse_1 = require("csv-parse");
var path = require("path");
var csvFile = path.resolve(__dirname, "Groups.csv");
var headers = ['name', 'description', 'orgId'];
var file = fs.readFileSync(csvFile, 'utf-8');
// parse from file using delimiter, specifies headers and start from line 2, with external casting
(0, csv_parse_1.parse)(file, {
    delimiter: ',',
    columns: headers,
    fromLine: 2
}, 
// callback
function (error, group) {
    if (error) {
        console.error(error);
    }
    // output
    console.log(group);
});
