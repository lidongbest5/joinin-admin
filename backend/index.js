var path = require('path');
var express = require('express');
var config = require('config-lite')(__dirname);
var routes = require('./routes');
var pkg = require('./package');
var expressJWT = require('express-jwt');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.set('views', path.join(__dirname, 'views'));

app.use(cors({ exposedHeaders: ["Link"] })); // enable CORS - Cross Origin Resource Sharing

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// jwt 
app.use(expressJWT({
  secret: config.secret   
}).unless({
  path: [
    '/api/v1/sessions',
    '/api/v1/sessions/register',
    '/api/v1/sessions/sms',
    '/api/v1/events/listsAll'
  ]
}));

routes(app);

// error handler
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {   
    res.status(401).json({message: 'invalid token...'});
  }
});

if (module.parent) {
  module.exports = app;
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
  });
}
