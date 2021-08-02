var todoController = require("../controllers/todo-controller");
var userController = require("../controllers/user-controller");
var { authenticate } = require("../middleware/authenticate");

var routes = (app) => {
	//Create Todo
	app.post("/todos", authenticate, todoController.create);
	//Get All Todos
	app.get("/todos", authenticate, todoController.findAll);
	//Find Todo by Id
	app.get("/todos/:id", authenticate, todoController.findByID);
	//Delete Todo by Id
	app.delete("/todos/:id", authenticate, todoController.deleteById);
	//Update Todo
	app.patch("/todos/:id", authenticate, todoController.update);
	//Create User
	app.post("/users", userController.create);
	//Get user info
	app.get("/users/me", authenticate, userController.info);
	//Login
	app.post("/users/login", userController.login);
	//Logout
	app.delete("/users/me/token", authenticate, userController.logout);
};

module.exports = { routes };
