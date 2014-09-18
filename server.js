// Pay - server.js

// Fichier d'application principal

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// Custom files
var routes = require('./routes');

// Server configuration
var port = 8080;

// POST data parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Contenu statique (sera changé pour nginx)
app.use(express.static(__dirname + '/static'));

// API router
var router = express.Router();
routes.createOn(router);
app.use('/api', router);

app.listen(port);
console.log('Listenning on port : ', port);
