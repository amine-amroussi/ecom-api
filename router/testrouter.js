const express = require('express')
const router = express.Router()

router.route("/test").get((req, res => {
    res.send("This is test route")
}))

module.exports = router