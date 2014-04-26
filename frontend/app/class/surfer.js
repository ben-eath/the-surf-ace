;(function(exports) {

	var SPEED = 1;
	var SERPENTINE_AMOUNT = 1;

	exports.Surfer = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
	};

	exports.Surfer.prototype = {
		pos: {
			x: 100,
			y: 0
		},
		size: {
			x: 64,
			y: 128
		},
		dead: false,
		color: 'yellow',
		serpentine: 0,
		draw: function(ctx){
			ctx.setFillColor(this.color);
			ctx.fillRect(
				this.pos.x,
				this.pos.y,
				this.size.x,
				this.size.y);
		},
		update: function(dt) {
			this.pos.y += SPEED;

			this.serpentine += 0.05;
			this.pos.x += Math.sin(this.serpentine) * SERPENTINE_AMOUNT;
		}
	};

})(window);
