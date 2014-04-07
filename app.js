
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

  /* add http tag if it is missing */
  var url = req.body.tbx_input;
  if(url.slice(0,4) != 'http')
    url = 'http://'.concat(url);

	GetRSS(url, function(items) {
    /* get the items from the callback function (is null when an error is occured) */
    res.render('index', { title: 'Newsfeed mit Node.js', items: items });
  }); 
});

http.createServer(app).listen(8888);

console.log("Service is running...\n");

function GetRSS(url, callback)  {
  var items = [];
  var FeedParser = require('feedparser')
  , request = require('request');

  /* see if request(url) throws any errors */
  try  {
    var req = request(url), feedparser = new FeedParser();
  }
  
  catch(e)  {
    console.log("Site is not available or has no rss-feed built in...");
    /* the callback function has to be called in every error-case */
    callback(null);
    return;
  }

  req.on('error', function (error) {
    console.log("Request Error");
    callback(null);
    return;
  });
  
  req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) 
      return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedparser);
  });

  feedparser.on('error', function(error) {
    console.log("Feedparser Error");
    callback(null);
    return;
  });

  feedparser.on('readable', function() {
    var stream = this, item;

    while (item = stream.read())  {
      items.push(item);
    }
  });

  feedparser.on('end', function() {
    callback(items);
  });
}