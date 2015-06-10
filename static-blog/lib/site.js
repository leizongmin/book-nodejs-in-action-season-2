/**
 * 静态博客工具
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var site = exports;

site.filePath = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(utils.getSiteDir(site.dir));
  return path.resolve.apply(path, args);
};

site.getConfig = function () {
  return JSON.parse(utils.readFile(site.filePath('config.json')));
};

site.getPosts = function () {
  return utils.readDir(site.filePath('_posts')).map(function (name) {
    return site.getPost(name);
  }).sort(function (a, b) {
    return b.timestamp - a.timestamp;
  });
};

site.resolvePostSourcePath = function (name) {
  var suffix = ['', '.md', '.markdown'];
  for (var i = 0; i < suffix.length; i++) {
    var s = suffix[i];
    var f = site.filePath('_posts', name + s);
    if (fs.existsSync(f)) return f;
  }
};

site.getPost = function (name) {
  var sourcePath = site.resolvePostSourcePath(name);
  var post = utils.parseSourceContent(utils.readFile(sourcePath));
  post.timestamp = new Date(post.date).getTime();
  post.content = utils.markdown(post.source);
  post.filename = utils.basename(site.filePath('_posts'), name) + '.html';
  post.url = '/posts/' + post.filename;
  post.localPath = site.filePath('posts', post.filename);
  post.sourcePath = sourcePath;
  post.render = function () {
    var data = {
      config: site.getConfig(),
      post: post
    };
    var layout = (data.post.layout || 'post') + '.html';
    return utils.renderFile(site.filePath('_layouts', layout), data);
  };
  return post;
};

site.renderIndex = function () {
  var data = {
    config: site.getConfig(),
    posts: site.getPosts()
  };
  var layout = 'index.html';
  return utils.renderFile(site.filePath('_layouts', layout), data);
};
