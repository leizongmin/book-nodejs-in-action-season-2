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

  function makeDir (name) {
    utils.makeDir(path.resolve(dir, name));
  }

  makeDir('_layouts');
  makeDir('_posts');
  makeDir('assets');
  makeDir('posts');

  utils.copyDir(path.resolve(__dirname, 'tpl'), dir);

};
