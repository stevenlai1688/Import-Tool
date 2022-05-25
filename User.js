"use strict";
exports.__esModule = true;
exports.CREDENTIAL_TYPE_ENUM = void 0;
var fs = require("fs");
var csv_parse_1 = require("csv-parse");
var path = require("path");
// import csv from 'csv-parser';
var CREDENTIAL_TYPE_ENUM;
(function (CREDENTIAL_TYPE_ENUM) {
    CREDENTIAL_TYPE_ENUM["hidproxfob"] = "hidproxfob";
    CREDENTIAL_TYPE_ENUM["android"] = "android";
    CREDENTIAL_TYPE_ENUM["ios"] = "ios";
    CREDENTIAL_TYPE_ENUM["uwbfob"] = "uwbfob";
    CREDENTIAL_TYPE_ENUM["iclass"] = "iclass";
    CREDENTIAL_TYPE_ENUM["tx5577"] = "tx5577";
})(CREDENTIAL_TYPE_ENUM = exports.CREDENTIAL_TYPE_ENUM || (exports.CREDENTIAL_TYPE_ENUM = {}));
// find absolute path
var csvFile = path.resolve(__dirname, 'Users.csv');
// each header, allow to skip first line of csv file
var headers = ['keys', 'firstName', 'surname', 'email', 'phone', 'memberStatus'];
// --- another potential way to approach this
// create a read stream
// https://www.npmjs.com/package/csv-parser
// const output = [];
// const file = fs.createReadStream(csvFile, 'utf-8')
//             // pipeline to a parser
//             .pipe(csv())
//             // adds listener
//             .on('data', (data)=> output.push(data))
//             .on('end', (result: User[]) =>{
//                 console.log(result);
//             });
// https://blog.tericcabrel.com/read-csv-node-typescript/
// https://csv.js.org/parse/options/
// read from file
var file = fs.readFileSync(csvFile, 'utf-8');
// parse from file using delimiter, specifies headers and start from line 2, with external casting
(0, csv_parse_1.parse)(file, {
    delimiter: ',',
    columns: headers,
    fromLine: 2,
    cast: function (value, context) {
        // parse the keys, so far only splitting on semi-colon
        if (context.column === 'keys') {
            var output = value.split(';');
            return output;
        }
        // return boolean value based on string
        if (context.column === 'memberStatus') {
            return (value.toLowerCase() === 'true');
        }
        return value;
    }
}, 
// callback
function (error, user) {
    if (error) {
        console.error(error);
    }
    // output
    console.log(user);
});
