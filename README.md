<p align="center">
  <img width="200" src="https://camo.githubusercontent.com/fc61dcbdb7a6e49d3adecc12194b24ab20dfa25b/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67" />
</p>

[![Build Status](https://travis-ci.org/andremartingo/node-rest-api-todo.svg?branch=master)](https://travis-ci.org/AFGM/node-rest-api-todo)
[![Coverage Status](https://coveralls.io/repos/github/AFGM/node-rest-api-todo/badge.svg?branch=master)](https://coveralls.io/github/AFGM/node-rest-api-todo?branch=master)

# Express REST API

Todo REST API complete with user accounts and authentication.
This api was the final challenge from [Udemy Course](https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/overview).<p>
This was developed focus on [TDD](https://github.com/dwyl/learn-tdd).</p>

Demo : https://node-rest-api-todo.glitch.me

## Buzzwords

* Node.js
* Express
* MongoDB
* Mongoose
* Mocha
* REST API Design
* Clean Arquitecture
* Clean Code
* JWT Authentication
* Version control with Git

## Instalation

```bash
$ git clone git@github.com:AFGM/node-terminal-weather.git
$ cd node-terminal-weather
$ npm install
```

## Usage

Write command above to create config.json.

```bash
$ echo "{\"development\": {\"PORT\": 3000, \"MONGODB_URI\": \"mongodb://localhost:27017/todoapp\",\"JWT_SECRET\": \"ultrasecret\"}}" >> server/config/config.json
$ npm start
```

## HTTP Verbs

Here's an example of how HTTP verbs map to create, read, update, delete operations in a particular context:

| HTTP METHOD     | POST            | GET                      | PATCH       | DELETE      |
| --------------- | --------------- | ------------------------ | ----------- | ----------- |
| /todos          | Create new todo | List all todos from user | -           | -           |
| /todos/:id      | -               | List specific todo       | Update todo | Delete todo |
| /users          | Create user     | -                        | -           | -           |
| /users/me       | -               | List user informations   | -           | -           |
| /users/login    | Login           | -                        | -           | -           |
| /users/me/token | -               | -                        | -           | Logout      |

## Error handling

Error handling acording with REST API [standards](http://www.restapitutorial.com/httpstatuscodes.html)

| Code  | Description                                                                                         |
| :---- | :-------------------------------------------------------------------------------------------------- |
| `200` | The request has succeeded                                                                           |
| `400` | The request could not be understood by the server due to malformed syntax                           |
| `401` | The request requires user authentication. The response must include a WWW-Authenticate header field |
| `404` | The server has not found anything matching the Request-URI                                          |

## Request & Response Examples

### API Resources

* [POST /users](#post-users)
* [POST /todos](#post-todos)
* [GET /todos/:id](#get-todosid)

### POST /users

Request body:

```json
{
  "email": "test@gmail.com",
  "password": "default"
}
```

### POST /todos

Request body:

```json
{
  "text": "Sample todo"
}
```

### GET /todos/:id

Response body:

```json
{
  "todo": {
    "_id": "5aa587d1cfce06ecbef0a7ae",
    "text": "Sample Todo2",
    "_creator": "5aa58675cfce06ecbef0a7a7",
    "__v": 0,
    "completedAt": null,
    "completed": false
  }
}
```
