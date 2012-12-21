var Cyberzone = require('./src/cyberzone.js');

var main_channel = '#gridhack';

var irc = require('irc');
var irc_client = new irc.Client('irc.mountai.net', 'admin', {
  channels: [main_channel],
  userName: 'admin',
  realName: 'Administrator',
  stripColors: true,
  debug: true
});
irc_client.invite = function(channel, nick){
  irc_client.send("INVITE", nick, channel);
};

var redis = require('redis');
var redis_client = redis.createClient();

var redis_keyspace = "cyberzone:irc:";
var recruiting_game_keyspace = redis_keyspace + "recruiting_game";
var players_keyspace = recruiting_game_keyspace + ":players";
var active_games_keyspace = redis_keyspace + "active_games";

var timers = require('timers');

irc_client.addListener('motd', function(message){
  redis_client.smembers(active_games_keyspace, function(err, members){
    for (var i = 0; i < members.length; i++) {
      var id = members[i];
      irc_client.join(id);
      irc_client.addListener('message' + id, game_channel_listener);
    }
  });
});

irc_client.addListener('message' + main_channel, function (from, to, text) {
  console.log(from + ' => ' + to + ': ' + text);

  run_command(from, to, text, main_commands);
});

irc_client.addListener('error', function(message) {
  // console.log('error: ', message);
});

irc_client.addListener('ping', function(server) {
  redis_client.ping();
});

irc_client.addListener('names', function(channel, nicks) {
  // console.log(nicks);
});

var game_channel_listener = function (from, to, text) {
  console.log(from + ' => ' + to + ': ' + text);

  run_command(from, to, text, game_commands);
};

var main_commands = {};
var game_commands = {};

main_commands.upload = function(from, to, args){
  redis_client.get(recruiting_game_keyspace, function(err, id){
    if (id === null) {
      id = "#" + new Date().getTime();
      redis_client.set(recruiting_game_keyspace, id);
      redis_client.sadd(active_games_keyspace, id);

      irc_client.join(id, function(){
        // irc_client.send("MODE", id, "+i");
        irc_client.say(main_channel, "uploading...");
        main_commands.jack(from, to, args);

        // kills the active game if it's taking too long to set up
        // timers.setTimeout(function(){
        //   main_commands.cancel();
        // }, 10 * 1000);

        irc_client.addListener('message' + id, game_channel_listener);
      });
    } else {
      irc_client.say(main_channel, "already uploading");
    }
  });
};

main_commands.cancel = function(from, to, args){
  redis_client.get(recruiting_game_keyspace, function(err, id){
    if (id === null) {
      irc_client.say(main_channel, "no upload to cancel");
    } else {
      redis_client.del(recruiting_game_keyspace);
      redis_client.del(players_keyspace);
      redis_client.srem(active_games_keyspace, id);

      irc_client.part(id);
      irc_client.say(main_channel, "cancelled upload");
    }
  });
};

main_commands.jack = function(from, to, args){
  redis_client.get(recruiting_game_keyspace, function(err, id){
    if (id === null) {
      irc_client.say(main_channel, "there is no game currently uploading");
    } else {
      redis_client.sismember(players_keyspace, from, function(err, is_member){
        if(is_member){
          irc_client.invite(id, from);
          irc_client.say(main_channel, "you're already part of the matrix");
        } else {
          redis_client.sadd(players_keyspace, from);
          irc_client.invite(id, from);
          irc_client.say(main_channel, "jacking " + from + " into the matrix");
        }
      });
    }
  });
};

main_commands.list = function(from, to, args){
  redis_client.smembers(active_games_keyspace, function(err, members){
    if(members.length > 0){
      irc_client.say(main_channel, "active hacks: " + members.join(", "));
    }

    redis_client.get(recruiting_game_keyspace, function(err, id){
      if (id) {
        irc_client.say(main_channel, "recruiting hack: " + id);
      }
    });
  });
};

game_commands.bootstrap = function(from, to, args){
  redis_client.get(recruiting_game_keyspace, function(err, id){
    if (id === null) {
      irc_client.say(main_channel, "there is no game currently uploading");
    } else if (id === to) {
      irc_client.say(id, "game actuating... please wait...");
      irc_client.say(main_channel, "a memory location is now locked. you may now start a new hack.");
      redis_client.del(recruiting_game_keyspace);
      redis_client.del(players_keyspace);
    } else {
      irc_client.say(main_channel, "you can only start the game from the inside");
    }
  });
};
main_commands.bootstrap = game_commands.bootstrap;

game_commands.exit = function(from, to, args){
  redis_client.srem(active_games_keyspace, to);
  irc_client.part(to);
};


function run_command(from, to, text, command_list) {
  var matches = text.match(/^!(\S+)(.*)/);
  var command, args;
  if (matches) {
    command = matches[1];
    args = matches[2].trim().split(" ");
  }

  if(typeof(command_list[command]) === "function"){
    try{
      command_list[command](from, to, args);
    }catch(err){
      console.log(err);
    }
  }
}
