module.exports = Grid;

var Tile = require('./tile.js');
var Player = require('./player.js');
var Item = require('./item.js');

function Grid(config) {
  this.rows = config.rows;
  this.columns = config.columns;
  this._grid = new Array(this.rows);
  for (var i = 0; i < this._grid.length; i++) {
    this._grid[i] = new Array(this.columns);
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
      callback.call(this._grid[i][j], i, j);
    }
  }
};

Grid.prototype.to_json = function(){
  var json = new Array(this.rows);
  for (var i = 0; i < this.rows; i++) {
    this._grid[i] = new Array(this.columns);
  }

  self._grid.iterate(function(i, j){
    json[i][j] = self._grid.to_json();
  });
};
