;(function(exports) {

	exports.Shadow = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		var image = new Image();
		image.onload = this.onImageLoad.bind(this);
		image.src = './resource/shadow/' + this.src;
		this.blitfrom = document.createElement("canvas");
		this.zindex = -1;
		this.center = {x: 0, y: 0};
	};

	exports.Shadow.prototype = {
		onImageLoad: function(evt) {
			var ctx = this.blitfrom.getContext("2d");
			ctx.imageSmoothingEnabled = false;
			this.blitfrom.height = this.size.y;
			this.blitfrom.width = this.size.x;
			ctx.drawImage(evt.target, 0, 0, evt.target.width, evt.target.height, 0, 0, this.size.x, this.size.y);
		},
		update: function(dt) {
			this.center.x = this.obj.center.x + this.size.x / 2;
			this.center.y = this.obj.center.y + this.yOffset;
		},
		draw: function(ctx) {
			if(this.size === undefined) return;
			ctx.drawImage(
				this.blitfrom,
				0,
				0,
				this.size.x,
				this.blitfrom.height,
				this.center.x - this.size.x / 2,
				this.center.y - this.size.y / 2,
				this.size.x,
				this.size.y
			);
		}
	};

})(window);
