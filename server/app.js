var io = require('socket.io').listen(3001);

var port = process.env.PORT || 3001;
//var server = new WSS({port: port});

// Init variables
var sockets = [];
var rooms = {};
var players = {};

var LEFT = -1.0;
var RIGHT = 1.0;

var TOP = 1.0;
var CENTER = 0.0;
var BOTTOM = -1.0;


function setDepth (room, index, depth) {
    var player = room.players[index];
     if (depth >= -1 && depth <= 1)  {
        player.depth = depth;
        console.log(room.players[index].depth)
        room.socket.emit('updateDepth', depth);
        return true;
    }
    return false;
}

function setDirection(room, index, direction) {
    var player = room.player[index];
    if (direction >= -1 && direction <= 1) {
        player.direction = direction;
        room.socket.emit('updateDirection', direction);
        return true;
    }
    return false;
}

function updateScore(room, index, score) {
    var player = room.player[index];
    player.score = score;
    player.socket.emit('updateScore', score);
}


function generateSessionId (length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < length; i++) result += chars[ Math.round(Math.random() * (chars.length - 1)) ];
    return result;
}

function createRoom (id, socket) {
    rooms[id] = {
        socket: socket,
        players: []
    }
}

function getRoomID() {
    do {
        var id = generateSessionId(4);
    } while (rooms[id]);
    return id;
}

function addController(room, socket) {
    player = {
        direction: LEFT,
        depth: BOTTOM,
        socket: socket,
        score: 0
    }
    return room.players.push(player) - 1;
}

io.sockets.on('connection', function(socket) {
    socket.on('joinRoom', function (type, id) {
        if (type === 'computer')  {
            var id = getRoomID();
            createRoom(id, socket);
            socket.emit('notifyRoomID', id);
        } else if (type === 'controller') {
            var room = rooms[id];
            if (room) {
                var index = addController(room, socket);
                players[socket.id] = {};
                players[socket.id].index = index;
                players[socket.id].room = room;

                socket.on('setDepth', function(depth) {
                    if (!setDepth(room, index, depth)) {
                        socket.emit("err", "depth is not valid");
                    }
                });

                socket.on("setDirection", function(direction) {
                    if (setDirection(room, index, direction)) {
                        socket.emit("err", "direction is not valid");
                    }
                });
            } else {    
                socket.emit('err', "ERROR: Not a valid room");
            }
        }
    });
    socket.on('joinRoom', function (data) {
        console.log("connection");
    });

});