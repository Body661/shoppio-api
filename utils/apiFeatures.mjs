class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const filter = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields"];
    excludesFields.forEach((field) => delete filter[field]);

    // Apply filters using [gte | gt | lte | lt]
    let queryString = JSON.stringify(filter);
    queryString = queryString.replace(
      /(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

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

  paginate(docsCount) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
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
    this.paginationRes = pagination;

    return this;
  }

  populate(arr) {
    this.query = this.query.populate(arr);

    return this;
  }
}

export default ApiFeatures;
