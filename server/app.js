var http = require('http');
var WSS = require('ws').Server;

var port = process.env.PORT || 3001;
var server = new WSS({port: port});

// Init variables
var sockets = [];
var rooms = {};
var players = {};

var LEFT = -1.0;
var RIGHT = 1.0;

var TOP = 1.0;
var CENTER = 0.0;
var BOTTOM = 1.0;

//Test data
rooms['123'] = {
    socket: null,
    controllers: []
}


var functions = function(socket) {
    return {
        joinRoom: function(id) {
            var room = rooms[id];
            if (room) {
                if (!players[id]) {
                    players[id] = {};
                }

                players[id].room = room;
                if (room.controllers.length < 4) {
                    players[id].index = addController(room, null); // need to get socket
                } else {
                    console.error("too many players");
                    return false;
                }
            } else {
                console.error("Not a valid room");
                return false
            }
        },
        "setDepth": function(msg, id) {
            var room = player[id].room;
            room.controllers[player[id].index] = msg

        }
    };
};


function addToIDTable(id, socket) {
	rooms[id] = {
		socket: socket,
        controllers: []
	};
}

function addController(room, socket) {
    controller = {
        direction: LEFT,
        speed: 0,
        depth:BOTTOM,
        socket: socket,
        score: 0
    }
    return room.controllers.push(controller) - 1;
}

server.on('connection', function(socket) {
/*
    if (socket.type === 'computer') {
        var id = getRoomID();
        socket.emit('tellID', id);
        addToIDTable(id, socket);
        socket.on('addScore', function() {//...});
    } else if (socket.type === 'mobile') {
        socket.on('joinRoom', function(id) { // id = 123
            var room = rooms[id];
            if (room) {
                socket.emit('verifyRoom', true);
                players[socket.id].room = room;
                if room.players.length < 4 {
                    players[socket.id].index = addPlayer(room, socket);
                } else {
                    socket.emit('Too many players', false);
                }
            } else {
                socket.emit('verifyRoom', false);
            }
            controller
        });

        socket.on('setDepth', function(message) {
            controllers[socket.id].setDepth(message, socket.id);

        });

        socket.on('update', function())

    }
*/

	console.log('New connected!');
	sockets.push(socket);
    var fns = functions(socket);

	socket.on('message', function(msg) {
        var data;
        try {
            data = JSON.parse(msg);
        } catch(e) {
            console.error('Not JSON.');
            console.error(e);
            return;
        }

        var fn = data.fn;
        var args = data.args;
        if(!fn || !args) {
            console.log("Did not get valid function");
            return;
        }

        if(fns[fn]) {
            fns[fn](args);
            console.log("valid command");
        } else {
            console.error('not valid command');
            return;
        }
	});

	socket.on('close', function() {
		console.log('Connection closed!');
		var index = sockets.indexOf(socket);
		sockets.splice(index, 1);
	});
});
