module.exports = Cyberzone;

var Grid = require('./grid.js');

function Cyberzone(config) {
  this.num_players =  config.players.length;
  this.columns =  2;
  this.rows =  2;

  for (var option in config) { this[option] = config[option]; }

  this.grid = new Grid(this.grid);
}

Cyberzone.prototype.to_json = function(){
  return {};
};
