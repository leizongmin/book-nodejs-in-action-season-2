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
  
  utils.readdir(site.filePath('_posts')).forEach(function (name) {
    var content = site.renderPost(name);
    utils.writeFile(site.filePath('posts', utils.basename(name) + '.html'), content);
  });
 
};
