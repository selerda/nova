//var Mongo = require("mongo").Mongo;
//var db = new Mongo(null, null, 'testdb');
var http = require('http'), // HTTP server
	url = require("url"),
	querystring = require("querystring");
 
// make a standard server
server = http.createServer();
server = http.Server(function(request,response){
	if (request.url === '/favicon.ico') {
	    response.writeHead(200, {'Content-Type': 'image/x-icon'} );
	    response.end();
	    //console.log('favicon requested');
	    return;
	}
	var pathname = url.parse(request.url).pathname;
	if (pathname !== '/deliver') {
		response.writeHead(500, {'Content-Type': 'text/plain'} );
	    response.end();
	    return;
	}
	var query = url.parse(request.url).query;
	var qs = querystring.parse(query);
	//console.log("Request for " + request.url  + " received.");
	console.log(JSON.stringify(qs));
	
    io.of('/'+qs.account).emit('message', { 'ret': 0, 'data': qs });
	if (qs.callback) { // json callback
		response.writeHead(200, {'Content-Type': 'application/x-javascript; charset=utf-8'});
		response.end(qs.callback+"({'ret': 0})");
	} else {
		response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
		response.end("true");
	}
});

// run on port 8080
server.listen(8080);

// listen to the server
var io = require('socket.io').listen(server);
var deliver= io.of('/deliver');

io.sockets.on('connection', function (socket) {
    socket.on('channel', function(name) {
        io.of('/'+name).on('connection', function (channel) {
            console.log(name+" login");
        });
    });
    
    socket.on('broadcast', function (data) {
        console.log(data);
        //db.insert('messages', {'type':'broadcast', 'content':data.content });
		var response = { 'ret': 0, 'data': data };
        socket.broadcast.emit('broadcast', response);
    });
});
/*
deliver.on('connection', function (socket) {
    socket.on('message', function (data) {
        console.log(data);
        var account = data.account;
        //db.insert('messages', {'type':'p2p', 'to':account, 'content':data.content });
		var response = { 'ret': 0, 'data': data };
        io.of('/'+data.account).emit('message', response);
    });
});
*/