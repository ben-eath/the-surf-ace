;(function(exports){

	var FLY_SPEED = 10;

	exports.BenEath = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.spriteSheet = new SpriteSheet('./resource/ben_eath_surfing/ben_eath', 1);
	};

	exports.BenEath.prototype = {
		size: {
			x: 256,
			y: 256
		},
		update: function(dt) {
			if(this.displayOnly) {
				if(this.onScreen){
					if(this.center.x > this.target[0].x) {
						this.center.x -= FLY_SPEED;
					}
				} else {
					if(this.center.x > this.target[1].x) {
						this.center.x -= FLY_SPEED;
					} else {
						this.c.entities.destroy(this);
					}
				}
			} else {
				console.log("attack mode");
			}
		},
		draw: function(ctx) {
			this.spriteSheet.draw(ctx, this.center, this.size);
		}
	};

})(window);
