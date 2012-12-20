var Cyberzone = require('./src/cyberzone.js');

var irc = require('irc');
var irc_client = new irc.Client('irc.mountai.net', 'admin', {
  channels: ['#gridhack'],
  userName: 'admin',
  realName: 'Administrator',
  stripColors: true,
  debug: true
});

var redis = require('redis');
var redis_client = redis.createClient();
var redis_keyspace = "cyberzone:irc:";

irc_client.addListener('message', function (from, to, message) {
  console.log(from + ' => ' + to + ': ' + message);

  var matches = message.match(/^!(\S+)(.*)/);
  var command, args;
  if (matches) {
    command = matches[1];
    args = matches[2].trim().split(" ");
  }

  if(typeof(commands[command]) === "function"){
    try{
      commands[command](from, to, args);
    }catch(err){
      console.log(err);
    }
  }
});

irc_client.addListener('error', function(message) {
  console.log('error: ', message);
});

irc_client.addListener('ping', function(server) {
  redis_client.ping();
});

irc_client.addListener('names', function(channel, nicks) {
  console.log(nicks);
});

var commands = {};
commands.upload = function(from, to, args){
  redis_client.get(redis_keyspace + "recruiting_game", function(err, id){
    if (id === null) {
      id = new Date().getTime();
      redis_client.set(redis_keyspace + "recruiting_game", id);
      redis_client.sadd(redis_keyspace + "active_games", id);
    } else {
      irc_client.say('#gridhack', "recruiting already in progress");
    }
  });
};
