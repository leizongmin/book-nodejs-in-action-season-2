/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var url = require('url');
var express = require('express');
var routes = require('./routes');
var middlewares = require('./lib/middlewares');


var app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(middlewares.extendAPIOutput);
app.use('/api', middlewares.verifyAccessToken);
require('./routes')(app);
app.use(middlewares.apiErrorHandle);

app.listen(3000);

