const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["incomes", "cost"],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    sum: {
      type: Number,
      required: true,
    },
    day: {
      type: String,
    },
    month: {
      type: String,
    },
    year: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const Transaction = model("transaction", transactionSchema);

export default Transaction;
