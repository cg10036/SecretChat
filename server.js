const express = require("express");
const app = express();
const http = require("http");
const websocket = require("./websocket");

const server = http.createServer(app);
websocket(server);

app.get("/", (req, res) => {
  // res.send("hello");
  res.sendFile(__dirname + "/html/index.html");
});

server.listen(3000, () => {
  console.log("started");
});
