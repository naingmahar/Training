const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    label: "string",
    amount: "number",
    description:"string",
    user: mongoose.Schema.Types.ObjectId,
    category: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", schema);

module.exports = Expense;
