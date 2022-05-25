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
// function fillKeys (str: string, userList: UserList[]){
//   for(const user of userList){
// for (const key of user.keys){
//   key.name = str.split(',')[0].trim();
//   key.key = str.split(',')[1].trim();
//   key.type = str.split(',')[2].trim();
// }
//   }
// }
// find absolute path
var csvFile = path.resolve(__dirname, 'Users.csv');
console.log(csvFile);
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
var userList = [];
var keyList = [];
var typeList = [];
var nameList = [];
var keyToAdd = [];
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
                // console.log(output[i] + "IS OUTPUT "+i);
                nameList.push(output[i].split(',')[0]);
                keyList.push(output[i].split(',')[1]);
                typeList.push(output[i].split(',')[2]);
                // BUG FIX HERE!!!, need to make keyToAdd a 2D array, push two values in the first row, push 0 values in 2nd row
                keyToAdd.push({ name: nameList[i].trim(), key: keyList[i].trim(), type: typeList[i].trim() });
                // console.log(nameList);
                // console.log(typeList);
                // console.log(keyList);
            }
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
    // add from each user to a list
    for (var i = 0; i < user.length; i++) {
        userList.push({
            // if key does not exist, then it is an empty string
            // BUG TO FIX
            // keytoadd at index 0 (user number) should contain two key arrays, at index 1 should contain 0 key arrays
            keys: keyToAdd[i],
            firstName: user[i].firstName,
            surname: user[i].surname,
            email: user[i].email,
            phone: user[i].phone,
            memberStatus: user[i].memberStatus
        });
    }
    // output
    for (var i = 0; i < userList.length; i++) {
        for (var _i = 0, _a = userList[i].keys; _i < _a.length; _i++) {
            var key = _a[_i];
            console.log(key.name);
            console.log(key.key);
            console.log(key.type);
        }
    }
    console.log(userList);
});
