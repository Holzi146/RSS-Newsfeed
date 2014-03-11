var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.write("Hello World!");
  var body = '';
  req.on('data', function(chunk) {
    body += chunk.toString('utf8');
  });
  req.on('end', function() {
    console.log("Requested URL: " + body);
    GetRSS(body);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end();
  });
}).listen(8888);

console.log("Service is running...\n");

function GetRSS(url)  {
    
  var FeedParser = require(__dirname)
  , fs = require('fs')
  , feed = __dirname+'/news.xml';

  fs.createReadStream(feed)
    .on('error', function (error) {
      console.error(error);
    })
    .pipe(new FeedParser())
    .on('error', function (error) {
      console.error(error);
    })
    .on('meta', function (meta) {
      console.log('===== %s =====', meta.title);
    })
    .on('readable', function() {
      var stream = this, item;
      while (item = stream.read()) {
        console.log('Got article: %s', item.title || item.description);
      }
    });  
}