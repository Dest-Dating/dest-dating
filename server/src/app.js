const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// configuration to parse JSON and URL-encoded data.
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());

// Connect to the database
const db = require("./config/db");
db.connect()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR occurred");
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at PORT: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MONGO DB connection FAILED ${error}`);
  });

require("./config/cloudinary").cloudinaryConnect();

exports.app = app;
