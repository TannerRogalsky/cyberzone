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
});

client.addListener('error', function(message) {
    console.log('error: ', message);
});
