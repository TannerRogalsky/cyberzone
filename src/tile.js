module.exports = Tile;

function Tile() {
  this.contents = [];
}

Tile.prototype.push = function(item) {
  this.contents.push(item);
};
