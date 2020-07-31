const express = require("express");
const WebSocket = require("ws");

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  let clients = {};

  wss.on("connection", (ws, req) => {
    let id = genID();
    clients[id] = ws;
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("connected from " + ip);

    ws.on("message", (message) => {
      let msg = JSON.parse(message);
      console.log(msg);
      switch (msg.func) {
        case "init":
          ws.send(JSON.stringify({ func: "init", id: id }));
          break;
        case "conn":
          if (clients[msg.id]) {
            clients[msg.id].send(
              JSON.stringify({ func: "conn", id: id, key: msg.key })
            );
            ws.send(JSON.stringify({ func: "conn", id: msg.id }));
          }
          break;
        case "key":
          if (clients[msg.id]) {
            clients[msg.id].send(JSON.stringify({ func: "key", key: msg.key }));
          }
          break;
        case "send":
          if (clients[msg.to]) {
            clients[msg.to].send(
              JSON.stringify({ func: "get", from: id, content: msg.content })
            );
          }
          break;
      }
    });

    ws.on("error", (err) => {
      console.log("error from " + ip);
    });

    ws.on("close", () => {
      removeClient(id);
    });
  });

  removeClient = (id) => {
    delete clients[id];
  };

  genID = () => {
    return Math.random().toString(36).substr(2, 9);
  };
};
