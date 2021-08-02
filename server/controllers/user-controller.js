const { User } = require("../models/user");
const _ = require("lodash");

/**
 * Create User
 * @param {*} req
 * @param {*} res
 */
exports.create = async (req, res) => {
	try {
		var body = _.pick(req.body, ["email", "password"]);
		var user = new User(body);
		await user.save();
		const token = await user.generateAuthToken();
		res.header("x-auth", token).send(user);
	} catch (e) {
		res.status(404).send(e);
	}
};

/**
 * Get User email and id
 * @param {*} req
 * @param {*} res
 */
exports.info = (req, res) => {
	res.send(req.user);
};

/**
 * Find User by Credentials
 * @param {*} req
 * @param {*} res
 */
exports.login = async (req, res) => {
	try {
		const body = _.pick(req.body, ["email", "password"]);
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		res.status(200).send({
			token,
			user,
		});
	} catch (e) {
		res.status(400).send();
	}
};

exports.logout = async (req, res) => {
	try {
		await req.user.removeToken(req.token);
		res.status(200).send();
	} catch (e) {
		res.status(400).send();
	}
};
