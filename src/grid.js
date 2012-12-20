module.exports = Grid;

var Tile = require('./tile.js');
var Player = require('./player.js');
var Item = require('./item.js');

function Grid(rows, columns) {
  this.rows = rows;
  this.columns = columns;
  this._grid = new Array(rows);
  for (var i = 0; i < rows; i++) {
    this._grid[i] = new Array(columns);
    for (var j = 0; j < this._grid[i].length; j++) {
      this._grid[i][j] = new Tile(i, j);
    }
  }
}

Grid.prototype.populate_grid = function() {
  var self = this;
  self.iterate(function(){
    if (Math.random() > 0.5) {
      this.player = new Player(this.row, this.column);
    } else {
      this.item = new Item(this.row, this.column);
    }
  });
};

Grid.prototype.iterate = function(callback) {
  for (var i = 0; i < this._grid.length; i++) {
    for (var j = 0; j < this._grid[i].length; j++) {
      callback.call(this._grid[i][j]);
    }
  }
};
