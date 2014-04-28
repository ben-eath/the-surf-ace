var io = require('socket.io').listen(9000);

// Init variables
var sockets = [];
var rooms = {};
var players = {};

// Controls
var LEFT = -1;
var CENTER = 0;
var RIGHT = 1;
var TOP = 1;
var BOTTOM = -1;

console.log("HEY THERE, NEERAJ! Good job deploying me! Grab another beer!!");

function setDepth (room, index, depth) {
    if (depth >= BOTTOM && depth <= TOP)  {
        room.socket.emit('updateDepth', index, depth);
        return true;
    }
    return false;
}

function setDirection(room, index, direction) {
    if (direction >= -1 && direction <= 1) {
        room.socket.emit('updateDirection', index, direction);
        return true;
    }
    return false;
}

function updateScore(room, index, score) {
    var player = room.players[index];
    player.score = score;
    player.socket.emit('updateScore', score);
}

var generateSessionId = (function() {
    var chars = '34789abcdefhjkmnpqrtuvwxy';
    var charLength = chars.length;

    return function(length) {
        var result = '';
        while (length--)
            result += chars[Math.floor(Math.random() * charLength)];
        return result;
    };
})();

function createRoom (id, socket) {
    rooms[id] = {
        socket: socket,
        players: [],
        deadPlayers: []
    }
}

function getRoomID() {
    do {
        var id = generateSessionId(3);
    } while (rooms[id]);
    return id.toUpperCase();
}

function addController(room, socket) {
    player = {
        socket: socket,
        score: 0
    }

    for(var i = 0, _len = room.players.length; i < _len; i++) {
        if (!room.players[i]) {
            room.players[i] = player;
            return i;
        }
    }
    return room.players.push(player) - 1;
}

function removePlayers(room) {
    room.players.forEach(function(player) {
        if (player) {
            players[player.socket.id] = undefined;
        }
    });
}

io.sockets.on('connection', function(socket) {
    socket.on('joinRoom', function (type, name, id) {
        console.log("connected")
        if (type === 'computer') {
            id = getRoomID();
            createRoom(id, socket);
            socket.emit('notifyRoomID', id);
            socket.on("disconnect", function() {
                if (rooms[id]) {
                    room = rooms[id];
                    removePlayers(room);
                    rooms[id] = undefined;
                }
            });

            socket.on("updateScore", function(index, score) {
                updateScore(rooms[id], index, score);
            });
        } else if (type === 'controller') {
            id = id.toUpperCase();
            var room = rooms[id];

            if (players[socket.id]) {
                socket.emit('warn', 'user already in room');
                return;
            }

            if (room) {
                console.log("controller code")
                var socketId = socket.id;
                var index = addController(room, socket);

                players[socketId] = {
                    room: room,
                    index: index
                };

                var score = 0;
                var corpseScore = room.deadPlayers[name];
                if(corpseScore) {
                    score = corpseScore;
                    room.deadPlayers[name] = undefined;
                }
                room.socket.emit('notifyNewPlayer', index, name, score);

                socket.on('setDepth', function(depth) {
                    if (!setDepth(room, index, depth)) {
                        socket.emit("err", "depth is not valid");
                    }
                });

                socket.on("setDirection", function(direction) {
                    if (!setDirection(room, index, direction)) {
                        socket.emit("err", "direction is not valid");
                    }
                });

                socket.on("chomp", function() {
                    room.socket.emit("chomp", index);
                });

                socket.on("disconnect", function() {
                    if (room.players[index]) {
                        room.deadPlayers[name] = room.players[index].score;
                        room.players[index] = undefined;
                        players[socketId] =  undefined;
                        room.socket.emit("dropPlayer", index);
                    }
                });


                socket.emit('verifyRoom', true, index);
            } else {
                socket.emit('verifyRoom', false);
            }
        }
    });
    socket.on('ping', function() {
        socket.emit('pong');
    });
});