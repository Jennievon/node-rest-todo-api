const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true, //remove leading white space
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: "{VALUE} is not a valid email.",
		},
	},

	password: {
		type: String,
		require: true,
		minlength: 6,
	},

	tokens: [
		{
			access: {
				type: String,
				require: true,
			},
			token: {
				type: String,
				require: true,
			},
		},
	],
});

UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();
	return _.pick(userObject, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = "auth";
	var token = jwt
		.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
		.toString();
	user.tokens = [{ access, token }];
	return user.save().then(() => {
		return token;
	});
};

UserSchema.methods.removeToken = function (token) {
	var user = this;
	return user.update({
		$pull: {
			tokens: {
				token: token,
			},
		},
	});
};

UserSchema.statics.findByCredentials = function (email, password) {
	var User = this;
	return new Promise((resolve, reject) => {
		User.findOne({ email })
			.then((user) => {
				if (!user) {
					reject();
				}
				bcrypt
					.compare(password, user.password)
					.then((res) => {
						resolve(user);
					})
					.catch((e) => reject());
			})
			.catch((e) => {
				reject();
			});
	});
};

UserSchema.statics.findByToken = function (token) {
	var User = this;
	var decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🚀 ~ file: user.js ~ line 95 ~ decoded", decoded)

	
	} catch (e) {
		// return new Promise((resolve,reject)=>{
		//   return reject();
		// })
		return Promise.reject();
	}
	return User.findOne({
		_id: decoded._id,
		"tokens.token": token,
		"tokens.access": "auth",
	});
};

UserSchema.pre("save", function (next) {
	var user = this;
	if (user.isModified("password")) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

var User = mongoose.model("User", UserSchema);

module.exports = { User };
