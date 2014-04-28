;(function(exports) {

	exports.Ocean = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		this.spriteSheet = new SpriteSheet('./resource/ocean/maya/untitled.', 45, undefined, 0.5, '.jpg');
	};

	exports.Ocean.prototype = {
		zindex: -100,
		center: {
			x: 0,
			y: 0
		},
		size: {
			x: 800,
			y: 600
		},
		time: 0,
		draw: function(ctx) {
			this.spriteSheet.draw(ctx, this.center, this.size);
		},
		update: function(dt) {

		}
	};

})(window);
