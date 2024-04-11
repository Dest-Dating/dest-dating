const io = require("socket.io")(process.env.PORT || 4000, {
  cors: {
    origin: ["https://localhost:3000"],
  },
});

// User
let users = [];

//Function to add user to users array
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

//Function to remove user from users array
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

//Function to fetch a user
const fetchUser = (reciverId) =>
  users.find((user) => user.userId === reciverId);

//Connection Established
io.on("connection", (socket) => {
  //Adding a userId and socketId
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    //Emiting to all users
    io.emit("getUsers", users);
  });

  //Message Section
  //Sending message to user
  socket.on("sendMessage", ({ reciverId, senderId, message }) => {
    const user = fetchUser(reciverId);
    console.log(message, senderId, reciverId);
    //Emiting it to the reciver
    io.to(user?.socketId).emit("getMessage", { senderId, message });
  });

  //On Disconnection
  socket.on("disconnect", () => {
    console.log(`ID: ${socket.id} disconnected`);
    removeUser(socket.id);

    //Emiting to all users
    io.emit("getUsers", users);
  });
});
