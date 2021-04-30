const { StatusCodes } = require('http-status-codes');

class HttpResponse {
  constructor(statusCode, body) {
    this.setStatusCode(statusCode);
    this.setBody(body);
  }

  setStatusCode(statusCode) {
    this.statusCode = statusCode;
    return this;
  }

  setBody(body) {
    if (body !== undefined && body !== null) {
      this.body = JSON.stringify(body);
    }
    return this;
  }

  static ok(body) {
    return new HttpResponse(StatusCodes.OK, body);
  }

  static bad_request(body) {
    return new HttpResponse(StatusCodes.BAD_REQUEST, body);
  }

  static not_found(body) {
    return new HttpResponse(StatusCodes.NOT_FOUND, body);
  }

  static internal_server_error(body) {
    return new HttpResponse(StatusCodes.INTERNAL_SERVER_ERROR, body);
  }
}

module.exports = HttpResponse;