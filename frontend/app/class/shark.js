;(function(exports) {

	var SHARK_SPEED_Y_DEEP = 1.25;
	var SHARK_SPEED_Y_SURFACE = 1;
	var SHARK_SPEED_Y_AIR = 0.75;

	var SHARK_SPEED_X = 5;

	var SPRITES_MAX = 39;

	exports.Shark = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.boundingBox = this.c.collider.RECTANGLE;
	};

	exports.Shark.prototype = {
		id: 0,
		zindex: 1,
		center: {
			x: 0,
			y: 300
		},
		size: {
			x: 64,
			y: 128
		},
		speed: {
			x: 1,
			y: 1
		},
		depth: 0,
		color: 'red',
		sprites: new SpriteSheet('./resource/shark_swim/shark', SPRITES_MAX),
		spriteNumber: 0,
		draw: function(ctx) {
			if(!this.sprites.isReady()) return;
			var sprite = this.sprites.getSprite(this.spriteNumber);
			ctx.drawImage(
				sprite.source,
				sprite.pos.x,
				sprite.pos.y,
				sprite.size.x,
				sprite.size.y,
				this.center.x - this.size.x / 2,
				this.center.y - this.size.y / 2,
				this.size.x,
				this.size.y
			);
		},
		update: function(dt) {
			var data = this.c.sock.getSharkData(this.id);

			this.depth = this.calculateDepth(data.depth);
			if(this.depth > 1) this.speed.y = SHARK_SPEED_Y_AIR;
			else if(this.depth < 1) this.speed.y = SHARK_SPEED_Y_DEEP;
			else this.speed.y = SHARK_SPEED_Y_SURFACE;

			this.center.x += data.direction * this.speed.x * SHARK_SPEED_X * (dt/16.66);
			this.center.y -= data.depth * this.speed.y * (dt/16.66);

			this.spriteNumber += 1;
			if(this.spriteNumber >= SPRITES_MAX) this.spriteNumber = 0;
		},
		calculateDepth: function(dd) {
			if(dd > 0.35) {
				return 1;
			} else if (dd < 0.25 && dd > -0.25 ) {
				return 0;
			} else if (dd < -0.35){
				return -1;
			}
		},
		collision: function(other, type) {
			if(other instanceof Surfer) {
				other.die();
			}
		}
	};

})(window);
