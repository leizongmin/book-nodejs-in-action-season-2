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

  function mkdir (name) {
    utils.mkdir(path.resolve(dir, name));
  }

  mkdir(dir, '_layouts');
  mkdir(dir, '_posts');
  mkdir(dir, 'assets');
  mkdir(dir, 'posts');

};
