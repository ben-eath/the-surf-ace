;(function(exports) {

	var SURFER_SPAWN_SPEED = 1000;

	exports.Ocean = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
	};

	exports.Ocean.prototype = {
		zindex: -100,
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
			g: 68,
			b: 100
		},
		time: 0,
		draw: function(ctx) {
			ctx.setFillColor(colorFromObject(this.color));
			ctx.fillRect(
				this.center.x,
				this.center.y,
				this.size.x,
				this.size.y);
		},
		update: function(dt) {
			this.time += dt;
			if (this.time >= SURFER_SPAWN_SPEED) {
				this.time = 0;
				this.c.entities.create(Surfer, {
					center: {
						x: Math.random() * this.size.x,
						y: -100
					}
				});
			}
		}
	};

})(window);
