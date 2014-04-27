;(function(exports) {

	var padToFour = function(int) {
		str = "" + int;
		while (str.length < 4) {
			str = "0" + str;
		}
		return str;
	};

	exports.SpriteSheet = function(src, numSprites, colorMatrix, spriteSpeed) {
		this.numSprites = numSprites;
		if(colorMatrix !== undefined) {
			this.colorMatrix = colorMatrix;
		}
		this.spriteSpeed = spriteSpeed || 1;
		for(var i = 1; i <= numSprites; i++) {
			var image = new Image();
			image.onload = this.onImageLoad.bind(this);
			image.src = src + padToFour(i) + ".png";
			this.spriteWidth = 0;
		}
		this.spritesLoaded = 0;
		this.spriteNumber = 0;
	};

	exports.SpriteSheet.prototype = {
		colorMatrix: [
			[1,0,0],
			[0,1,0],
			[0,0,1]
		],
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
			if(this.spritesLoaded == this.numSprites) {
				this.colorMap();
			}
		},
		isReady: function() {
			return this.spritesLoaded == this.numSprites;
		},
		colorMap: function() {
			if(this.colorMatrix == [[1,0,0],[0,1,0],[0,0,1]]) return;
			var ctx = this.blitfrom.getContext("2d");

			var imageData = ctx.getImageData(0, 0, this.blitfrom.width, this.blitfrom.height);

			var a,b,c;
			for (i = 0; i < imageData.data.length; i += 4){
				a = imageData.data[i] * this.colorMatrix[0][0] + imageData.data[i + 1] * this.colorMatrix[0][1] + imageData.data[i + 2] * this.colorMatrix[0][2];
				b = imageData.data[i] * this.colorMatrix[1][0] + imageData.data[i + 1] * this.colorMatrix[1][1] + imageData.data[i + 2] * this.colorMatrix[1][2];
				c = imageData.data[i] * this.colorMatrix[2][0] + imageData.data[i + 1] * this.colorMatrix[2][1] + imageData.data[i + 2] * this.colorMatrix[2][2];
				imageData.data[i] = a;
				imageData.data[i + 1] = b;
				imageData.data[i + 2] = c;
			}

			ctx.putImageData(imageData,0,0);
		},
		draw: function(ctx, center, size) {
			ctx.drawImage(
				this.blitfrom,
				this.spriteWidth * (this.spriteNumber | 0),
				0,
				this.spriteWidth,
				this.blitfrom.height,
				center.x - size.x / 2,
				center.y - size.y / 2,
				size.x,
				size.y
			);
			this.spriteNumber += this.spriteSpeed;
			if(this.spriteNumber >= this.numSprites) this.spriteNumber = 0;
		}
		// getSprite: function() {
		// 	var sprite = {
		// 		source: this.blitfrom,
		// 		pos : {
		// 			x: this.spriteWidth * (this.spriteNumber | 0),
		// 			y: 0
		// 		},
		// 		size: {
		// 			x: this.spriteWidth,
		// 			y: this.blitfrom.height
		// 		}
		// 	};
		// 	return sprite;
		// }
	};

})(window);

