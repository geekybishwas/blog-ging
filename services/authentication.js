const JWT = require("jsonwebtoken");

const secret = "$geeks#for#real#07$";

async function create_token_for_user(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profile_image_url: user.profile_image_url,
    role: user.role,
  };

  const token = JWT.sign(payload, secret);

  return token;
}

function validate_token(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  create_token_for_user,
  validate_token,
};
