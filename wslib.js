const WebSocket = require("ws");

const clients = [];
const messages = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
      messages.push(message);
      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

const agregarMensajeApi = (req, res) => {
  let mensaje = req.body.message;
  messages.push(mensaje);
  clients.forEach((client) => client.send(JSON.stringify(messages)));
};

exports.wsConnection = wsConnection;
exports.agregarMensajeApi = agregarMensajeApi;