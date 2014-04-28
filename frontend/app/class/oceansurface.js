;(function(exports) {

  exports.OceanSurface = function(game, settings) {
    this.c = game.c;
    initObject(this, settings);
  };

  exports.OceanSurface.prototype = {
    zindex: -30,
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
      ctx.fillStyle = "rgba(2,54,70,0.5)";
      ctx.fillRect(0, 0, this.size.x, this.size.y);
    },
    update: function(dt) {

    }
  };

})(window);
