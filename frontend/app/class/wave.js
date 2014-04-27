;(function(exports) {

	var SPEED = 1;

	exports.Wave = function(game, settings) {
		this.c = game.c;
		initObject(this, settings);
		if(!this.staticCreated[0]) {
			this.staticCreated[0] = true;
			var image = new Image();
			image.onload = this.onImageLoad.bind(this);
			image.src = "./resource/ocean/wave_crest_strip.png";
		}
	};

	exports.Wave.prototype = {
		zindex: -1,
		center: {
			x: 0,
			y: 0
		},
		size: {
			x: 800,
			y: 100
		},
		staticCreated: [false],
		//only one copy, height=0 is sentinel
		blitfrom: (function() { var b = document.createElement("canvas"); b.height = 0; return b; })(),
		onImageLoad: function(evt) {
			//leverage the prototype
			this.firstLoad = false;
			var ctx = this.blitfrom.getContext("2d");
			ctx.imageSmoothingEnabled = false;
			this.blitfrom.height = evt.target.height;
			this.blitfrom.width = this.size.x;
			for(var i = 0; i < this.blitfrom.width; i += evt.target.width){
				ctx.drawImage(evt.target, i * evt.target.width, 0);
			}
		},
		draw: function(ctx) {
			if(this.blitfrom === null) return;
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
		},
		update: function(dt) {
			this.center.y += this.speed * SPEED;
			if (this.center.y > this.maxY + this.size.y / 2) {
				this.center.y = -this.size.y / 2;
			}
		}
	};

})(window);
