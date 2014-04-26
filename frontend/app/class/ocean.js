;(function(exports) {

	exports.Ocean = function(options) {
		var defaults = {
			pos: {
				x: 0,
				y: 0
			},
			size: {
				x: 800,
				y: 600
			},
			color: 'blue'
		};
		initObject(this, defaults, options);
	};

})(window);
