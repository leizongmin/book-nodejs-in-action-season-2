/**
 * 静态博客工具
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var swig = require('swig');
var rd = require('rd');
var fsExtra = require('fs-extra');
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt({
  html: true,
  langPrefix: 'code-',
});
var utils = exports;


utils.getSiteDir = function (dir) {
  return path.resolve(dir || '.');
};

utils.mkdir = function (dir) {
  console.log('mkdir: %s', dir);
  mkdirp.sync(dir);
};

utils.emptyDir = function (dir) {
  console.log('emptyDir: %s', dir);
  fsExtra.emptyDirSync(dir);
};

utils.readdir = function (dir) {
  return rd.readFileFilterSync(dir, /\.(md|markdown)/i);
};

utils.readFile = function (file) {
  console.log('read file: %s', file);
  return fs.readFileSync(file).toString();
};

utils.writeFile = function (file, data) {
  console.log('write file: %s', file);
  utils.mkdir(path.dirname(file));
  fs.writeFileSync(file, data);
};

utils.markdown = function (data) {
  return md.render(data);
};

utils.renderFile = function (file, data) {
  console.log('render file: %s', file);
  return swig.render(utils.readFile(file), {
    filename: file,
    autoescape: false,
    locals: data
  });
};

utils.parseSourceContent = function (data) {
  var split = '---\n';
  var i = data.indexOf(split);
  var info = {};
  if (i !== -1) {
    var j = data.indexOf(split, i + split.length);
    if (j !== -1) {
      var str = data.slice(i + split.length, j).trim();
      data = data.slice(j + split.length);
      str.split('\n').forEach(function (line) {
        var i = line.indexOf(':');
        if (i !== -1) {
          var name = line.slice(0, i).trim();
          var value = line.slice(i + 1).trim();
          info[name] = value;
        }
      });
    }
  }
  info.source = data;
  return info;
};

utils.basename = function (dir, filename) {
  var name = filename.slice(dir.length + 1);
  var i = 0 - path.extname(name).length;
  if (i === 0) i = name.length;
  return name.slice(0, i);
};
