const newrelic = require('newrelic')
var compression = require('compression')
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const request = require('request');
const dotenv = require('dotenv').config();
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
const axios = require('axios')

app.use(compression());
app.use(express.static(path.join(__dirname, '/public/dist')));

const sendIndex = (req, res) => {
  res.sendFile(path.join(__dirname, './public/dist/index.html'));
};

app.get('/user_image.png', (req, res) => {
  let status = 200;
  let response = request(`http://${dotenv.parsed.REVIEW_IP}:3004/user_image.png`);
  response.on('error', console.error);
  response.on('response', data => data.pipe(res));
});

app.get('/:productId', sendIndex);

app.get('*/dp/:productId', sendIndex);

app.get('/*.js', (req, res) => {
  res.sendFile(req.path);
});

// CREATE
app.post('/Information', function (req, res) {
  proxy.web(req, res, {target: process.env.INFO_IP});
});

// READ
app.get('/Information/:productId', function (req, res) {
  proxy.web(req, res, {target: process.env.INFO_IP});
});

// UPDATE
app.put('/Information/:productId', function (req, res) {
  proxy.web(req, res, {target: process.env.INFO_IP});
});

// DELETE
app.delete('/Information/:productId', function (req, res) {
  proxy.web(req, res, {target: process.env.INFO_IP});
});

app.listen(port, () => {
  console.log(`Proxy listening at http://localhost:${port}`);
});
