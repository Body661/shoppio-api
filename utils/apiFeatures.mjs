class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Remove excluded fields from the filter object
  _removeExcludedFields(filter, excludedFields) {
    excludedFields.forEach((field) => delete filter[field]);
    return filter;
  }

  // Filter the query based on the given filter parameters
  filter() {
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    let filter = this._removeExcludedFields({ ...this.queryString }, excludedFields);

    // Apply filters using [gte | gt | lte | lt]
    let filterStr = JSON.stringify(filter);
    filterStr = filterStr.replace(
        /(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(filterStr));
    return this;
  }

  // Sort the query based on the given sort parameters
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Limit the query fields based on the given field parameters
  limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  // Search for documents using the keyword
  search(modelName) {
    if (this.queryString.keyword) {
      const searchQuery = {};
      if (modelName === "Products") {
        searchQuery.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        searchQuery.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }

      this.query = this.query.find(searchQuery);
    }

    return this;
  }

  // Paginate the query results
  paginate(docsCount) {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.pages = Math.ceil(docsCount / limit);

    if (endIndex < docsCount) {
      pagination.next = page + 1;
    }

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = pagination;

    return this;
  }
}

export default ApiFeatures;