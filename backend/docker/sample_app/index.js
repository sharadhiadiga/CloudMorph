const http = require("http");

http.createServer((req, res) => {
  res.end("Hello from Docker!");
}).listen(3000);