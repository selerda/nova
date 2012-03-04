var express = require('express');
var fs = require('fs');
var app = express.createServer();

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	console.log("Warning: Server in Development Mode, add NODE_ENV=production");
});
 
app.configure('production', function(){
	app.use(express.errorHandler());
	console.log("Production Mode");
});

app.post('/push', function(req, res){
	console.log(JSON.stringify(req.body));
	io.of('/'+req.body.uid).emit('message', { 'ret': 0, 'data': req.body });
	res.contentType('json')
	res.send({'ret':0});
});

app.post('/chat', function(req, res){
	console.log(JSON.stringify(req.body));
	io.of('/'+req.body.cnname).emit('message', { 'ret': 0, 'data': req.body });
	res.contentType('json')
	res.send({'ret':0});
});

app.post('/broadcast', function(req, res){
	console.log(JSON.stringify(req.body));
	io.sockets.emit('broadcast', { 'ret': 0, 'data': req.body });
	res.contentType('json')
	res.send({'ret':0});
});

// GET request
var startRouter = function(path){
	app.get(route, function(req,res){
		//console.log("Connect to "+path);
		//var page = info[routes[path].data];
		//res.render(routes[path].template, page);
		res.render(routes[path].template);
	});
};

var routes = JSON.parse(fs.readFileSync('router.json','utf8'));
for(route in routes){
	// if call function, route always the lastest one
	startRouter(route);
}
 
//File not found
app.get('/*', function(req, res){
	res.render('404', {status: 404, title:'404 - File not found'});
});

app.listen(8080);

// socket.io server
var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
	console.log("sockets connection");
	
	socket.on('person', function(uid) {
		io.of('/'+uid).on('connection', function (person) {
			console.log(uid+" login");
		});
	});
	
	socket.on('channel', function(cnname) {
		io.of('/'+cnname).on('connection', function (channel) {
			console.log("join channel "+ channel);
		});
	});

});