;(function(exports) {

	var padToFour = function(int) {
		str = "" + int;
		while (str.length < 4) {
			str = "0" + str;
		}
		return str;
	};

	exports.SpriteSheet = function(src, numSprites, colorMatrix, spriteSpeed, extension) {
		this.numSprites = numSprites;
		if(colorMatrix !== undefined) {
			this.colorMatrix = colorMatrix;
		}
		this.spriteSpeed = spriteSpeed || 1;
		if(this.imageCache[src.substring(0,25)] === undefined) {
			for(var i = 1; i <= numSprites; i++) {
				var image = new Image();
				image.onload = this.onImageLoad.bind(this, i);
				image.src = src + padToFour(i) + (extension === undefined ? ".png" : extension);
				this.spriteWidth = 0;
			}
			this.spritesLoaded = 0;
		} else {
			this.cachedLoad(src.substring(0,25));
			this.spritesLoaded = this.numSprites;
			this.spriteWidth = this.blitfrom.width / this.numSprites;
		}
		this.spriteNumber = 0;
	};

	exports.SpriteSheet.prototype = {
		colorMatrix: [
			[1,0,0],
			[0,1,0],
			[0,0,1]
		],
		imageCache: {},
		cachedLoad: function(src) {
			this.blitfrom = document.createElement("canvas");
			this.blitfrom.width = this.imageCache[src].width;
			this.blitfrom.height = this.imageCache[src].height;
			this.blitfrom.getContext("2d").drawImage(
				this.imageCache[src],
				0,
				0,
				this.blitfrom.width,
				this.blitfrom.height
			);
			this.colorMap();
		},
		onImageLoad: function(spriteNum, evt){
			if (!this.blitfrom) {
				this.blitfrom = document.createElement("canvas");
				this.spriteWidth = evt.target.width;
				this.blitfrom.getContext("2d").imageSmoothingEnabled = false;
				this.blitfrom.getContext("2d").webkitImageSmoothingEnabled=false;
				this.blitfrom.height = evt.target.height;
				this.blitfrom.width = this.spriteWidth * this.numSprites;
			}
			this.blitfrom.getContext("2d").drawImage(evt.target, (spriteNum-1) * evt.target.width, 0);
			this.spritesLoaded += 1;
			if(this.spritesLoaded == this.numSprites) {
				var src = $(evt.target).attr('src').substring(0,25);
				this.imageCache[src] = this.blitfrom;
				this.cachedLoad(src);
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
			if(this.blitfrom === undefined) return;
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
	};

})(window);

