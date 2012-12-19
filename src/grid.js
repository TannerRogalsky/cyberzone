module.exports = Grid;

var Tile = require('./tile.js');

function Grid(rows, columns) {
  this.rows = rows;
  this.columns = columns;
  this._grid = new Array(rows);
  for (var i = 0; i < rows; i++) {
    this._grid[i] = new Array(columns);
    for (var j = 0; j < this._grid[i].length; j++) {
      this._grid[i][j] = new Tile();
    }
  }
}

Grid.prototype.populate_grid = function() {
  this.iterate(function(){
    this.push(0);
  });
};

Grid.prototype.iterate = function(callback) {
  for (var i = 0; i < this._grid.length; i++) {
    for (var j = 0; j < this._grid[i].length; j++) {
      callback.call(this._grid[i][j]);
    }
  }
};
