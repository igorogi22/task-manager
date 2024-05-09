# Task Manager

This project is a simple task manager, with the aim of practicing basic concepts of node, api's and streams.

### To Teste It Locally

- Run `npm install` to install all the necessary dependencies.
- Run `npm run start` to run the application.

#### Routes

`POST` **/tasks** <br>
*Insert a task in database or import a csv of tasks* <br>
Params:
```ts
    {
        title: string;
        description: string;
    }
```
Import file:
`content: multiplataform-data`<br>
*Example of file to import: [exampleToimport.csv](./exampleToImport.csv)*

`GET` **/tasks/:id** <br>
*Get a task by id*

`GET` **/tasks** <br>
*Get all tasks*

`PUT` **/tasks/:id** <br>
*Update a task by id* <br>
Params:
```ts
    {
        title?: string;
        description?: string;
    }
```

`PATCH` **/tasks/:id/complete** <br>
*Marks a task as completed*

`DELETE` **/tasks/:id** <br>
*Remove a task by id*

### To Run Tests

- Run `npm run test` to run jest tests.

### Nex Steps

- [ ] Add validation to values to update task.
- [ ] Add tests to routes
- [ ] Separate the file process of json middleware.