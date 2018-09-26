var SSH2Client = require('ssh2').Client;
var config = require('config-lite')(__dirname);
var sshConf = config.ssh;

var tunnel = function (callback) {
  var ssh = new SSH2Client();
  ssh.on('ready', function() {
    ssh.forwardOut(
      '127.0.0.1',
      24000,
      '10.19.144.173',
      3306,
      callback
    );
  });
  ssh.connect(sshConf);
}

module.exports = tunnel;