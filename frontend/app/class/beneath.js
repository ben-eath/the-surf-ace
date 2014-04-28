;(function(exports){

	var FLY_SPEED = 10;
	var BOB_STRENGTH = 1;
	var BOB_SPEED = 0.04;

	exports.BenEath = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.spriteSheet = new SpriteSheet('./resource/ben_eath_surfing/ben_eath', 1);
		this.bob = 0;
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
					} else {
						this.bob += BOB_SPEED;
						this.center.y += Math.sin(this.bob) * BOB_STRENGTH;
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
