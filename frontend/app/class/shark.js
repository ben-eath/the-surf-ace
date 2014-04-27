;(function(exports) {

	var SHARK_SPEED_Y_DEEP = -1;
	var SHARK_SPEED_Y_AIR = 3;

	var SHARK_SPEED_X = 5;

	var SPRITES_SWIM_SURFACE_MAX = 39;
	var SPRITES_SWIM_DEEP_MAX = 39;
	var SPRITES_LAG_SURFACE_MAX = 1;
	var SPRITES_CHOMPING_MAX = 1;

	var STATE_SWIM_SURFACE = 0; // sitting on surface, swimmming, dont move
	var STATE_SWIM_DEEP = 1; // dived deep, swimming, move up
	var STATE_LAG_SURFACE = 2; //on surface, not swimming, move back
	var STATE_CHOMPING = 3; //in air, not swimming, leap forward, lasts 1 second

	exports.Shark = function(game, settings) {
		this.c = game.c;
		this.center = settings.center || {
			x: 0,
			y: 300
		};
		this.speed = settings.speed || {
			x: 1,
			y: 1
		};
		this.state = settings.state || 0;

		initObject(this, settings);

		this.spriteMaxes = [39, 39, 1, 1];

		this.sprites[STATE_SWIM_SURFACE] = new SpriteSheet('./resource/shark_swim/shark', this.spriteMaxes[STATE_SWIM_SURFACE], settings.colorMatrix, 0.5);
		this.sprites[STATE_SWIM_DEEP] = new SpriteSheet('./resource/shark_swim/shark', this.spriteMaxes[STATE_SWIM_DEEP], settings.colorMatrix, 0.5);
		this.sprites[STATE_LAG_SURFACE] = new SpriteSheet('./resource/shark_bite/shark', this.spriteMaxes[STATE_LAG_SURFACE], settings.colorMatrix, 0.5);
		this.sprites[STATE_CHOMPING] = new SpriteSheet('./resource/shark_bite/shark', this.spriteMaxes[STATE_CHOMPING], settings.colorMatrix, 0.5);

		this.boundingBox = this.c.collider.RECTANGLE;
	};

	exports.Shark.prototype = {
		id: 0,
		zindex: 1,
		size: {
			x: 90,
			y: 180
		},
		sprites: [null,null,null,null],
		spriteNumber: 0,
		draw: function(ctx) {
			for(var i = 0; i < this.sprites.length; i++) {
				if(!this.sprites[i].isReady()) return;
			}
			this.sprites[this.state].draw(ctx, this.center, this.size);
		},
		update: function(dt) {
			var data = this.c.sock.getSharkData(this.id);

			this.calculateState(data.depth);

			this.center.x += data.direction * this.speed.x * SHARK_SPEED_X * (dt/16.66);
			this.center.y -= data.state * this.speed.y * (dt/16.66);
		},
		calculateState: function(dd) {
			if(dd > 0.35) {
				this.state = STATE_LAG_SURFACE;
			} else if (dd < 0.25 && dd > -0.25 ) {
				if (this.state == STATE_LAG_SURFACE) {
					this.state = STATE_CHOMPING;
				} else {
					this.state = STATE_SWIM_SURFACE;
				}
			} else if (dd < -0.35){
				this.state = STATE_SWIM_DEEP;
			}
			if (this.state === undefined) {
				this.state = STATE_SWIM_SURFACE;
			}
		},
		collision: function(other, type) {
			if(other instanceof Surfer) {
				other.die();
			}
		}
	};

})(window);
