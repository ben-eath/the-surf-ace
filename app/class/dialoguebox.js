;(function(exports) {

	var DIALOGUE_APPEAR_SPEED = 13;
	var DIALOGUE_PADDING = 20;
	var PADDING_LEFT = 200;

	exports.DialogueBox = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		if(settings.dialoguePortrait === undefined) {
			this.dialoguePortrait = new SpriteSheet('./resource/ben_eath_portrait/ben_eath', 2, COLOR_MATRIX_IDENTITY, 0.07);
		}
		this.initialY = settings.center.y;
	};

	exports.DialogueBox.prototype = {
		percentVisible: 0,
		dialogueUp: true,
		dialogueVisiblePercent: 0,
		color: {
			r: 0,
			g: 128,
			b: 255,
			a: 0
		},
		zindex: 100,
		update: function(dt) {
			if (this.dialogueUp === true && this.center.y > this.finalY) {
				this.center.y -= DIALOGUE_APPEAR_SPEED;
			} else if (this.dialogueUp === false && this.center.y < this.initialY) {
				this.center.y += DIALOGUE_APPEAR_SPEED;
			}
			if (this.center.y > this.initialY) {
				this.center.y = this.initialY;
			}
			if (this.center.y < this.finalY) {
				this.center.y = this.finalY;
			}
		},
		draw: function(ctx) {
			var textX = this.size.y + DIALOGUE_PADDING;
			var textY = (this.center.y) + DIALOGUE_PADDING;
			var textW = this.size.x - this.size.y - DIALOGUE_PADDING;
			ctx.fillStyle = 'rgba(0,0,0,0.35)';
			ctx.fillRect(this.center.x - this.size.x / 2, this.center.y, this.size.x , this.size.y);
			ctx.font = '30pt VT323';
			ctx.textAlign = 'left';
			ctx.fillStyle = 'black';
			wrapText(ctx, "\n" + this.text, textX, textY+3, textW, 38);
			ctx.fillStyle = 'white';
			wrapText(ctx, "\n" +this.text, textX, textY, textW, 38);
			this.dialoguePortrait.draw(ctx,
				{
					x: this.size.y / 2 + DIALOGUE_PADDING,
					y: this.center.y + this.size.y / 2
				},
				{
					x: this.size.y - (DIALOGUE_PADDING * 2),
					y: this.size.y - (DIALOGUE_PADDING * 2)
				}
			);
		}
	};



})(window);
