const { Server } = require("socket.io");

const io = new Server(4080, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});
// const io = require("socket.io")(process.env.PORT || 4080, {
//   cors: {
//     origin: ["https://localhost:3000"],
//   },
// });

// // User
// let users = [];

// //Function to add user to users array
// const addUser = (userId, socketId) => {
//   !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
// };

// //Function to remove user from users array
// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };

// //Function to fetch a user
// const fetchUser = (reciverId) =>
//   users.find((user) => user.userId === reciverId);

// //Connection Established
// io.on("connection", (socket) => {
//   console.log(`ID: ${socket.id} connected `);

//   //Adding a userId and socketId
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);

//     //Emiting to all users
//     io.emit("getUsers", users);
//   });

//   //Message Section
//   //Sending message to user
//   socket.on("sendMessage", ({ reciverId, senderId, message }) => {
//     const user = fetchUser(reciverId);

//     //Emiting it to the reciver
//     io.to(user?.socketId).emit("getMessage", { senderId, message });
//   });

//   //On Disconnection
//   socket.on("disconnect", () => {
//     console.log(`ID: ${socket.id} disconnected`);
//     removeUser(socket.id);

//     //Emiting to all users
//     io.emit("getUsers", users);
//   });
// });
