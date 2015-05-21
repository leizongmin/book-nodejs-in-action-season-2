/**
 * 静态博客工具
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
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
  var posts = utils.readdir(site.filePath('_posts'));
  return posts.map(function (name) {
    return site.getPost(name);
  });
};

site.getPost = function (name) {
  var ret = utils.parseSourceContent(utils.readFile(site.filePath('_posts', name)));
  ret.info.content = utils.markdown(ret.content);
  return ret.info;
};

site.renderPost = function (name) {
  var data = {
    config: site.getConfig(),
    posts: site.getPosts(),
    post: site.getPost(name)
  };
  var layout = (data.post.layout || 'post') + '.html';
  return utils.renderFile(site.filePath('_layouts', layout), data);
};
