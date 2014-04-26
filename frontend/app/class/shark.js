;(function(exports) {

	exports.Shark = function(options) {
		var defaults = {
			pos: {
				x: 100,
				y: 300
			},
			size: {
				x: 64,
				y: 128
			},
			submerged: true
		};
		initObject(this, defaults, options);
	};

})(window);
