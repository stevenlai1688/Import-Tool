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
// function fillKeys (str: string, allUsers: UserList[]){
//   for(const user of allUsers){
// for (const key of user.keys){
//   key.name = str.split(',')[0].trim();
//   key.key = str.split(',')[1].trim();
//   key.type = str.split(',')[2].trim();
// }
//   }
// }
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
var allUsers = [];
// list to keep keys values
var keyList = [];
var typeList = [];
var nameList = [];
var keyToAdd = [];
var index = 0;
// total users as the total number of lines in the csv file - 1 at least
var totalUsers = fs.readFileSync(csvFile, 'utf-8').split('\n').length - 1;
// instantiate keyToAdd array
for (var i = 0; i < totalUsers; i++) {
    keyToAdd[i] = [];
}
// parse from file using delimiter, specifies headers and start from line 2, with external casting
(0, csv_parse_1.parse)(file, {
    delimiter: ',',
    columns: headers,
    fromLine: 2,
    cast: function (value, context) {
        // parse the keys, so far only splitting on semi-colon
        if (context.column === 'keys') {
            var output = value.split(';').map(function (element) { return element.trim(); });
            for (var i = 0; i < output.length; i++) {
                // call function to split our output and push it to a separate array to be mapped.
                splitAndPush(output[i]);
                // map key values to an array of key value arrays
                keyToAdd[index].push({ name: nameList[i], key: keyList[i], type: typeList[i] });
            }
            index++;
            // reset lists to store next user's key values
            keyList = [];
            typeList = [];
            nameList = [];
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
function (error, list) {
    if (error) {
        console.error(error);
    }
    // add from each user to a list
    var i = 0;
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var user = list_1[_i];
        allUsers.push({
            // map each value
            keys: keyToAdd[i],
            firstName: user.firstName,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            memberStatus: user.memberStatus
        });
        i++;
    }
    // test output
    console.log(keyToAdd);
    console.log(allUsers);
});
/**
 * splits the string of the csv file and populate it to respective array
 * @param output string parsed from the csv file
 */
function splitAndPush(output) {
    var splitVal = output.split(',').map(function (element) { return element.trim(); });
    if (splitVal[0] === undefined || splitVal[0] === '') {
        nameList.push('');
    }
    else {
        nameList.push(splitVal[0]);
    }
    if (splitVal[1] === undefined || splitVal[1] === '') {
        keyList.push('');
    }
    else {
        keyList.push(splitVal[1]);
    }
    if (splitVal[2] === undefined || splitVal[2] === '') {
        typeList.push(null);
    }
    else {
        var value = splitVal[2];
        typeList.push(value);
    }
}
