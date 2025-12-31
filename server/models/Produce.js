import mongoose from "mongoose";

const produceSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["UP_FOR_SALE", "SOLD", "UNAVAILABLE"],
      default: "UP_FOR_SALE",
    },
    produceName: {
      type: String,
      required: [true, "Please enter the name of the produce: "],
    },
    category: {
      type: String,
      required: [
        true,
        "Please enter the category (vegetable, fruit, crop, etc.) of the produce: ",
      ],
    },
    quantity: {
      type: Number,
      required: [true, "Please enter the quantity of the produce in kg: "],
    },
    region: {
      type: String,
      required: [
        true,
        "Please enter the region where the produce was produced: ",
      ],
    },
    pricePerUnit: {
      type: Number,
      required: [
        true,
        "Please enter the price of the produce per kg in taka: ",
      ],
    },
    qualityGrade: {
      type: String,
      required: [
        true,
        "Please enter the quality grade ('A', 'B', or 'C') of the produce: ",
      ],
    },
    description: {
      type: String,
      required: [true, "Please enter the description of the produce: "],
    },
    harvestDate: {
      type: Date,
      required: [true, "Please enter the harvest date of the produce: "],
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Produce = mongoose.model("Produce", produceSchema);

export default Produce;
