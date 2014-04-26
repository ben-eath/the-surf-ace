;(function(exports) {

	var padToFour = function(int) {
		str = "" + int;
		while (str.length < 4) {
			str = "0" + str;
		}
		return str;
	};

	exports.SpriteSheet = function(src, numSprites) {
		this.numSprites = numSprites;
		for(var i = 1; i <= numSprites; i++) {
			var image = new Image();
			image.onload = this.onImageLoad.bind(this);
			image.src = src + padToFour(i) + ".png";
			this.spriteWidth = 0;
		}
		this.spritesLoaded = 0;
	};

	exports.SpriteSheet.prototype = {
		onImageLoad: function(evt){
			if (!this.blitfrom) {
				this.blitfrom = document.createElement("canvas");
				this.spriteWidth = evt.target.width;
				this.blitfrom.getContext("2d").imageSmoothingEnabled = false;
				this.blitfrom.height = evt.target.height;
				this.blitfrom.width = this.spriteWidth * this.numSprites;
			}
			this.blitfrom.getContext("2d").drawImage(evt.target, this.spritesLoaded * evt.target.width, 0);
			this.spritesLoaded += 1;
		},
		isReady: function() {
			return this.spritesLoaded == this.numSprites;
		},
		getSprite: function(spriteNumber) {
			return {
				source: this.blitfrom,
				pos : {
					x: this.spriteWidth * spriteNumber,
					y: 0
				},
				size: {
					x: this.spriteWidth,
					y: this.blitfrom.height
				}
			};
		}
	};

})(window);
