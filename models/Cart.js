const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  itemId: Number,
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  category: String
});

const cartSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  items: [cartItemSchema]
});

module.exports = mongoose.model("Cart", cartSchema);
