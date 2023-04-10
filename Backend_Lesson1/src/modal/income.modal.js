const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    label: "string",
    amount: "number",
    description:"string",
    user: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", schema);

module.exports = Income;
