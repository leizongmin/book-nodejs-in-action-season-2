/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (app) {

  var middlewares = require('../lib/middlewares');

  var authorize = require('./authorize');


  app.get('/OAuth2/authorize', middlewares.ensureLogin, authorize.checkAuthorizeParams, authorize.showAppInfo);
  app.post('/OAuth2/authorize', middlewares.ensureLogin, middlewares.postBody, authorize.checkAuthorizeParams, authorize.confirmApp);
  app.post('/OAuth2/access_token', middlewares.postBody, authorize.getAccessToken);

};
