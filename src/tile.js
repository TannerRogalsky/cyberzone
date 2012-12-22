module.exports = Tile;

function Tile(config) {
  this.type = "tile";

  this.player = false;
  this.item = false;
  this.hole = false;

  for (var option in config) { this[option] = config[option]; }
}

Tile.prototype.to_json = function(){
  var json = {};
  for (var key in this){
    if(type(this[key].to_json) === "function"){
      json[key] = this[key].to_json();
    } else {
      json[key] = this[key];
    }
  }
  return json;
};
