var testFoler = './data/';
var fs = require('fs');

fs.readdir(testFoler, (err, fileList) => {
  console.log(fileList);
});
