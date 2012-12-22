module.exports = Cyberzone;

var Grid = require('./grid.js');

function Cyberzone(config) {
  this.type = "cyberzone";

  this.num_players =  config.players.length;
  this.columns =  2;
  this.rows =  2;

  for (var option in config) { this[option] = config[option]; }

  this.grid = new Grid(this.grid);
}

Cyberzone.prototype.to_json = function(){
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
