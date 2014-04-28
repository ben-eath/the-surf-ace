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

	// thanks to http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/
	exports.drawRotatedImage = function(context, image, x, y, angle, sx, sy) {
		// save the current co-ordinate system
		// before we screw with it
		context.save();

		// move to the middle of where we want to draw our image
		context.translate(x, y);

		// rotate around that point, converting our
		// angle from degrees to radians
		context.rotate(angle);

		// draw it up and to the left by half the width
		// and height of the image
		context.drawImage(image, -((sx || image.width)/2), -((sy || image.height)/2), sx, sy);

		// and restore the co-ords to how they were when we began
		context.restore();
	};

	exports.COLOR_MATRIX_IDENTITY = [[1,0,0], [0,1,0], [0,0,1]];
	exports.COLOR_MATRIX_RED = [[1,0,0], [0,1,0], [0,0,1]];
	exports.COLOR_MATRIX_BLUE = [[0,0,1], [0,1,0], [1,0,0]];
	exports.COLOR_MATRIX_GREEN = [[0,1,0], [1,0,0], [1,0,0]];
})(window);
