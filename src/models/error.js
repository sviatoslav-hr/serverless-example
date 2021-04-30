class BaseError extends Error {
  constructor({ message, errorCode }, name = 'BaseError') {
    super(message);
    this.name = name;
    this.errorCode = errorCode;
  }

  toString() {
    return `${this.name} [${this.errorCode}] - ${this.message}`;
  }
}

class ValidationError extends BaseError {
  constructor(message, errorCode) {
    super({ message, errorCode }, 'ValidationError');
  }
}

module.exports = {
  BaseError,
  ValidationError,
};