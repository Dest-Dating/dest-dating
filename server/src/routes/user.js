const express = require("express");
const router = express.Router();

// require("../../../frontend/node_modules/dotenv/lib/main").config();
require("dotenv").config();
// const multer = require("multer");
// const path = require("path");
// const cloudinary = require("cloudinary").v2;

// // const { login, signup, verification } = require("../controllers/auth");
// // const { auth } = require("../middlewares/Auth");
// // const { postChat, getChats } = require("../controllers/chat");
// // const { addComment, getComments } = require("../controllers/commentController");

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "/Users/Rathore/Github/sherlock-s-eye/backend/src/uploads/images");
//   },
//   filename: (req, file, cb) => {
//     // console.log(req.body);
//     cb(null, "temp." + req.body.fileType.split("/")[1]);
//   },
// });

// // Multer upload configuration
// const upload = multer({
//   storage: storage,
// });

// // Importing authentication and post controllers

// const {
//   addPost,
//   upVote,
//   downVote,
//   getTopCategories,
// } = require("../controllers/post");

// // API routes
// router.post("/login", login); // User login endpoint
// router.post("/signup", signup); // User signup endpoint
// router.post("/verifyEmail", verification); // Email verification endpoint
// router.post("/addPost", auth, upload.single("file"), addPost); // Add post endpoint
// router.post("/upVote", auth, upVote);
// router.post("/downVote", auth, downVote);
// router.get("/getTopCategories", auth, getTopCategories);
// router.post("/addComment", auth, addComment);
// router.get("/comments/:postId", getComments);
// router.post("/api/v1/putChats", postChat); // adding chat to database route
// router.post("/api/v1/getChats", getChats); // getting chat route

// const Post = require("../models/post.model");
// // Get all posts with Cloudinary image URLs
// router.get(`/posts`, async (req, res) => {
//   try {
//     const posts = await Post.find();

//     // Map each post to include the Cloudinary image URL
//     const postsWithImages = await Promise.all(
//       posts.map(async (post) => {
//         if (post.media) {
//           const imageUrl = cloudinary.url(post.media);
//           return { ...post.toObject(), imageUrl };
//         }
//         return post.toObject();
//       })
//     );

//     res.status(200).json(postsWithImages);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch posts" });
//   }
// });

const { addUser } = require("../controllers/AVL.js");
// Test Authentication
router.get("/get", addUser, (req, res) => {
  // console.log("At /get");
  return res.json({
    message: "Authentication Test successful",
    success: true,
  });
});

module.exports = router;
