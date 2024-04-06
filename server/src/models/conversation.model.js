const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    members: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
}
);

module.exports = mongoose.model("Conversation", conversationSchema);
