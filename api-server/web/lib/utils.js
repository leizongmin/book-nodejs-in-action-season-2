/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var utils = require('lei-utils');
var clone = require('clone');
var parseUrl = require('url').parse;
var formatUrl = require('url').format;

module.exports = exports = clone(utils);


exports.addQueryParamsToUrl = function (url, params) {
  var info = parseUrl(url, true);
  for (var i in params) {
    info.query[i] = params[i];
  }
  delete info.search;
  return formatUrl(info);
};
