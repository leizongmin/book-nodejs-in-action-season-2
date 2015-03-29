/**
 * 简单API服务器
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var database = require('../lib/database');


exports.getArticles = function (req, res, next) {
  database.queryArticles(req.query, function (err, ret) {
    if (err) return next(err);
    res.apiSuccess({articles: ret});
  });
};
