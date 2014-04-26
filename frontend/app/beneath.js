;(function(exports) {
	var Game = function() {
		var width = $(window).width();
		var height = $(window).height();
		this.c = new Coquette(this, "canvas", width, height, "#000");
		this.c.sock = new Sock();

		this.c.entities.create(Ocean, {size: { x:width, y:height }});
		this.c.entities.create(Shark, {});
		this.c.entities.create(Surfer, {});
	};

	window.addEventListener('load', function() {
		new Game();
	});
})();
