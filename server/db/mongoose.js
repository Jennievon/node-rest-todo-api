var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(
	process.env.MONGODB_URI ||
		"mongodb+srv://von:odins108@cluster0.lcvfs.mongodb.net/todo?retryWrites=true&w=majority",
);

module.exports = { mongoose };
