module.exports = Grid;

var Tile = require('./tile.js');
var Player = require('./player.js');
var Item = require('./item.js');

function Grid(config) {
  this.type = "grid";

  this.rows = config.rows;
  this.columns = config.columns;

  this.internal_grid = new Array(this.rows);
  for (var i = 0; i < this.internal_grid.length; i++) {
    this.internal_grid[i] = new Array(this.columns);
    for (var j = 0; j < this.internal_grid[i].length; j++) {
      if(config.grid && config.grid[i] && config.grid[j]){
        this.internal_grid[i][j] = new Tile(config.grid[i][j]);
      } else {
        var tile_config = {};
        tile_config.row = i;
        tile_config.column = j;
        this.internal_grid[i][j] = new Tile(tile_config);
      }
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
  for (var i = 0; i < this.internal_grid.length; i++) {
    for (var j = 0; j < this.internal_grid[i].length; j++) {
      callback.call(this.internal_grid[i][j], i, j);
    }
  }
};

Grid.prototype.to_json = function(){
  var json = {};

  json.rows = this.rows;
  json.columns = this.columns;

  json.grid = new Array(this.rows);
  for (var i = 0; i < this.rows; i++) {
    json.grid[i] = new Array(this.columns);
  }

  self.internal_grid.iterate(function(i, j){
    json.grid[i][j] = self.internal_grid.to_json();
  });
};
