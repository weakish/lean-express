'use strict';

var express = require('express');
var AV = require('leanengine');

const DisableCloudFunction = (req, res, next) => {
  if (req.path === "/1.1/functions/_ops/metadatas") {
    res.status(404).end()
  } else {
    next()
  }
}

var app = express();

app.enable('trust proxy');
app.use(DisableCloudFunction);
// 需要重定向到 HTTPS 可去除下一行的注释。
app.use(AV.Cloud.HttpsRedirect());


app.get('/', function(req, res) {
  res.send('Hello World!');
});


app.use(function(req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

module.exports = app;
