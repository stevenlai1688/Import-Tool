"use strict";
exports.__esModule = true;
var fs = require("fs");
var csv_parse_1 = require("csv-parse");
var path = require("path");
// find absolute path
var csvFile = path.resolve(__dirname, 'Users.csv');
// each header, allow to skip first line of csv file
var headers = ['_id', 'keys', 'firstName', 'surname', 'email', 'phone', 'memberStatus', 'profileImage', 'lastLoginAt', 'issuer', '__v'];
var output = [];
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
// read from file
var file = fs.readFileSync(csvFile, 'utf-8');
// parse from file using delimiter, specifies headers and start from line 2, with externally casting
(0, csv_parse_1.parse)(file, { delimiter: ',', columns: headers, fromLine: 2, cast: function (value, context) {
        // parse phone number to integer
        if (context.column === 'phone') {
            return parseInt(value) ? parseInt(value) : 0;
        }
        return value;
    } }, function (error, user) {
    if (error) {
        console.error(error);
    }
    // modify each field value of the user
    user.forEach(function (user) {
        user.__v = user.__v.valueOf();
        user.firstName = user.firstName.toUpperCase();
        user.memberStatus = (user.memberStatus.toString().toLowerCase() === 'true');
    });
    // output
    console.log(user);
});
