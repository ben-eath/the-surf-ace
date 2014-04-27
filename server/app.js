var io = require('socket.io').listen(9000);

// Init variables
var sockets = [];
var rooms = {};
var players = {};

var LEFT = -1;
var CENTER = 0;
var RIGHT = 1;
var TOP = 1;
var BOTTOM = -1;

function setDepth (room, index, depth) {
    var player = room.players[index];
    if (depth >= BOTTOM && depth <= TOP)  {
        player.depth = depth;
        room.socket.emit('updateDepth', index, depth);
        console.log("new depth");
        return true;
    }
    return false;
}

function setDirection(room, index, direction) {
    var player = room.players[index];
    if (direction >= -1 && direction <= 1) {
        player.direction = direction;
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

// this is Riley being an asshole and throwing a monstrosity
// in the middle of this beautifully concise server
var generateSessionId = (function(length) {
    var memo = {};

    // returns a series of chars, length len
    var charSeries = function(len, char) {
        for (var series = ''; series.length < len;)
            series += char;
        return series;
    }

    var f = function(len) {
        var floor, ratio, memoVal = memo[len];
        if (memoVal) {
            floor = memoVal.floor;
            ratio = memoVal.ratio;
        } else {
            // '10..0' in base 36
            floor = parseInt(1 + charSeries(len, '0'), 36);
            // '1z..z' in base 36 / floor gives 1.x, -1 = x
            ratio = parseInt(1 + charSeries(len, 'z'), 36) / floor - 1;
            // memoize it for next time
            memo[len] = {
                floor: floor,
                ratio: ratio
            };
        }
        return (
            // 1 * floor = '00..0', (1 + ratio) * floor = 'zz..z'
            Math.floor((1 + Math.random() * ratio) * floor)
            // 36 parses it to use 0-9 and a-z
            .toString(36)
            // kick the leading '1' off the string
            .substring(1)
        );
    }

    return f;
})();

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
    return id.toUpperCase();
}

function addController(room, socket) {
    player = {
        direction: CENTER,
        depth: BOTTOM,
        socket: socket,
        score: 0
    }
    return room.players.push(player) - 1;
}

io.sockets.on('connection', function(socket) {
    console.log("connection");
    socket.on('joinRoom', function (type, id) {
        if (type === 'computer')  {
            console.log("room");
            var id = getRoomID();
            createRoom(id, socket);
            socket.emit('notifyRoomID', id);
        } else if (type === 'controller') {
            console.log("controller");
            id = id.toUpperCase();
            var room = rooms[id];
            if (room) {
                var socketId = socket.id;
                var index = addController(room, socket);
                players[socketId] = {};
                players[socketId].index = index;
                players[socketId].room = room;

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
                
                socket.emit('verifyRoom', true);
            } else {
                socket.emit('verifyRoom', false);
            }
        }
    });
});
