// Import necessary modules
require("dotenv").config();

// start server and connect to the database
const { app } = require("./app");

const user = require("./routes/user");
app.use("/", user);
