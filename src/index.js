const express = require('express');
const { request, response } = require("express");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  const user = users.find(user => user.username === username);

  if(!user) {
    return response.status(404).json({error: 'Mensagem do erro'})
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
  //const {user} = request;
  return response.json(users);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const{user} = request;
  return response.json(user.todos);

  //const dateFormat = new Date( date + " 00:00");
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline } = request.body;
  const{user} = request;

  const todo = {
    id: uuidv4(), // precisa ser um uuid
	title,
	done: false, 
	deadline: new Date(deadline), //+ " 00:00"
	created_at: new Date()
  }

  //const deadline = username.users.filter((deadline) => 
  //deadline.deadline.toDateString() === new Date (dateFormat).toDateString())
  
  //colocar o banco user do campo todos dentro da rota todos
  user.todos.push(todo);

  return response.status(201).json(todo);

});
//A rota deve receber, pelo header da requisição, uma propriedade username contendo o username do usuário e 
//receber as propriedades title e deadline dentro do corpo. 
//É preciso alterar apenas o title e o deadline da tarefa que possua o id igual ao id presente nos parâmetros da rota.
//é necessário atualizar um todo existente, recebendo o title e o deadline pelo corpo da requisição e o id presente nos parâmetros da rota.
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {title,deadline} = request.body;
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find((todo) => todo.id === id);
  //const idAlreadyExists = users.some((user) => user.id ===id);
  if(!todo){
    return response.status(404).json({error: 'Mensagem do erro'});

  }
 //todos ={
 
 //}
 todo.title = title;
 todo.deadline = new Date(deadline);

  return response.status(201).json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
  const {user} = request;
  const {id} = request.params;

  const todo = user.todos.find((todo) => todo.id === id);
  
  //const idAlreadyExists = users.some((user) => user.id ===id);
  if(!todo){
    return response.status(404).json({error: 'Mensagem do erro'});

  }
 
  todo.done = true;
 
  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if(todoIndex === -1){
    return response.status(404).json({error: 'Mensagem do erro'});
  }
  user.todos.splice(todoIndex, 1);
  

  return response.status(204).send();


});

module.exports = app;