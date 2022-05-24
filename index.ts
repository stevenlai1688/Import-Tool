import * as fs from 'fs';
import {parse} from 'csv-parse';
import * as path from 'path';
//import csv from 'csv-parser';

interface key {
    name: string; // Human friendly name
    key: string // The actual key
    type: Enumerator; // The type of credential
}

type User = {
    _id: string;
    keys: key[];
    firstName: string;
    surname: string;
    email: string;
    phone: string;
    memberStatus: boolean;
    profileImage:string;
    lastLoginAt: number;
    issuer: string;
    __v: number;
};

// find absolute path
const csvFile = path.resolve(__dirname, 'Users.csv');
// each header, allow to skip first line of csv file
const headers = ['_id', 'keys', 'firstName', 'surname', 'email', 'phone', 'memberStatus', 'profileImage', 'lastLoginAt', 'issuer', '__v'];
const output = [];
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
const file = fs.readFileSync(csvFile, 'utf-8');
// parse from file using delimiter, specifies headers and start from line 2, with externally casting
parse(file, { delimiter: ',', columns: headers, fromLine: 2, cast: (value, context) => {
    // parse phone number to integer, if field is empty, then return 0
    if (context.column === 'phone'){
        return parseInt(value) ? parseInt(value) : 0;
    }
    return value;
}}, (error, user: User[]) => {
    if (error){
        console.error(error);
    }
    // modify each field value of the user
    user.forEach(user => {
        user.__v = user.__v.valueOf();
        user.firstName = user.firstName.toUpperCase();
        user.memberStatus = (user.memberStatus.toString().toLowerCase() === 'true');
    });
    // output
    console.log(user);
});

