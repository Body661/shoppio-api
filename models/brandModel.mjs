import mongoose from "mongoose";

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
    {timestamps: true}
);

const setImgUrl = (doc) => {
    if (doc.img) {
        doc.img = `${process.env.BASE_URL}/brands/${doc.img}`;
    }
};
BrandSchema.post("init", (doc) => {
    setImgUrl(doc);
});
BrandSchema.post("save", (doc) => {
    setImgUrl(doc);
});

const BrandModel = mongoose.model("Brand", BrandSchema);
export default BrandModel;
