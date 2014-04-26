// socket input from the server
;(function(exports) {
	var Sock = function() {
		// this.socket = new WebSocket("ace");
	};

	Sock.prototype = {
		data: {
			sharks: [
				{
					direction: 1,
					depth: 1
				},
				{
					direction: -1,
					depth: -1
				},
				{
					direction: 0,
					depth: 0
				}
			]
		},
		updateData: function(data) {
			this.data = data;
		},
		getSharkData: function(sharkID) {
			return this.data.sharks[sharkID];
		}
	};
	exports.Sock = Sock;
})(window);