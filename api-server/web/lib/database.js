/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var utils = require('./utils');
var database = module.exports;


// 获取应用信息
exports.getAppInfo = function (id, callback) {
  callback(null, {
    id: id,
    name: 'Node.js实战',
    description: '专注Node.js实战二十年',
    secret: 'ooxxxxoo',
    redirectUri: 'http://127.0.0.1:3000/auth/callback'
  });
};


// 验证应用的回调URL是否合法
exports.verifyAppRedirectUri = function (clientId, url, callback) {
  database.getAppInfo(clientId, function (err, info) {
    if (err) return callback(err);
    if (!info) return callback(utils.invalidParameterError('client_id'));

    callback(null, info.redirectUri === url);
  });
};


//------------------------------------------------------------------------------
var authorizationCode = {};

// 生成授权Code
exports.generateAuthorizationCode = function (userId, clientId, redirectUri, callback) {
  var code = utils.randomString(20);
  authorizationCode[code] = {
    clientId: clientId,
    userId: userId
  };
  callback(null, code);
};

// 验证授权码是否正确
exports.verifyAuthorizationCode = function (code, clientId, clientSecret, redirectUri, callback) {
  var info = authorizationCode[code];
  if (!info) return callback(utils.invalidParameterError('code'));
  if (info.clientId !== clientId) return callback(utils.invalidParameterError('code'));

  database.getAppInfo(clientId, function (err, appInfo) {
    if (err) return callback(err);
    if (appInfo.secret !== clientSecret) return callback(utils.invalidParameterError('client_secret'));
    if (appInfo.redirectUri !== redirectUri) return callback(utils.invalidParameterError('redirect_uri'));

    callback(null, info.userId);
  });
};


//------------------------------------------------------------------------------
var accessToken = [];

// 生成access_token
exports.generateAccessToken = function (userId, clientId, callback) {
  var code = utils.randomString(20);
  accessToken[code] = {
    clientId: clientId,
    userId: userId
  };
  callback(null, code);
};

// 查询access_token的信息
utils.getAccessTokenInfo = function (token, callback) {
  var info = accessToken[token];
  if (!info) return callback(utils.invalidParameterError('token'));
  callback(null, info);
};
