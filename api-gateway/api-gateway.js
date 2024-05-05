const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();
const serviceAUrl = 'http://localhost:3001';
const serviceBUrl = 'http://localhost:3002';

// Route handler for /api/data
app.get('/api/data', (req, res) => {
  console.log(`Incoming request to /api/data: ${req.method} ${req.url}`);
  
  // Forward the request to Service A
  proxy.web(req, res, { target: serviceAUrl }, (err) => {
    console.error(`Error forwarding request to service A: ${err.message}`);
    res.status(500).send('Internal Server Error');
  });
});

// Route handler for /api/info
app.get('/api/info', (req, res) => {
  console.log(`Incoming request to /api/info: ${req.method} ${req.url}`);
  
  // Forward the request to Service B
  proxy.web(req, res, { target: serviceBUrl }, (err) => {
    console.error(`Error forwarding request to service B: ${err.message}`);
    res.status(500).send('Internal Server Error');
  });
});

// Log requests received by the proxy
proxy.on('proxyReq', function (proxyReq, req, res, options) {
  console.log(`Received request to ${options.target.href}: ${req.method} ${req.url}`);
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
