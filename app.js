var https = require('https');
var fs = require('fs');
var path = require('path');

var options = {
  key: fs.readFileSync('private.pem'),
  cert: fs.readFileSync('selfSigned.pem')
};

https.createServer(options, function(req, res) {

  console.log('request received');

  var filePath = '.' + req.url;
  if (filePath == './')
    filePath = './start.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
  }

  console.log(filePath);

  if (req.method == "POST") {
    var body = "";

    req.on("data", function(data) {
      body += data;
    });
    req.on('end', function() {
      console.log(body);
      check = body.split('=')[1];
      console.log(check);
      if (check && (0>check||check.indexOf('-')>0)) {
        res.writeHead(400, {
          'Content-Type': 'text/html'
        });
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
      }
      console.log("END");
    });
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end('post received');
  } else {

    switch (filePath) {


      default:

        fs.readFile(filePath, function(error, content) {
          if (error) {
            if (error.code == 'ENOENT') {
              fs.readFile('./404.html', function(error, content) {
                res.writeHead(200, {
                  'Content-Type': contentType
                });
                res.end(content, 'utf-8');
              });
            } else {
              res.writeHead(500);
              res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
              res.end();
            }
          } else {
            res.writeHead(200, {
              'Content-Type': contentType
            });
            res.end(content, 'utf-8');
          }
        });
    }
  }
}).listen(7000);
