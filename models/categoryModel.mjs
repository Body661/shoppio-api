import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Category name is required"],
            unique: [true, "Category name must be unique"],
            minLength: [3, "Category name must be at least 3 characters"],
            maxLength: [32, "Category name is too long"],
        },
        img: {
            type: String,
        },
    },
    {timestamps: true}
);

const setImgUrl = (doc) => {
    if (doc.img) {
        doc.img = `${process.env.BASE_URL}/categories/${doc.img}`;
    }
};
CategorySchema.post("init", (doc) => {
    setImgUrl(doc);
});
CategorySchema.post("save", (doc) => {
    setImgUrl(doc);
});

const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;
