const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must have at least 2 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },

    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      // Password is optional for Google Login
      required: function () {
        return !this.googleId;
      }
    },

    googleId: {
      type: String,
      default: null
    },

    initialBalance: {
      type: Number,
      default: 0,
      min: [0, "Initial amount cannot be negative"]
    },

    currentBalance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be negative"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
