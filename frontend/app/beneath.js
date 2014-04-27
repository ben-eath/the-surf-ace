;(function(exports) {
	var Game = function() {
		var width = $(window).width();
		var height = $(window).height();
		this.c = new Coquette(this, "canvas", width, height, "#000");
		this.c.sock = new Sock();

		this.c.renderer._ctx.imageSmoothingEnabled = false;

		this.c.entities.create(Ocean, {size: { x:width, y:height }});
		this.c.entities.create(Surfer, {});

		this.c.entities.create(Control, {center: {x:width/2, y:height/2}});
	};

	window.addEventListener('load', function() {
		game = new Game();
	});
})();
