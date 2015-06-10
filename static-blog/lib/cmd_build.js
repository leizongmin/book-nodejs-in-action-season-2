/**
 * 静态博客工具
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var mkdirp = require('mkdirp');
var utils = require('./utils');
var site = require('./site');

module.exports = function (dir, options) {

  site.dir = utils.getSiteDir(dir);

  var sourceDir = site.filePath('_posts');
  var targetDir = site.filePath('posts');
  utils.emptyDir(targetDir);

  // 渲染文章
  utils.readdir(sourceDir).forEach(function (name) {
    var post = site.getPost(name);
    utils.writeFile(post.localPath, post.render());
  });

  // 渲染列表
  utils.writeFile(site.filePath('index.html'), site.renderIndex());

};
