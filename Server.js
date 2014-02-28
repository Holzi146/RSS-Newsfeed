var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("Hello World!");
  var body = '';
  req.on('data', function(chunk) {
    body += chunk.toString('utf8');
  });
  req.on('end', function() {
    console.log(body);
    res.end();
    res.writeHead(200, {'Content-Type': 'text/plain'});
  });
}).listen(8888);

console.log("Service is running...");