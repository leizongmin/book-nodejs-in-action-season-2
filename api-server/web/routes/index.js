/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (app) {

  var middlewares = require('../lib/middlewares');

  var authorize = require('./authorize');


  app.get('/oauth/authorize', middlewares.ensureLogin, authorize.showAppInfo);
  app.post('/oauth/authorize', middlewares.ensureLogin, middlewares.postBody, authorize.confirmApp);

};
