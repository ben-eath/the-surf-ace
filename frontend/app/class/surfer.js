;(function(exports) {

	var SPEED = 1;
	var SERPENTINE_AMOUNT = 1;
	var SPRITES_MAX = 39;

	exports.Surfer = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.boundingBox = this.c.collider.RECTANGLE;

		var whiteness = Math.random() * 0.4 + 0.2;
		var redness = Math.random() * 0.2 + 0.7;
		if(whiteness < 0.4) redness -= 0.2;
		else if(redness > 0.8) whiteness -= 0.2;

		var suitcolor = [Math.random(), Math.random(), Math.random()];
		var boardcolor = [Math.random(), Math.random(), Math.random()];
		this.colorMatrix = [
			[redness,  boardcolor[0],  suitcolor[0]],
			[whiteness,  boardcolor[1],  suitcolor[1]],
			[whiteness,  boardcolor[2],  suitcolor[2]]
		];
		this.serpentineSpeed = Math.random() * 0.1 + 0.01;
		switch(Math.random() * 3) {

		}
		var whichSprite = "stand";
		if(Math.random() < 0.3) {
			whichSprite = (Math.random() < 0.5 ? 'female_swim':'male_swim');
		}
		this.sprites = new SpriteSheet('./resource/surfer_' + whichSprite + '/surfer', SPRITES_MAX, this.colorMatrix);

		this.shadow = this.c.entities.create(Shadow, {
			obj: this,
			src: 'surfboard.png',
			size: {
				x: this.size.x * 1.5,
				y: this.size.y * 2.2
			},
			yOffset: 73
		});
		this.zindex = Math.random();
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
			this.sprites.draw(ctx, this.center, this.size);
		},
		update: function(dt) {
			this.center.y += SPEED;
			this.serpentine += this.serpentineSpeed;
			this.center.x += Math.sin(this.serpentine) * SERPENTINE_AMOUNT;

			if (this.center.y > 1000) { //PLACEHOLDER
				this.die(false);
			}
		},
		die: function(showblood){
			this.c.entities.destroy(this.shadow);
			this.c.entities.destroy(this);
			if(showblood) {
				this.c.entities.create(Bloodstain, {
					center: this.center
				});
			}
		}
	};

})(window);
