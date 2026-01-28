class ApiResponse {
  constructor(statusCode, data, message = 'Success', meta = {}) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.meta = Object.keys(meta).length > 0 ? meta : undefined;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = 'Success', meta = {}) {
    return new ApiResponse(200, data, message, meta);
  }

  static created(data, message = 'Created successfully') {
    return new ApiResponse(201, data, message);
  }

  static noContent(message = 'Deleted successfully') {
    return new ApiResponse(204, null, message);
  }

  static paginated(data, pagination, message = 'Success') {
    return new ApiResponse(200, data, message, { pagination });
  }

  send(res) {
    const response = {
      success: this.success,
      message: this.message,
      data: this.data,
      ...(this.meta && { meta: this.meta }),
      timestamp: this.timestamp,
    };

    return res.status(this.statusCode).json(response);
  }
}

const createPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

module.exports = { ApiResponse, createPaginationMeta };
