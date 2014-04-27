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
		this.depth = settings.depth || 0;
		this.state = settings.state || 0;

		initObject(this, settings);

		this.sprites[STATE_SWIM_SURFACE] = new SpriteSheet('./resource/shark_swim/shark', SPRITES_SWIM_SURFACE_MAX, settings.colorMatrix);
		this.sprites[STATE_SWIM_DEEP] = new SpriteSheet('./resource/shark_swim/shark', SPRITES_SWIM_DEEP_MAX, settings.colorMatrix);
		this.sprites[STATE_LAG_SURFACE] = new SpriteSheet('./resource/shark_bite/shark', SPRITES_LAG_SURFACE_MAX, settings.colorMatrix);
		this.sprites[STATE_CHOMPING] = new SpriteSheet('./resource/shark_bite/shark', SPRITES_CHOMPING_MAX, settings.colorMatrix);

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
			var sprite = this.sprites[this.state].getSprite(this.spriteNumber);
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

			this.center.x += data.direction * this.speed.x * SHARK_SPEED_X * (dt/16.66);
			this.center.y -= data.depth * this.speed.y * (dt/16.66);

			this.spriteNumber += 0.5;
			switch(this.depth){
				case 0:
					if(this.spriteNumber >= SPRITES_SURFACE_MAX) this.spriteNumber = 0;
					break;
				case 1:
					if(this.spriteNumber >= SPRITES_AIR_MAX) this.spriteNumber = 0;
					break;
				case -1:
					if(this.spriteNumber >= SPRITES_DEEP_MAX) this.spriteNumber = 0;
					break;
				default:
					console.log("shark draw error - bad depth");
			}
		},
		calculateDepth: function(dd) {
			if(dd > 0.35) {
				if (this.depth != 1) this.newDepthState();
				return 1;
			} else if (dd < 0.25 && dd > -0.25 ) {
				if (this.depth !== 0) this.newDepthState();
				return 0;
			} else if (dd < -0.35){
				if (this.depth != -1) this.newDepthState();
				return -1;
			}
		},
		newDepthState: function(){
			this.spriteNumber = 0;
		},
		collision: function(other, type) {
			if(other instanceof Surfer) {
				other.die();
			}
		}
	};

})(window);
