"use strict";
exports.__esModule = true;
exports.CREDENTIAL_TYPE_ENUM = void 0;
var fs = require("fs");
var csv_parse_1 = require("csv-parse");
var path = require("path");
//import csv from 'csv-parser';
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
var headers = ['_id', 'keys', 'firstName', 'surname', 'email', 'phone', 'memberStatus', 'profileImage', 'lastLoginAt', 'issuer', '__v'];
var output = [];
// another potential way to approach this
// create a read stream
//https://www.npmjs.com/package/csv-parser
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
// parse from file using delimiter, specifies headers and start from line 2, with externally casting
(0, csv_parse_1.parse)(file, { delimiter: ',', columns: headers, fromLine: 2,
    cast: function (value, context) {
        // parse phone number to integer, if field is empty, then return 0
        if (context.column === 'phone') {
            return parseInt(value) ? parseInt(value) : 0;
        }
        else if (context.column === 'lastLoginAt') {
            return parseInt(value);
        }
        else if (context.column === '__v') {
            return parseInt(value);
        }
        // parse the keys, so far only splitting on semi-colon
        else if (context.column === 'keys') {
            var key = value.split(';');
            return key;
        }
        return value;
    }
}, 
// callback
function (error, user) {
    if (error) {
        console.error(error);
    }
    // can manually modify each field value of the user
    user.forEach(function (user) {
        //user.firstName = user.firstName.toUpperCase();
        user.memberStatus = (user.memberStatus.toString().toLowerCase() === 'true');
    });
    // output
    console.log(user);
});
