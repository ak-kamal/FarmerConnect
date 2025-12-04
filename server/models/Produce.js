import mongoose from "mongoose";

const produceSchema = new mongoose.Schema(
    {
        produceName: {
            type: String,
            required: [true, "Please enter the name of the produce: "],
        },
        category: {
            type: String,
            required: [true, "Please enter the category(vegetable, fruit, crop, etc.) of the produce: "],
        },
        quantity: {
            type: Number,
            required: [true, "Please enter the quantity of the produce in kg: "],
        },
        region: {
            type: String,
            required: [true, "Please enter the region where the produce was produced: "],
        },
        pricePerUnit: {
            type: Number,
            required: [true, "Please enter the price of the produce per kg in taka: "],
        },
        qualityGrade: {
            type: String,
            required: [true, "Please enter the quality grade ('A', 'B', or 'C') of the produce: "],
        },
        description: {
            type: String,
            required: [true, "Please enter the description of the produce: "],
        },
        harvestDate: {
            type: Date,
            required: [true, "Please enter the hervest date of the produce: "],
        },
        image:[ 
            {
            type: String,
            },
        ],
    },
    { timestamps: true } //createdAt, updatedAt
);

const Produce = mongoose.model("Produce", produceSchema);

export default Produce;