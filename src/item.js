module.exports = Item;

function Item(config) {
  this.type = "item";

  this.row = config.row;
  this.column = config.column;
}

Item.prototype.to_json = function(){
  return this;
};
