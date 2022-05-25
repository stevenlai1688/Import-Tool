import * as fs from 'fs';
import { parse } from 'csv-parse';
import * as path from 'path';

type Bank = {
    building: string;
    floor: string;
    name: string;
    number: string;
    description: string;
    visible: boolean;
};

const csvFile = path.resolve(__dirname, 'Banks.csv');
const headers = ['building', 'floor', 'name', 'number', 'description', 'visible'];
const file = fs.readFileSync(csvFile, 'utf-8');
// parse from file using delimiter, specifies headers and start from line 2, with external casting
parse(
  file,
  {
    delimiter: ',',
    columns: headers,
    fromLine: 2,
    cast: (value, context) => {
    // return boolean value based on string
      if (context.column === 'visible') {
        return (value.toLowerCase() === 'true');
      }
      return value;
    },
  },
  // callback
  (error, bank: Bank[]) => {
    if (error) {
      console.error(error);
    }
    // output
    console.log(bank);
  },
);
