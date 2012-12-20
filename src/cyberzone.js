module.exports = Cyberzone;

var Grid = require('./grid.js');

function Cyberzone(options) {
  this.options = {
    num_players: 1,
    columns: 2,
    rows: 2
  };
  for (var option in options) { this.options[option] = options[option]; }

  this.grid = new Grid(this.options.rows, this.options.columns);
  this.grid.populate_grid();
}
