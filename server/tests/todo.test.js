const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("../server.js");
const { Todo } = require("../models/todo");
const { todos, populateTodos, users } = require("./seed/seed");

beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create a new todo", done => {
    var text = "Test todo test";
    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(err => done(err));
      });
  });
  it("should not create Todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe("GET /todos/id", () => {
  it("should return a valid todo", done => {
    var id = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should not return todo doc created by other", done => {
    var id = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it("should return 404 for non-valid id", done => {
    var id = "123";
    request(app)
      .get(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it("should return 404 if todo not found", done => {
    var id = "5a7a05a1a55a69d1b032e807";
    request(app)
      .get(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should return a deleted todo", done => {
    var id = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        } else {
          Todo.findById(id)
            .then(todo => {
              expect(todo).toNotExist;
              done();
            })
            .catch(e => done(e));
        }
      });
  });
  it("should return a empty todo when delete one created by other", done => {
    var id = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 for invalid id ", done => {
    var id = "123";
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it("should return 404 if id not found", done => {
    var id = new ObjectID();
    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/id", () => {
  it("should update a todo", done => {
    var id = todos[0]._id.toHexString();
    var updatedTodo = {
      completed: true
    };
    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .send(updatedTodo)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completed).toBe(true);
      })
      .end(done);
  });

  it("should not update a todo created by other", done => {
    var id = todos[0]._id.toHexString();
    var updatedTodo = {
      completed: true
    };
    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .send(updatedTodo)
      .expect(404)
      .end(done);
  });
  
  it("should clear completedAt when todo is not completed", done => {
    var id = todos[1]._id.toHexString();
    var updatedTodo = {
      completed: false
    };
    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[1].tokens[0].token)
      .send(updatedTodo)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
  it("should return 404 with non-valid id", done => {
    var id = "123";
    var updatedTodo = {
      completed: false
    };
    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .send(updatedTodo)
      .expect(404)
      .end(done);
  });
  it("should return 404 with non exist id ", done => {
    var id = new ObjectID();
    var updatedTodo = {
      completed: false
    };
    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth", users[0].tokens[0].token)
      .send(updatedTodo)
      .expect(404)
      .end(done);
  });
});
