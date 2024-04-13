const User = require("../models/user.model");

// Function to fetch recommended users for a given user
const getRecommendations = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // // Adjusted height preferences
    // const minHeight =
    //   user.preferences.minHeight !== null
    //     ? user.preferences.minHeight
    //     : user.height - 5;
    // const maxHeight =
    //   user.preferences.maxHeight !== null
    //     ? user.preferences.maxHeight
    //     : user.height + 5;

    // Fetch potential matches based on criteria, excluding liked, rejected, and matched users
    const potentialMatches = await User.find({
      _id: { $ne: user._id },
      gender: user.interestedInGender,
      interestedInGender: user.gender,
      _id: {
        $nin: [...user.likedArray, ...user.rejectedArray, ...user.matchedArray],
      }, // Exclude liked, rejected, and matched users
      height: { $gte: user.height - 40, $lte: user.height + 40 },
    });

    // Calculate similarity score for each potential match using cosine similarity
    const recommendations = potentialMatches.map((match) => {
      const similarityScore = calculateCosineSimilarity(user, match);
      return { user: match, similarityScore };
    });

    recommendations.sort((a, b) => b.similarityScore - a.similarityScore);

    const recommendedUsers = recommendations.map(
      (recommendation) => recommendation.user
    );

    res.json({ success: true, recommendations: recommendedUsers });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch recommendations." });
  }
};

// Function to calculate cosine similarity between two users in n-dimensional space
const calculateCosineSimilarity = (user1, user2) => {
  const vector1 = Object.values(user1).filter(
    (value) => typeof value === "number"
  );
  const vector2 = Object.values(user2).filter(
    (value) => typeof value === "number"
  );

  let dotProduct = 0;
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
  }

  const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val ** 2, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val ** 2, 0));

  const cosineSimilarity = dotProduct / (magnitude1 * magnitude2);

  return cosineSimilarity;
};

module.exports = {
  getRecommendations,
};
