const randomStringGenerator = (length) => {
  let randomString = "";
  const allowedCharacters = "0123456789";
  for (i = 0; i < length; i++) {
    randomString +=
      allowedCharacters[Math.floor(Math.random() * allowedCharacters.length)];
  }
  return randomString;
};

module.exports = randomStringGenerator;
