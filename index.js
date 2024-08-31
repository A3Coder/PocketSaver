const mongoose = require("mongoose");
const cors = require("cors")
const env = require("dotenv")

env.config()

console.log(process.env)
mongoose.connect(process.env.MONGOURL);

//For Api Route
const router = require('./backend/routes/API_routes')
const express = require("express");
const app = express();
app.use(express.static('frontend/public'));
app.use(cors())


//for user routes
const userRoute = require('./backend/routes/userRoute');
app.use('/', userRoute);
app.use(express.json()) //MiddleWare --> for using req.body
app.use('/users', router)

// Check MongoDB connection status
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

const port = 3000;

app.listen(port, function () {
    console.log(`Server is running on http://localhost:${port}`);
});

