/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID. 
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */

  const express = require('express');
  const fs = require('fs');
  const path = require('path');
  const app = express();
  const port = 3000
  const bodyParser = require('body-parser');
  
  app.use(bodyParser.json());
  
  // For finding the Index of a particular TODO
  function findIndex(arr,requiredId) {
    for(let i = 0 ; i < arr.length ; i++){
      if(arr[i].id === requiredId){
        return i;
      }
    }
    return -1;
  }
  
  // Handler for getting all the TODOs
  app.get('/todos', (req, res) => {
    fs.readFile('todos.json','utf-8', (err,data) => {
        if(err) throw err;
        else res.json(JSON.parse(data));
    })
  })
  
  // Handler for getting the TODO with specific id
  app.get('/todos/:id', (req, res) => {
    fs.readFile('todos.json','utf-8', (err,data) => {
        if(err) throw err;
        else{
            let arr = JSON.parse(data);
            let ID = parseInt(req.params.id);
            let Index = findIndex(arr,ID);
            if(Index === -1){
                res.status(400).send(`Todo with ${ID} do not exist!`);
            }
            else{
                let requiredTodo = {
                    title : arr[Index].title,
                    desc : arr[Index].desc
                }
                res.json(requiredTodo);
            }
        }
    })
    })
  
  // Handler for posting new TODOs
  app.post('/todos', (req, res) => {
    let obj = {
      id : Math.floor(Math.random() * 1000),
      title : req.body.title,
      desc : req.body.desc
    };
    fs.readFile('todos.json', 'utf-8', (err,data) => {
      if(err) throw err;
      let arr = JSON.parse(data);
      arr.push(obj);
      fs.writeFile('todos.json', JSON.stringify(arr) , (err) => {
          if (err) throw err;
        });
      res.send("Your ToDo task is added!");
    });
  })
  
  // Handler for updating the TODO with specific id
  app.put('/todos/:id', (req, res) => {
    fs.readFile('todos.json','utf-8', (err,data) => {
      if(err) throw err;

      let arr = JSON.parse(data);
      let ID = parseInt(req.params.id);
      let Index = findIndex(arr,ID);
  
      if(Index === -1){
        res.status(404).send(`Todo with ${ID} is not present!`);
      }
      else{
        let newTitle = req.body.title; 
        let newDesc = req.body.desc;
        arr[Index].title = newTitle;
        arr[Index].desc = newDesc;
        fs.writeFile('todos.json', JSON.stringify(arr) , (err) => {
          if(err) throw err;
          res.send(`Todo with ${ID} is updated!`);
        });
      }
    });
  })
  
  // Handler for deleting the TODO with a specific id
  app.delete('/todos/:id', (req, res) => {
    fs.readFile('todos.json','utf-8',(err,data) => {
      let arr = JSON.parse(data);
      let ID = parseInt(req.params.id);
      let indexToDelete = findIndex(arr,ID);
      if(indexToDelete === -1){
        res.status(404).send(`Todo with ${ID} is not present!`);
      }
      else{
        arr.splice(indexToDelete, 1);
        fs.writeFile('todos.json',JSON.stringify(arr), (err) => {
          if(err) throw err;
          res.send(`Todo with ${ID} is deleted now!`);
        });
      }
    });
  })

  // Serving frontend file the backend to avoid CORS error.
  app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname , "index.html"));
  });
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  // To handle all the undefined route. we introduced custom middleware.
  app.use((req, res, next) => {
    res.status(404).send();
  });
  
  module.exports = app;
  
  
  