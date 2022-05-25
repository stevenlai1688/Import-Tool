import { Types } from 'mongoose';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import * as path from 'path';

type PermGroup = {
    // Used to specify banks which should be added to the permgroup - can be blank.
    banks?: Types.ObjectId[];
    name: string;
    building: string; // This should probably be an object id eventually
    floor?: string;
};

const csvFile = path.resolve(__dirname, 'PermGroups.csv');
const headers = ['banks', 'name', 'building', 'floor'];
const file = fs.readFileSync(csvFile, 'utf-8');
// parse from file using delimiter, specifies headers and start from line 2, with external casting
parse(
  file,
  {
    delimiter: ',',
    columns: headers,
    fromLine: 2,
    cast: (value, context) => {
    // split bank ObjectId based on semi-colon separation
      if (context.column === 'banks') {
        // split different ObjectId values with ';'
        const output = value.split(';').map(element => element.trim());
        return output;
      }
      return value;
    },
  },
  // callback
  (error, permgroup: PermGroup[]) => {
    if (error) {
      console.error(error);
    }
    // output
    console.log(permgroup);
  },
);
