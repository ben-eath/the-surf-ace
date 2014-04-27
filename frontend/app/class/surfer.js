;(function(exports) {

	var SPEED = 1;
	var SERPENTINE_AMOUNT = 1;
	var SPRITES_MAX = 39;

	exports.Surfer = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.boundingBox = this.c.collider.RECTANGLE;

		var whiteness = Math.random() * 0.4 + 0.2;
		var redness = Math.random() * 0.5 + 0.6;

		var suitcolor = [Math.random(), Math.random(), Math.random()];
		var boardcolor = [Math.random(), Math.random(), Math.random()];
		this.colorMatrix = [
			[redness,  boardcolor[0],  suitcolor[0]],
			[whiteness,  boardcolor[1],  suitcolor[1]],
			[whiteness,  boardcolor[2],  suitcolor[2]]
		];
		this.sprites = new SpriteSheet('./resource/surfer_' + (Math.random() < 0.5 ? 'female_':'') + 'swim/surfer', SPRITES_MAX, this.colorMatrix);
	};

	exports.Surfer.prototype = {
		center: {
			x: 100,
			y: 0
		},
		size: {
			x: 60,
			y: 120
		},
		color: 'yellow',
		serpentine: 0,
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
			this.center.y += SPEED;
			this.serpentine += 0.05;
			this.center.x += Math.sin(this.serpentine) * SERPENTINE_AMOUNT;

			if (this.center.y > 1000) { //PLACEHOLDER
				this.die();
			}

			this.spriteNumber += 1;
			if(this.spriteNumber >= SPRITES_MAX) this.spriteNumber = 0;
		},
		die: function(){
			this.c.entities.destroy(this);
			this.c.entities.create(Bloodstain, {
				center: this.center
			});
		}
	};

})(window);
