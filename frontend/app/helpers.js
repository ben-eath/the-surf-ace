;(function(exports){
	exports.initObject = function(obj, defaults, options) {
		for (var def in defaults) {
			if (options[def] === undefined) {
				obj[def] = defaults[def];
			} else {
				obj[def] = options[def];
			}
		}
	};
})(window);
