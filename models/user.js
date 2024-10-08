const { Schema, model } = require("mongoose");
// For hashing the password
const { createHmac, randomBytes } = require("crypto");
const { create_token_for_user } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profile_image_url: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

// Mongoose virtual function
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    try {
      const user = await this.findOne({ email });

      if (!user) throw new Error("User not Found");

      const salt = user.salt;
      const hashedPassword = user.password;

      const userProvidedHashed = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

      if (hashedPassword !== userProvidedHashed)
        throw new Error("Password not Matched");

      const token = create_token_for_user(user);

      return token;
    } catch (error) {
      // Catch and handle the error here
      console.error(error.message);
      throw new Error("Authentication failed");
    }
  }
);

const USER = model("user", userSchema);

module.exports = USER;
