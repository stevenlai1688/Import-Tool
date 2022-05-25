"use strict";
exports.__esModule = true;
var fs = require("fs");
var csv_parse_1 = require("csv-parse");
var path = require("path");
var csvFile = path.resolve(__dirname, 'PermGroups.csv');
var headers = ['banks', 'name', 'building', 'floor'];
var file = fs.readFileSync(csvFile, 'utf-8');
// parse from file using delimiter, specifies headers and start from line 2, with external casting
(0, csv_parse_1.parse)(file, {
    delimiter: ',',
    columns: headers,
    fromLine: 2,
    cast: function (value, context) {
        // split bank ObjectId based on semi-colon separation
        if (context.column === 'banks') {
            // split different ObjectId values with ';'
            var output = value.split(';').map(function (element) { return element.trim(); });
            return output;
        }
        return value;
    }
}, 
// callback
function (error, permgroup) {
    if (error) {
        console.error(error);
    }
    // output
    console.log(permgroup);
});
