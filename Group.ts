import * as fs from 'fs';
import { parse } from 'csv-parse';
import * as path from 'path';
type Group = {
    name: string;
    description: string;
    orgId: string;
}
const csvFile = path.resolve(__dirname, "Groups.csv");
const headers = ['name', 'description', 'orgId'];
const file = fs.readFileSync (csvFile, 'utf-8');

// parse from file using delimiter, specifies headers and start from line 2, with external casting
parse(
    file,
    {
      delimiter: ',',
      columns: headers,
      fromLine: 2,
    },
    // callback
    (error, group: Group[]) => {
      if (error) {
        console.error(error);
      }
      // output
      console.log(group);
    },
  );
  