const mongoose = require("mongoose");

// connect to the database
exports.connect = async () => {
    console.log(process.env.MONGODB_URL);
    await mongoose
        .connect(`${process.env.MONGODB_URL}`)
        .then(console.log("DB connection SUCCESSFUL"))
        .catch((error) => {
            console.log("ERROR connecting to the database: " + error);
            process.exit(1);
        });
};
