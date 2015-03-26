/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var middlewares = require('../lib/middlewares');
var database = require('../lib/database');
var utils = require('../lib/utils');


// 检查参数
exports.checkAuthorizeParams = function (req, res, next) {
  // 检查参数
  if (!req.query.client_id) {
    return next(utils.missingParameterError('client_id'));
  }
  if (!req.query.redirect_uri) {
    return next(utils.missingParameterError('redirect_uri'));
  }

  // 验证client_id是否正确，并查询应用的详细信息
  database.getAppInfo(req.query.client_id, function (err, ret) {
    if (err) return next(err);

    req.appInfo = ret;

    // 验证redirect_uri是否符合该应用设置的回调地址规则
    database.verifyAppRedirectUri(req.query.client_id, req.query.redirect_uri, function (err, ok) {
      if (err) return next(err);
      if (!ok) {
        return next(utils.redirectUriNotMatchError(req.query.redirect_uri));
      }

      next();
    });
  });
};

// 显示确认界面
exports.showAppInfo = function (req, res, next) {
  res.locals.loginUserId = req.loginUserId;
  res.locals.appInfo = req.appInfo;
  res.render('authorize');
};

// 确认授权
exports.confirmApp = function (req, res, next) {
  // 生成authorization_code
  database.generateAuthorizationCode(req.loginUserId, req.query.client_id, req.query.redirect_uri, function (err, ret) {
    if (err) return next(err);

    // 跳转回来源应用
    res.redirect(utils.addQueryParamsToUrl(req.query.redirect_uri, {
      code: ret
    }));
  });
};

// 获取access_token
exports.getAccessToken = function (req, res, next) {
  // 检查参数
  var client_id = req.body.client_id || req.query.client_id;
  var client_secret = req.body.client_secret || req.query.client_secret;
  var redirect_uri = req.body.redirect_uri || req.query.redirect_uri;
  var code = req.body.code || req.query.code;
  if (!client_id) return next(utils.missingParameterError('client_id'));
  if (!client_secret) return next(utils.missingParameterError('client_secret'));
  if (!redirect_uri) return next(utils.missingParameterError('redirect_uri'));
  if (!code) return next(utils.missingParameterError('code'));

  // 验证authorization_code
  database.verifyAuthorizationCode(code, client_id, client_secret, redirect_uri, function (err, userId) {
    if (err) return next(err);

    // 生成access_token
    database.generateAccessToken(userId, client_id, function (err, accessToken) {
      if (err) return next(err);

      // 生成access_token后需要删除旧的authorization_code
      database.deleteAuthorizationCode(code, function (err) {
        if (err) console.error(err);
      });

      res.apiSuccess({
        access_token: accessToken,
        expires_in: 3600 * 24  // access_token的有效期为1天
      });
    });
  });
};
