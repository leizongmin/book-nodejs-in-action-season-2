---
title: 测试一下
date: 2015-05-30
---

代码1：

```javascript
console.log('hello, world');
```

代码2：

```javascript
/**
 * 静态博客工具
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var express = require('express');
var serveStatic = require('serve-static');
var utils = require('./utils');
var site = require('./site');

module.exports = function (dir) {

  site.dir = utils.getSiteDir(dir);

  var sourceDir = site.filePath('_posts');
  var targetDir = site.filePath('posts');

  // 初始化express
  var app = express();
  var router = express.Router();
  app.use('/assets', serveStatic(site.filePath('assets')));
  app.use(router);

  // 渲染文章
  router.get('/posts/*', function (req, res, next) {
    var name = utils.stripExtname(req.params[0]);
    res.end(site.getPost(name).render());
  });

  // 渲染列表
  router.get('/', function (req, res, next) {
    res.end(site.renderIndex());
  });

  // 监听端口
  var port = site.getConfig().port || 3000;
  app.listen(port);
  var url = 'http://127.0.0.1:' + port;
  console.log('请打开 %s', url);
  utils.open(url);

};
```
