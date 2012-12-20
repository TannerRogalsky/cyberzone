module.exports = Tile;

function Tile(row, column) {
  this.player = false;
  this.item = false;
  this.hole = false;

  this.row = row;
  this.column = column;
}
