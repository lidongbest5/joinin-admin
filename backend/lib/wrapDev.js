var tunnel = require('./ssh-tunnel');

var wrapDev = function(callback) {
  if (process.env.NODE_ENV === 'local') {
    tunnel(function(err, stream) {
      if (err) throw err;
      callback.call(this, {
        stream: stream,
        host: '127.0.0.1'
      });
    });
  } else {
    callback.call(this, {});
  }
}

module.exports = wrapDev;