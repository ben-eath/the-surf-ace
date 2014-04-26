;(function(exports) {

	var SURFER_SPAWN_SPEED = 1000 * 3;

	exports.Start = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
	};

	exports.Start.prototype = {
		zindex: 100,
		center: {
			x: 0,
			y: 0
		},
		size: {
			x: 800,
			y: 600
		},
		color: {
			r: 0,
			g: 128,
			b: 255,
			a: 0
		},
		draw: function(ctx) {
			ctx.font = '64pt VT323';
			ctx.textAlign = 'center';
			ctx.fillStyle = 'blue';
			ctx.fillText('Ben Eath: Surf Ace', this.center.x, this.center.y);
		},
		update: function() {}
	};

})(window);
