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
    secret: 'xffcncgmveu6slxg',
    redirectUri: 'http://127.0.0.1:3000/example/auth/callback'
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
var dataAuthorizationCode = {};

// 生成授权Code
exports.generateAuthorizationCode = function (userId, clientId, redirectUri, callback) {
  var code = utils.randomString(20);
  dataAuthorizationCode[code] = {
    clientId: clientId,
    userId: userId
  };
  callback(null, code);
};

// 验证授权码是否正确
exports.verifyAuthorizationCode = function (code, clientId, clientSecret, redirectUri, callback) {
  var info = dataAuthorizationCode[code];
  if (!info) return callback(utils.invalidParameterError('code'));
  if (info.clientId !== clientId) return callback(utils.invalidParameterError('code'));

  database.getAppInfo(clientId, function (err, appInfo) {
    if (err) return callback(err);
    if (appInfo.secret !== clientSecret) return callback(utils.invalidParameterError('client_secret'));
    if (appInfo.redirectUri !== redirectUri) return callback(utils.invalidParameterError('redirect_uri'));

    callback(null, info.userId);
  });
};

// 删除授权Code
exports.deleteAuthorizationCode = function (code, callback) {
  delete dataAuthorizationCode[code];
  callback(null, code);
};


//------------------------------------------------------------------------------
var dataAccessToken = [];

// 生成access_token
exports.generateAccessToken = function (userId, clientId, callback) {
  var code = utils.randomString(20);
  dataAccessToken[code] = {
    clientId: clientId,
    userId: userId
  };
  callback(null, code);
};

// 查询access_token的信息
exports.getAccessTokenInfo = function (token, callback) {
  var info = dataAccessToken[token];
  if (!info) return callback(utils.invalidParameterError('token'));
  callback(null, info);
};

//------------------------------------------------------------------------------

var faker = require('faker');
// 设置语言为简体中文
faker.locale = 'zh_CN';

var dataArticles = [];
var ARTICLE_NUM = 100;

// 生成文章列表
for (var i = 0; i < ARTICLE_NUM; i++) {
  dataArticles.push({
    id: faker.random.uuid(),
    author: faker.name.findName(),
    title: faker.lorem.sentence(),
    createdAt: faker.date.past(),
    content: faker.lorem.paragraphs(10)
  });
}

// 查询文章列表的函数
exports.queryArticles = function (query, callback) {
  query.$skip = utils.defaultNumber(query.$skip, 0);
  query.$limit = utils.defaultNumber(query.$limit, 10);
  // 返回指定范围的文章数据
  callback(null, dataArticles.slice(query.$skip, query.$skip + query.$limit));
};
