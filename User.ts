
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
export type key = {
  name: string,
  key:  string,
  type: CREDENTIAL_TYPE_ENUM
};
export interface UserList {
  keys: key[]// The type of credential
  firstName: string;
  surname: string;
  email: string;
  phone: string;
  memberStatus: boolean;
}

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
const allUsers: UserList[] = [];
// list to keep keys values
let keyList:string[] = [];
let typeList:CREDENTIAL_TYPE_ENUM[] = [];
let nameList:string[] = [];
const keyToAdd:key [][] = [];
let index = 0;
// total users as the total number of lines in the csv file - 1 at least
let totalUsers:number = fs.readFileSync(csvFile, 'utf-8').split('\n').length - 1;
// instantiate keyToAdd array
for (let i = 0; i < totalUsers; i++){
  keyToAdd[i] = [];
}
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
          // call function to split our output and push it to a separate array to be mapped.
          splitAndPush(output[i]);
          // map key values to an array of key value arrays
          keyToAdd[index].push({name: nameList[i], key: keyList[i], type: typeList[i]});
        }
        index ++;
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
    },
  },
  // callback
  (error, list: UserList[]) => {
    if (error) {
      console.error(error);
    }
    // add from each user to a list
    let i = 0;
    for (const user of list){
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
  
  }
);
/**
 * splits the string of the csv file and populate it to respective array
 * @param output string parsed from the csv file
 */
function splitAndPush(output: string): void{
  let splitVal = output.split(',').map(element => element.trim());
          if (splitVal[0] === undefined || splitVal[0] === ''){
            nameList.push('');
          }
          else {
            nameList.push(splitVal[0]);
          }
          if (splitVal[1] === undefined || splitVal[1] === ''){
            keyList.push('');
          }
          else {
            keyList.push(splitVal[1]);
          }

          if (splitVal[2] === undefined || splitVal[2] === '') {
            const value:CREDENTIAL_TYPE_ENUM = <CREDENTIAL_TYPE_ENUM> '';
            this.typeList.push(value);
          }
          else{
            const value:CREDENTIAL_TYPE_ENUM = <CREDENTIAL_TYPE_ENUM> splitVal[2];
            typeList.push(value);
          }
}