/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var APICleint = require('../../../api-client');


var client = new APICleint({
  appKey: 'a10086',
  appSecret: 'xffcncgmveu6slxg',
  callbackUrl: 'http://127.0.0.1:3000/auth/callback'
});


exports.requestAuth = function (req, res, next) {
  res.redirect(client.getRedirectUrl());
};

exports.authCallback = function (req, res, next) {
  client.requestAccessToken(req.query.code, function (err, ret) {
    if (err) return res.json(err);

    // 显示授权成功页面
    res.end('获取授权成功，授权码是：' + ret.access_token);
  });
};
