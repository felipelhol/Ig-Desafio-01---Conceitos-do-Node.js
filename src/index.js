const express = require('express');
const { request, response } = require("express");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const {id} = request.headers;

  const user = users.find(user => user.id === id);

  if(!user) {
    return response.status(400).json({error: 'Mensagem do erro'})
  }
  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  
  const userAlreadyExists = users.some((user) => user.username ===username);
  //const useridAlreadyExists = users.some((user) => user.id ===id);
  if(userAlreadyExists){
    return response.status(400).json({error: 'Mensagem do erro'});

  }
  
const user ={
    id: uuidv4(), // precisa ser um uuid
	  name, 
	  username, 
	  todos: []
  };
  users.push(user);

  return response.status(201).json(user);
  

});

app.get('/users', (request, response) => {
  const {user} = request;
  return response.json(users);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const{username} = request;
  return response.json(users.todos);

  //const dateFormat = new Date( date + " 00:00");
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline } = request.body;
  const{user} = request;

  const todos = {
    id: uuidv4(), // precisa ser um uuid
	title,
	done: false, 
	deadline: new Date(deadline + " 00:00"),
	created_at: new Date()
  }

  //const deadline = username.users.filter((deadline) => 
  //deadline.deadline.toDateString() === new Date (dateFormat).toDateString())
  
  user.users.push(todos);

  return response.status(201).send();

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;