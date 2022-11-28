require("dotenv").config()
const routes = require("./routes/api")
const express = require("express")
const app = express()
const port = process.env.PORT
const mongoose = require('mongoose');

console.log(`Node environment: ${process.env.NODE_ENV}`)

mongoose.connect('mongodb://localhost/demodb2', { family: 4 });

const db = mongoose.connection;
db.on("error", () => {
    console.log("error while connecting to DB");
});
db.once("open", () => {
    console.log("connected to Mongo DB ")
});

app.use(express.json())

app.use("/", routes)

module.exports = app.listen(port, () => {
    console.log(`Application started on the port num : ${port}`);
})
