// Use the request library to make the HTTP request
// Use Node's fs module to write the file
// Use the callback based approach we've been learning so far
// Do not use the pipe function
// Do not use synchronous functions (see warning below)
const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const req = function(write) {
  const input = process.argv.slice(2);
  request(input[0], (error, body) => {
    if (error) {
      console.log('error: ', error);
    } else {
      if (fs.existsSync(input[1])) {
        ifOverwrite(() => {
          write(body.body, input[1]);
          rl.close();
        });

      } else {
        write(body.body, input[1]);
        rl.close();
      }
    }
  });
};

const ifOverwrite = (callback) => {
  rl.question('File already exists, do you want to overwrite the file? ', (answer) => {
    (answer === 'y' || answer === 'Y') ? callback() : process.exit();
  });
};
  
const writeToFile = function(data, output) {
  fs.writeFile(output, data, 'utf8', (error) => {
    if (error) {
      console.log(error);
    } else {
      const stats = fs.statSync(output);
      const size = stats.size;
      console.log(`Downloaded and saved ${size} bytes to ${output}`);
    }
  });
    
};
req(writeToFile);