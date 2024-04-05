const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js");

// connect to the database
exports.connect = async () => {
  await mongoose
    .connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    .then(console.log("DB connection SUCCESSFUL"))
    .catch((error) => {
      console.log("ERROR connecting to the database: " + error);
      process.exit(1);
    });
};
