var APIClient = require('./lib/index'); //����APIClient

var client = new APIClient({
    appKey: 'xxxx',
    appSecret: 'xxxxx',
    callbackUrl: 'http://example.com/auth/callback'
});

// ��ȡ��Ȩ��ת��ַ
var url = client.getRedirectUrl();

// ��Ȩȷ�Ϻ󷵻ص�Code��ȡAccess Token
client.requestAccessToken(code, callback);
