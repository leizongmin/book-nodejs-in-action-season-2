# API服务器

安装：

```bash
$ npm install
```

启动：

```bash
$ node web
```

说明：

+ `web/lib/database.js` 模拟数据库操作，根据需要替换为实际存取代码
+ `web/routes/client.js` 模拟应用端的Web服务器

测试：在浏览器中访问 `http://127.0.0.1:3000/example`
