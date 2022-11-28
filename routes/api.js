const express = require("express")
const router = express.Router()

const authRoutes = require('./auth.routes')

// Add auth routes
authRoutes(router);

module.exports = router
