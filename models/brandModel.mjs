import mongoose from "mongoose";

// Define the Brand schema
const BrandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Brand name is required"],
            unique: [true, "Brand name must be unique"],
            minLength: [2, "Brand name must be at least 2 characters"],
            maxLength: [32, "Brand name is too long"],
        },
        img: {
            type: String,
        },
    },
    { timestamps: true }
);

// Function to set the image URL for the brand image
const setImgUrl = (doc) => {
    if (doc.img) {
        doc.img = `${process.env.BASE_URL}/brands/${doc.img}`;
    }
};

// Post hooks to set the image URL for the brand image after initialization and saving
BrandSchema.post("init", (doc) => {
    setImgUrl(doc);
});
BrandSchema.post("save", (doc) => {
    setImgUrl(doc);
});

// Create the Brand model using the Brand schema
const BrandModel = mongoose.model("Brand", BrandSchema);

export default BrandModel;
