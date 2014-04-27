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

	// thanks to http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
	exports.wrapText = function(context, text, x, y, maxWidth, lineHeight) {
		var lines = text.split('\n');
		for(var i = 0; i < lines.length; i++) {
			var words = lines[i].split(' ');
			var line = '';

			for(var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + ' ';
				var metrics = context.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > maxWidth && n > 0) {
					context.fillText(line, x, y);
					line = words[n] + ' ';
					y += lineHeight;
				}
				else {
					line = testLine;
				}
			}
			context.fillText(line, x, y);
			y += lineHeight;
		}
	};

	exports.COLOR_MATRIX_IDENTITY = [[1,0,0], [0,1,0], [0,0,1]];
	exports.COLOR_MATRIX_RED = [[1,0,0], [0,1,0], [0,0,1]];
	exports.COLOR_MATRIX_BLUE = [[0,0,1], [0,1,0], [1,0,0]];
	exports.COLOR_MATRIX_GREEN = [[0,1,0], [1,0,0], [1,0,0]];
})(window);
