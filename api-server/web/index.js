/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var url = require('url');
var express = require('express');
var bodyParser = require('body-parser');
var connect = require('connect');
var multipart = require('connect-multiparty');
var utils = require('lei-utils');


var app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));


// 检查用户是否已登录
function ensureLogin (req, res, next) {
  req.loginUserId = 'glen';
  next();
}

// 解析请求Body部分
var postBody = connect();
postBody.use(bodyParser.json());
postBody.use(bodyParser.urlencoded({extended: true}));
postBody.use(multipart());


app.get('/oauth/authorize', ensureLogin, function (req, res, next) {
  if (!req.query.client_id) return next('缺少参数 `client_id`');
  if (!req.query.redirect_url) return next('缺少参数 `redirect_url`');

  getClientInfoById(req.query.client_id, function (err, ret) {
    if (err) return next(err);

    res.locals.client = ret;
    res.locals.client_id = req.query.client_id;
    res.locals.redirect_url = req.query.redirect_url;
    res.locals.login_user = req.loginUserId;
    res.render('authorize');
  });
});

app.post('/oauth/authorize', ensureLogin, postBody, function (req, res, next) {
  if (!req.query.client_id) return next('缺少参数 `client_id`');
  if (!req.query.redirect_url) return next('缺少参数 `redirect_url`');

  generateGrantCode(req.query.client_id, req.loginUserId, function (err, ret) {
    if (err) return next(err);

    var info = url.parse(req.query.redirect_url, true);
    info.query.code = ret;
    var redirectUrl = url.format(info);

    res.redirect(redirectUrl);
  });
});


app.listen(3000);

//------------------------------------------------------------------------------
// 模拟查询数据库

// 获取App信息
function getClientInfoById (id, callback) {
  callback(null, {
    id: id,
    name: 'Node.js实战',
    description: '专注Node.js实战二十年'
  });
}

var grantCodes = [];

// 生成授权Code
function generateGrantCode (clientId, userId, callback) {
  var code = utils.randomString(20);
  grantCodes.push({
    clientId: clientId,
    userId: userId,
    code: code
  });
  callback(null, code);
}

