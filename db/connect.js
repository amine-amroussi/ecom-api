const mongooose = require('mongoose')

const connectDB = (url) => {
    return mongooose.connect(url)
}

module.exports = connectDB