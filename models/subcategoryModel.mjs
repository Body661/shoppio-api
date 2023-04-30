import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Subcategory name is required"],
            unique: [true, "Subcategory name must be unique"],
            minLength: [2, "Subcategory name must be at least 2 characters"],
            maxLength: [32, "Subcategory name is too long"],
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [true, "Subcategory must be belong to a parent category"],
        },
    },
    {timestamps: true}
);
// Pre-find hook to populate category field with name
SubcategorySchema.pre(/^find/, function (next) {
    this.populate([{ path: "category", select: "name" }]);
    next();
});

// Create the Subcategory model using the Subcategory schema
const SubcategoryModel = mongoose.model("Subcategory", SubcategorySchema);

export default SubcategoryModel;
