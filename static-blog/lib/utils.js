var path = require('path');
var fs = require('fs');
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt({
  html: true,
  langPrefix: 'code-',
});
var swig = require('swig');
swig.setDefaults({cache: false});
var rd = require('rd');


// 去掉文件名中的扩展名
function stripExtname (name) {
  var i = 0 - path.extname(name).length;
  if (i === 0) i = name.length;
  return name.slice(0, i);
}

// 将Markdown转换为HTML
function markdownToHTML (content) {
  return md.render(content || '');
}

// 解析文章内容
function parseSourceContent (data) {
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
}

// 渲染模板
function renderFile (file, data) {
  return swig.render(fs.readFileSync(file).toString(), {
    filename: file,
    autoescape: false,
    locals: data
  });
}

// 遍历所有文章
function eachSourceFile (sourceDir, callback) {
  rd.eachFileFilterSync(sourceDir, /\.md$/, callback);
}

// 渲染文章
function renderPost (dir, file) {
  var content = fs.readFileSync(file).toString();
  var post = parseSourceContent(content.toString());
  post.content = markdownToHTML(post.source);
  post.layout = post.layout || 'post';
  var config = loadConfig(dir);
  var layout = path.resolve(dir, '_layout', post.layout + '.html');
  var html = renderFile(layout, {
    config: config,
    post: post
  });
  return html;
}

// 渲染文章列表
function renderIndex (dir) {
  var list = [];
  var sourceDir = path.resolve(dir, '_posts');
  eachSourceFile(sourceDir, function (f, s) {
    var source = fs.readFileSync(f).toString();
    var post = parseSourceContent(source);
    post.timestamp = new Date(post.date);
    post.url = '/posts/' + stripExtname(f.slice(sourceDir.length + 1)) + '.html';
    list.push(post);
  });

  list.sort(function (a, b) {
    return b.timestamp - a.timestamp;
  });

  var config = loadConfig(dir);
  var layout = path.resolve(dir, '_layout', 'index.html');
  var html = renderFile(layout, {
    config: config,
    posts: list
  });
  return html;
}

// 读取配置文件
function loadConfig (dir) {
  var content = fs.readFileSync(path.resolve(dir, 'config.json')).toString();
  var data = JSON.parse(content);
  return data;
}


// 输出函数
exports.renderPost = renderPost;
exports.renderIndex = renderIndex;
exports.stripExtname = stripExtname;
exports.eachSourceFile = eachSourceFile;
exports.loadConfig = loadConfig;
