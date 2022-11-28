const routes = require("./routes/api")
const express = require("express")
const app = express()
const serverConfig = require('./config/server.config');
const dbConfig = require('./config/db.config');
const mongoose = require('mongoose');

console.log(`Node environment: ${process.env.NODE_ENV}`)

mongoose.connect(dbConfig.DB_URL, { family: 4 });

const db = mongoose.connection;
db.on("error", () => {
    console.log("error while connecting to DB");
});
db.once("open", () => {
    console.log("connected to Mongo DB: ", dbConfig.DB_URL)
});

app.use(express.json())

app.use("/", routes)

module.exports = app.listen(serverConfig.PORT, () => {
    console.log(`Application started on the port num : ${serverConfig.PORT}`);
})
