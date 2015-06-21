/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var APICleint = require('../../../api-client');


var client = new APICleint({
  appKey: 'a10086',
  appSecret: 'xffcncgmveu6slxg',
  callbackUrl: 'http://127.0.0.1:3000/example/auth/callback'
});


exports.requestAuth = function (req, res, next) {
  res.redirect(client.getRedirectUrl());
};

exports.authCallback = function (req, res, next) {
  client.requestAccessToken(req.query.code, function (err, ret) {
    if (err) return res.send(err.toString());

    // 显示授权成功页面
    console.log(ret);
    res.redirect('/example');
  });
};

exports.example = function (req, res, next) {
  // 如果未获取授权码，则先跳转到授权页面
  if (!client._accessToken) return res.redirect('/example/auth');

  // 请求获取文章列表
  client.getArticles(req.query, function (err, ret) {
    if (err) return res.send(err.toString());
    res.send({
      accessToken: client._accessToken,
      result: ret
    });
  });
};
