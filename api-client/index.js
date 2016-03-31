var APIClient = require('./lib/index'); //引入APIClient

var client = new APIClient({
    appKey: 'xxxx',
    appSecret: 'xxxxx',
    callbackUrl: 'http://example.com/auth/callback'
});

// 获取授权跳转地址
var url = client.getRedirectUrl();

// 授权确认后返回的Code换取Access Token
client.requestAccessToken(code, callback);
