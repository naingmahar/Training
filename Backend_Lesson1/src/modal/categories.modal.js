const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    label: "string",
    description: "string",
    user: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const Categories = mongoose.model("Categories", schema);

module.exports = Categories;
