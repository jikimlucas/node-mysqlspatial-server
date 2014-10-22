var express = require('express'),
  fs = require('fs');
var app = express();
app.use(express.bodyParser());
app.use(app.router);
app.use(error);
app.use(express.static(__dirname + '/'));

/* enable CORS */
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

process.on('uncaughtException', function(error) {
   console.error(error, error.stack);
});

// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function(file) {
  if (file.substr(-3) === '.js') {
    route = require('./controllers/' + file);
    route.controller(app);
  }
});

function error(err, req, res, next) {
  // log it
  console.log(err, err.stack);

  // respond with 500 "Internal Server Error".
  res.status(500).send('Internal Server Error');
}

app.listen(3000);
console.log('Listening on port 3000...');

