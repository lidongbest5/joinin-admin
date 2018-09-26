module.exports = function (app) {
  app.use('/api/v1/sessions', require('./sessions'));
  app.use('/api/v1/events', require('./events'));

  // 404 page
  app.use(function(req, res) {
    if (!res.headersSent) {
      res.status(404).render('404');
    }
  });
};
