const {StatusCodes} = require('http-status-codes')
const CustomAPI = require('./custom-api')

class NotFound extends CustomAPI {
    constructor(message) {
        super (message);
        this.statusCode = StatusCodes.NOT_FOUND
    }
}

module.exports = NotFound