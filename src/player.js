module.exports = Player;

function Player(config) {
  this.type = "player";

  this.row = config.row;
  this.column = config.column;
}

Player.prototype.to_json = function(){
  return this;
};
