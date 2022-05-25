
import * as fs from 'fs';
import { parse } from 'csv-parse';
import * as path from 'path';
// import csv from 'csv-parser';
export enum CREDENTIAL_TYPE_ENUM {
    hidproxfob = 'hidproxfob',
    android = 'android',
    ios = 'ios',
    uwbfob = 'uwbfob',
    iclass = 'iclass',
    tx5577 = 'tx5577'
}

interface key {
    name: string; // Human friendly name
    key: string // The actual key
    type: CREDENTIAL_TYPE_ENUM; // The type of credential
}

type User = {
    keys: key[];
    firstName: string;
    surname: string;
    email: string;
    phone: string;
    memberStatus: boolean;
};

// find absolute path
const csvFile = path.resolve(__dirname, 'Users.csv');
// each header, allow to skip first line of csv file
const headers = ['keys', 'firstName', 'surname', 'email', 'phone', 'memberStatus'];
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
const file = fs.readFileSync(csvFile, 'utf-8');
// parse from file using delimiter, specifies headers and start from line 2, with external casting
parse(
  file,
  {
    delimiter: ',',
    columns: headers,
    fromLine: 2,
    cast: (value, context) => {
      // parse the keys, so far only splitting on semi-colon
      if (context.column === 'keys') {
        const output = value.split(';').map(element => element.trim());
        return output;
      }
      // return boolean value based on string
      if (context.column === 'memberStatus') {
        return (value.toLowerCase() === 'true');
      }
      return value;
    },
  },
  // callback
  (error, user: User[]) => {
    if (error) {
      console.error(error);
    }
    // output
    console.log(user);
  },
);
