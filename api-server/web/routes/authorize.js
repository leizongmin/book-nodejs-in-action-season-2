/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var middlewares = require('../lib/middlewares');
var database = require('../lib/database');
var utils = require('../lib/utils');


// 显示确认界面
exports.showAppInfo = function (req, res, next) {
  if (!req.query.client_id) return next('缺少参数 `client_id`');
  if (!req.query.redirect_url) return next('缺少参数 `redirect_url`');

  database.getClientInfoById(req.query.client_id, function (err, ret) {
    if (err) return next(err);

    res.locals.client = ret;
    res.locals.client_id = req.query.client_id;
    res.locals.redirect_url = req.query.redirect_url;
    res.locals.login_user = req.loginUserId;
    res.render('authorize');
  });
};

// 确认授权
exports.confirmApp = function (req, res, next) {
  if (!req.query.client_id) return next('缺少参数 `client_id`');
  if (!req.query.redirect_url) return next('缺少参数 `redirect_url`');

  database.generateGrantCode(req.query.client_id, req.loginUserId, function (err, ret) {
    if (err) return next(err);

    res.redirect(utils.addQueryParamsToUrl(req.query.redirect_url, {code: ret}));
  });
};

