const express = require('express'),
      bodyParser = require('body-parser'),
      bluebird = require('bluebird');


const app = express(),
      server = require('http').createServer(app);

server.listen(9999);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/test', async(req, res, next) => {
    await bluebird.delay(3000)
    res.json({'code':'ss'})
  })