# 静态博客工具

安装：

```bash
$ npm install
```

自定义模板： `_layouts` 目录

文章列表：

```
{% for item in posts %}
  {{item.title|escape}}
{% endfor %}
```

文章页面：

```
标题：{{post.title|escape}}
时间：{{post.date|escape}}
内容：{{post.content}}
```

配置：（`config.js`文件）

```
网站标题：{{config.title}}
```

--------

文章： `_posts` 目录

每个文件后缀为 `.md`，格式如下：

```
---
layout: post
title: 这里是文章标题
date: 2015-05-15 
---

这里是文章内容
```
 
 
 