# API客户端

安装：

```bash
$ npm install
```

使用方法：

```JavaScript
// 初始化
var client = new APIClient({
  appKey: 'xxxx',
  appSecret: 'xxxxx',
  callbackUrl: 'http://example.com/auth/callback'
});

// 获取授权跳转地址
var url = client.getRedirectUrl();

// 授权确认后返回的Code换取Access Token
client.requestAccessToken(code, callback);
```
