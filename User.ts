
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

// type User = {
//   keys: {
//     name: string, // Human friendly name
//     key: string, // The actual key
//     type: CREDENTIAL_TYPE_ENUM}[]// The type of credential
//   firstName: string;
//   surname: string;
//   email: string;
//   phone: string;
//   memberStatus: boolean;
// };
export interface UserList {
  keys: {
      name: string, // Human friendly name
      key: string, // The actual key
      type: string}[]// The type of credential
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  memberStatus: boolean;
}
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
const csvFile = path.resolve(__dirname, 'Users.csv');
console.log(csvFile);
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
const userList: UserList[] = [];
const keyList:string[] = [];
const typeList:string[] = [];
const nameList:string[] = [];
const keyToAdd = [];
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
        const output: string[] = value.split(';').map(element => element.trim());
        for (let i = 0; i < output.length; i++){
          // console.log(output[i] + "IS OUTPUT "+i);

          nameList.push(output[i].split(',')[0]);
          keyList.push(output[i].split(',')[1]);
          typeList.push(output[i].split(',')[2]);

          // BUG FIX HERE!!!, need to make keyToAdd a 2D array, push two values in the first row, push 0 values in 2nd row
          keyToAdd.push ({name: nameList[i].trim(), key: keyList[i].trim(), type: typeList[i].trim()});

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
    },
  },
  // callback
  (error, user: UserList[]) => {
    if (error) {
      console.error(error);
    }
    // add from each user to a list
    for (let i = 0; i < user.length; i++){
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
    for (let i = 0; i < userList.length; i++){
      for (const key of userList[i].keys){
        console.log(key.name);
        console.log(key.key);
        console.log(key.type);
      }
    }
    console.log(userList);
  
  }
);
