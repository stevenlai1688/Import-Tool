"use strict";
exports.__esModule = true;
var fs = require("fs");
var csv_parse_1 = require("csv-parse");
var path = require("path");
var csvFile = path.resolve(__dirname, 'Banks.csv');
var headers = ['building', 'floor', 'name', 'number', 'description', 'visible'];
var file = fs.readFileSync(csvFile, 'utf-8');
// parse from file using delimiter, specifies headers and start from line 2, with external casting
(0, csv_parse_1.parse)(file, { delimiter: ',', columns: headers, fromLine: 2,
    cast: function (value, context) {
        // return boolean value based on string
        if (context.column === 'visible') {
            return (value.toLowerCase() === 'true');
        }
        return value;
    }
}, 
// callback
function (error, bank) {
    if (error) {
        console.error(error);
    }
    // output
    console.log(bank);
});
