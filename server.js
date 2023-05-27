const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const SOCKET_EVENTS = require("./src/socketActions");
const path = require("path");
const server = http.createServer(app);

app.use(express.static("build"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const map = {};
const getAllConnectedClientsByRoomId = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: map[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  socket.on(SOCKET_EVENTS.JOIN, ({ roomId, username }) => {
    map[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClientsByRoomId(roomId); // clients on this roomId
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(SOCKET_EVENTS.JOINED, {
        username,
        clients,
        socketId: socket.id,
      });
    });
  });

  socket.on(SOCKET_EVENTS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(SOCKET_EVENTS.CODE_CHANGE, { code });
  });

  socket.on(SOCKET_EVENTS.SYNC_CODE, ({ code, socketId }) => {
    io.to(socketId).emit(SOCKET_EVENTS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(SOCKET_EVENTS.DISCONNECTED, {
        socketId: socket.id,
        username: map[socket.id],
      });
    });
    delete map[socket.id];
    socket.leave();
  });
});
