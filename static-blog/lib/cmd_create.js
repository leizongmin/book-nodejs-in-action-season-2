/**
 * 静态博客工具
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var mkdirp = require('mkdirp');
var utils = require('./utils');

module.exports = function (dir) {

  dir = utils.getSiteDir(dir);
 
  utils.mkdir(dir, '_layouts');
  utils.mkdir(dir, '_posts');
  utils.mkdir(dir, 'assets');
  utils.mkdir(dir, 'posts');
  
};
