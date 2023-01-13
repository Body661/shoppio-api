import expressAsyncHandler from "express-async-handler";
import ApiError from "./apiError.mjs";
import ApiFeatures from "./apiFeatures.mjs";

export const createDocument = (Model) =>
  expressAsyncHandler(async (req, res, next) => {
    const data = await Model.create(req.body);

    res.status(201).json(data);
  });

export const getAllDocuments = (Model, modelName) =>
  expressAsyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;

    // Build query
    const docsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(docsCount)
      .search(modelName)
      .filter()
      .limit()
      .sort();

    // Execute query
    const { query, paginationRes } = apiFeatures;
    const docs = await query;

    res.status(200).json({ amount: docs.length, paginationRes, data: docs });
  });

export const getDocument = (Model, err, populationOpts) =>
  expressAsyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;

    const query = Model.findOne({ _id: req.params.id, ...filter });

    if (populationOpts) query.populate(populationOpts);

    const doc = await query;

    if (!doc) {
      return next(new ApiError(err, 404));
    }

    res.status(200).json({ data: doc });
  });

export const updateDocument = (Model, err) =>
  expressAsyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(new ApiError(err, 404));
    }

    document.save();
    res.status(200).json({ data: document });
  });

export const deleteDocument = (Model, err, message) =>
  expressAsyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new ApiError(err, 404));
    }
    doc.remove();
    res.status(200).json({ message });
  });
