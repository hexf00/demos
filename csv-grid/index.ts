import fs from "fs";
import parse from "csv-parse";
import iconv from "iconv-lite";
import util from "util";

let csvBuffers = fs.readFileSync("C:/Users/admin/Desktop/1.csv");
let csvString = iconv.decode(csvBuffers, "gbk");

type TCSV = {
  [key: string]: string[];
};

parse(csvString, (err, data: Array<Array<string>>) => {
  let keys = data.shift();

  let keysDict: TCSV = {};

  let keysDictSorted: TCSV = {};

  if (util.isNullOrUndefined(keys)) {
    return;
  }

  keys.forEach((key, index) => {
    let uniqDict: { [key: string]: boolean } = {};
    keysDict[key] = [...data.map((row) => row[index])]
      .map((it) => {
        if (uniqDict[it]) {
          return "";
        } else {
          uniqDict[it] = true;
          return it;
        }
      })
      .filter((it) => it);
  });

  Object.keys(keysDict)
    .sort()
    .forEach(function (key) {
      keysDictSorted[key] = keysDict[key];
    });

  console.log(keysDictSorted);
});
