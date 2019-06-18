const fs = require('fs');
var dbpass;
configPath = 'info.env';
var parsed = fs.readFileSync(configPath, 'UTF-8');
// console.log(parsed);
// fs.readFile('info.env', (err, data) => {
//     if (err) throw err;
//     dbpass = data.toString();
//     console.log(dbpass);
// })
exports.storageConfig = parsed;