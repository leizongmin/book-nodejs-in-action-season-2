var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var open = require('open');
var utils = require('./utils');

module.exports = function (dir) {
  dir = dir || '.';

  // 初始化express
  var app = express();
  var router = express.Router();
  app.use('/assets', serveStatic(path.resolve(dir, 'assets')));
  app.use(router);

  // 渲染文章
  router.get('/posts/*', function (req, res, next) {
    var name = utils.stripExtname(req.params[0]);
    var file = path.resolve(dir, '_posts', name + '.md');
    var html = utils.renderPost(dir, file);
    res.end(html);
  });

  // 渲染列表
  router.get('/', function (req, res, next) {
    var html = utils.renderIndex(dir);
    res.end(html);
  });

  var config = utils.loadConfig(dir);
  var port = config.port || 3000;
  var url = 'http://127.0.0.1:' + port;
  app.listen(port);
  open(url);

};
