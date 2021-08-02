//config env
require("../server/config/config");

//Library Imports
var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");

//Local Imports
var { mongoose } = require("./db/mongoose");
var { routes } = require("./routes/routes");

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json()); //middleware to convert body on javascript object
app.use(
	cors({
		origin: "*", // allow to server to accept request from different origin
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		optionsSuccessStatus: 200,
		credentials: true, // allow session cookie from browser to pass through
	}),
);
routes(app); //app routings

app.listen(port, () => {
	console.log(`Started on port ${port}!`);
});

module.exports = { app };
