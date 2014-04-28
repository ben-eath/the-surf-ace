;(function(exports) {

	var SPRITES_MAX = 29;

	exports.Sharknet = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.boundingBox = this.c.collider.RECTANGLE;

		this.sprites = new SpriteSheet('./resource/net', SPRITES_MAX, this.colorMatrix);

		this.zindex = 100;
	};

	exports.Sharknet.prototype = {
		center: {
			x: 100,
			y: 0
		},
		size: {
			x: 8,
			y: 12
		},
		speed: {
			x: 5,
			y: 5
		},
		effectiveness: 6000,
		color: 'yellow',
		spriteNumber: 0,
		draw: function(ctx) {
			if(!this.sprites.isReady()) return;
			this.sprites.draw(ctx, this.center, this.size);
		},
		update: function(dt) {
			this.center.y += this.speed.y * (dt/16.66);
			this.center.x += this.speed.x * (dt/16.66);
			if (effectiveness > 0) {
      				this.effectiveness -= dt;
			} else {
				this.effectiveness = 0;
			}
			if (this.center.y > 1000 || this.center.x > 2000 || this.center.x < -100 || this.center.y < -100
			) { //PLACEHOLDER
				this.die();
			}
		},
		die: function(){
			this.c.entities.destroy(this);
		}
	};
})(window);
