
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
  res.render('index', { title: 'Newsfeed mit Node.js' });
});

app.post("/rss", function(req, res) {	
	GetRSS(req.body.tbx_input, function(items) {
    /* get the items from the callback function */
    res.render('index', { title: 'Newsfeed mit Node.js', items: items });
  }); 
});

http.createServer(app).listen(8888);

console.log("Service is running...\n");

function GetRSS(url, callback)  {
  var items = [];
  var FeedParser = require('feedparser')
  , request = require('request');

  var req = request(url)
  , feedparser = new FeedParser();

  req.on('error', function (error) {
    console.log("error");
    return;
  });
  req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedparser);
  });

  feedparser.on('error', function(error) {
    // always handle errors
  });

  feedparser.on('readable', function() {
    // This is where the action is!
    var stream = this
      , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
      , item;

    while (item = stream.read())  {
      items.push(item);
    }
  });

  feedparser.on('end', function() {
    callback(items);
  });
}