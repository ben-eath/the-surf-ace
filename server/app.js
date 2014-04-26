var http = require('http');
var WSS = require('ws').Server;

var port = process.env.PORT || 3001;
var server = new WSS({port: port});

// Init variables
var sockets = [];
var rooms = {};
var controllers = {};

function initalizeGameState() {
	game_state = {
		sharks:[],
		surfers:[]
	};
	return game_state;
}

function addToIDTable(id, socket) {
	rooms[id] = {
		socket: socket,
		game_state: initalizeGameState()
	};
}

server.on('connection', function(socket) {
	console.log('New connected!');
	sockets.push(socket);

	socket.on('message', function(msg) {
		console.log('Got data: ' + msg);

		sockets.forEach(function(otherSocket) {
			if (otherSocket !== socket) {
				otherSocket.write(msg);
			}
		});
	});

	socket.on('close', function() {
		console.log('Connection closed!');
		var index = sockets.indexOf(socket);
		sockets.splice(index, 1);
	});
});
