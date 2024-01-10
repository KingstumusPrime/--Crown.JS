var fs = require('fs');
function readFiles(dirname, oName) {
  let res = "";
  fs.readdir(dirname, function(err, filenames) {
    filenames.forEach((filename) => {
        const buffer = fs.readFileSync(dirname +"/" + filename,'utf8');
        res += buffer;
    })
    
    fs.writeFile(oName, res, (err) => {if (err) throw err})
    console.log("MADE FILE: " +  res);
  });

  return res
}

console.log(readFiles("./src", "./spacegame/crown.js"));