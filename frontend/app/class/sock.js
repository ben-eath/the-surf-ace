// socket input from the server
;(function(exports) {
	var Sock = function(game) {
		var self = this;
		this.c = game.c;
		this.roomID = null;
		this.data = {sharks: []};
		var socket = io.connect('http://ace:9000');
		socket.on('notifyRoomID', function(id) {
			self.roomID = id;
		});
		socket.on('updateDepth', function(index, depth) {
			self.data.sharks[index].depth = depth;
		});
		socket.on('updateDirection', function(index, dir) {
			self.data.sharks[index].direction = dir;
		});
		socket.on('notifyNewPlayer', function(index) {
			console.log(index);
			self.data.sharks[index] = {depth: 0, direction: 0};
			self.c.entities.create(Shark, {
				center: {x: 100, y: 100},
				id: index,
				colorMatrix: COLOR_MATRIX_RED
			});
			self.gameStarted = true;
		});
		socket.emit('joinRoom', 'computer');

		this.socket = socket;

		window.onkeydown = function(e) {
			var shark = self.data.sharks[0];
			switch(e.which) {
				case 38:
					shark.depth = -1;
					break;
				case 40:
					shark.depth = 1;
					break;
				case 37:
					shark.direction = -1;
					break;
				case 39:
					shark.direction = 1;
					break;
			}
		};
		window.onkeyup = function(e) {
			var shark = self.data.sharks[0];
			switch(e.which) {
				case 38:
				case 40:
					shark.depth = 0;
					break;
				case 37:
				case 39:
					shark.direction = 0;
					break;
			}
		};
	};

	Sock.prototype = {
		getSharkData: function(sharkID) {
			return this.data.sharks[sharkID];
		},
		gameStarted: false
	};
	exports.Sock = Sock;
})(window);
