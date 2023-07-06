import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    default: 0
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "premium", "admin"],
    default: "user",
  },
  photo: {
    type: String,
    default: 'https://i.imgur.com/avx2DwE.jpg'
  },
  isGithub: {
    type: Boolean,
    required: true,
    default: false
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  userToken: {
    type: String
  },
  documents: [
    {
      name: {
        type: String,
        required: true,
      },
      reference: {
        type: String,
        required: true,
      },
    },
  ],
  last_connection: {
    type: Date,
    default: Date.now
  }
});

export const userModel = mongoose.model("users", userSchema);
