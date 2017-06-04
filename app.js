/**
 * Created by vidit on 3/6/17.
 */
var express         = require('express');
var http            = require('http');
var https           = require('https');
var bodyParser      = require('body-parser');
var cluster         = require('cluster');
var os              = require('os');
var fs              = require('fs');
var morgan          = require('morgan');


var app     = express();


////////////////////////////////////////////////////////////////////////
// Globals
////////////////////////////////////////////////////////////////////////
var socket                        = require('./routes/socket');
var classes                       = require('./routes/classes');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//////////////////////////////////
// set up the port number
app.set('port', process.env.PORT || 8000);
/////////////////////////////////

////////////////////////////////
// Api list to perform any action related to classes
app.post('/create',         classes.createClass);
app.post('/delete',         classes.deleteClass);
app.post('/update',         classes.updateClass);
app.get('/get_all',         classes.getAll);
///////////////////////////////



/**
 *  API to check if server is running or not
 */
app.get('/ping', function (req, res) {
    res.send(200, {}, { pong: true });
});


var httpServer = http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
});

socket.attach(httpServer);
socket.emit("new_class",{_id:123});
