;(function(exports){
	exports.initObject = function(obj, settings) {
		for (var s in settings) {
			obj[s] = settings[s];
		}
	};

	exports.colorFromObject = function(color) {
		return  "rgb" + (color.a ? "a" : "") + "(" +
				color.r + "," +
				color.g + "," +
				color.b + (color.a ? "," : ")") +
				(color.a ? color.a + ")" : "");
	};

	exports.COLOR_MATRIX_RED = [[1,0,0], [0,1,0], [0,0,1]];
	exports.COLOR_MATRIX_BLUE = [[0,0,1], [0,1,0], [1,0,0]];
	exports.COLOR_MATRIX_GREEN = [[0,1,0], [1,0,0], [1,0,0]];
})(window);
