;(function(exports) {

	var SPEED = 1;
	var SERPENTINE_AMOUNT = 1;

	exports.Surfer = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.boundingBox = this.c.collider.RECTANGLE;
	};

	exports.Surfer.prototype = {
		center: {
			x: 100,
			y: 0
		},
		size: {
			x: 64,
			y: 128
		},
		color: 'yellow',
		serpentine: 0,
		draw: function(ctx){
			ctx.setFillColor(this.color);
			ctx.fillRect(
				this.center.x - this.size.x / 2,
				this.center.y - this.size.y / 2,
				this.size.x,
				this.size.y);
		},
		update: function(dt) {
			this.center.y += SPEED;

			this.serpentine += 0.05;
			this.center.x += Math.sin(this.serpentine) * SERPENTINE_AMOUNT;
		},
		die: function(){
			this.c.entities.destroy(this);
			this.c.entities.create(Bloodstain, {
				center: this.center
			});
		}
	};

})(window);
