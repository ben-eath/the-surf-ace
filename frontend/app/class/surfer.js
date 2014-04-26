;(function(exports) {

	exports.Surfer = function(options) {
		var defaults = {
			pos: {
				x: 100,
				y: 0
			},
			size: {
				x: 64,
				y: 128
			},
			dead: false
		};
		initObject(this, defaults, options);
	};

})(window);
