import { FilterQuery, Query } from 'mongoose';

export interface QueryString {
  searchTerm?: string;
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

class ApiFeature<T> {
  constructor(
    public query: Query<T[], T>,
    public queryString: QueryString
  ) {
    this.query = query;
    this.queryString = queryString;
  }
  search(searchableFields: string[]) {
    if (searchableFields.length && this.queryString.searchTerm) {
      const searchTerm = this.queryString.searchTerm;

      this.query = this.query.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>
        ),
      });
    }
    return this;
  }

  filter() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { searchTerm, sort, limit, page, fields, ...queryObject } =
      this.queryString;

    // advanced filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortby = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this.query;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default ApiFeature;
