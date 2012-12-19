module.exports = Cyberzone;

var Grid = require('./src/grid.js');

function Cyberzone(options) {
  var self = this;
  self.options = {
    num_players: 2
  };
  for (var option in options) { self.options[option] = options[option]; }

  this.grid = new Grid(10, 10);
  this.grid.populate_grid();
}
