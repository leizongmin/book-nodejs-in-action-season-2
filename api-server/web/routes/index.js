/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

module.exports = function (app) {

  var middlewares = require('../lib/middlewares');
  var utils = require('../lib/utils');


  // OAuth2授权
  var authorize = require('./authorize');
  app.get('/OAuth2/authorize', middlewares.ensureLogin, authorize.checkAuthorizeParams, authorize.showAppInfo);
  app.post('/OAuth2/authorize', middlewares.ensureLogin, middlewares.postBody, authorize.checkAuthorizeParams, authorize.confirmApp);
  app.post('/OAuth2/access_token', middlewares.postBody, authorize.getAccessToken);

  // 模拟客户端获得授权码
  var client = require('./client');
  app.get('/example/auth', client.requestAuth);
  app.get('/example/auth/callback', client.authCallback);
  app.get('/example', client.example);

  // 提供的API列表 --------------------------------------------------------------
  var api = require('./api');

  // 生成请求限制key
  function generateHourRateLimiterKey (api) {
    return function (source) {
      return utils.md5(api + source) + ':' + utils.date('YmdH');
    };
  }

  app.get('/api/v1/articles.*',
    middlewares.verifyAccessToken,
    middlewares.generateRateLimiter(generateHourRateLimiterKey('/api/v1/articles'), 10000),
    api.getArticles);

  app.get('/api/v1/articles',
    middlewares.verifyAccessToken,
    middlewares.generateRateLimiter(generateHourRateLimiterKey('/api/v1/articles'), 10000),
    api.getArticles);

};
