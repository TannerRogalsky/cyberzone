var Cyberzone = require('./src/cyberzone.js');

var irc = require('irc');
var client = new irc.Client('irc.mountai.net', 'admin', {
  channels: ['#gridhack'],
  userName: 'admin',
  realName: 'Administrator',
  stripColors: true,
  debug: true
});

client.addListener('message', function (from, to, message) {
  console.log(from + ' => ' + to + ': ' + message);

  var matches = message.match(/^!(\S+)(.*)/);
  var command = matches[1];
  var args = matches[2].trim().split(" ");

  if(typeof(commands[command]) === "function"){
    try{
      commands[command](from, to, args);
    }catch(err){
      console.log(err);
    }
  }
});

client.addListener('error', function(message) {
  console.log('error: ', message);
});

var commands = {};
commands.upload = function(from, to, args){
  console.log("test");
  var game = new Cyberzone();
};
