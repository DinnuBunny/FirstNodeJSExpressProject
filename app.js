const cors = require('cors');
const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbQueries = require("./dbQueries");
const format = require("date-fns/format");

// Valid Lists
const priorityList = [`HIGH`, `MEDIUM`, `LOW`];
const statusList = [`TO DO`, `IN PROGRESS`, `DONE`];
const categoryList = [`WORK`, `HOME`, `LEARNING`];

const port = process.env.PORT || 3005;

const app = express();
app.use(express.json());
app.use(cors({
  origin : '*',
  methods: [ "GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
  }
))

let db;
let dbPath = path.join(__dirname, "myDatabase.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(port, () => {
      console.log(`Server up and Running on http://localhost:${port}/`);
    });
  } catch (error) {
    console.error(`DB or Server error : ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


app.get('/', (req, res) => {
  res.send({date : "Todays Date"});
});


app.get('/login', (req, res) => {
  res.send("Login Page");
});



const checkingValidUpdates = (request, response, next) => {
  let updateObject = request.body;
  let isValidParameters = false;
  console.log(`request.body = ${JSON.stringify(updateObject)}`);
  if (Object.keys(updateObject).length === 0) {
    updateObject = request.query;
    console.log(`request.body = ${JSON.stringify(updateObject)}`);
    isValidParameters = true;
  }
  const keysList = Object.keys(updateObject);
  for (let key of keysList) {
    const value = updateObject[key];
    if (key === "todo" || key === "search_q") {
      request.updateKey = "Todo";
      isValidParameters = true;
    } else if (key === "status") {
      if (statusList.includes(value)) {
        request.updateKey = "Status";
        isValidParameters = true;
      } else {
        isValidParameters = false;
        response.status(400);
        response.send("Invalid Todo Status");
        return;
      }
    } else if (key === "priority") {
      if (priorityList.includes(value)) {
        request.updateKey = "Priority";
        isValidParameters = true;
      } else {
        isValidParameters = false;
        response.status(400);
        response.send("Invalid Todo Priority");
        return;
      }
    } else if (key === "category") {
      if (categoryList.includes(value)) {
        request.updateKey = "Category";
        isValidParameters = true;
      } else {
        isValidParameters = false;
        response.status(400);
        response.send("Invalid Todo Category");
        return;
      }
    } else if (key === "dueDate" || key === "date") {
      try {
        const date = new Date(value);
        const formattedDate = format(date, "yyyy-LL-dd");
        request.updateKey = "Due Date";
        isValidParameters = true;
      } catch (error) {
        isValidParameters = false;
        response.status(400);
        response.send("Invalid Due Date");
        console.log(error.message);
        return;
      }
    }
  }

  if (isValidParameters) {
    next();
  }
};

// API 1
app.get("/todos/", checkingValidUpdates, async (request, response) => {
  const queryParamObject = request.query;
  const todosData = await db.all(
    dbQueries.getTodoByFilterQuery(queryParamObject)
  );
  response.send(todosData);
});

// API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoData = await db.get(dbQueries.getTodoQuery(todoId));
  response.send(todoData);
});

// API 3
app.get("/agenda/", checkingValidUpdates, async (request, response) => {
  const queryParamObject = request.query;
  const todosData = await db.all(
    dbQueries.getTodoByFilterQuery(queryParamObject)
  );
  response.send(todosData);
});

// API 4 Add Todo
app.post("/todos/", checkingValidUpdates, async (request, response) => {
  const todoObject = request.body;
  const todoId = todoObject.id;
  const dbUser = await db.get(dbQueries.getTodoQuery(todoId));
  console.log("Hello Post Method")
  if (dbUser === undefined) {
    await db.run(dbQueries.addTodoQuery(todoObject));
    response.send("Todo Successfully Added");
  } else {
    response.status(400);
    response.send("Todo Id already exist");
  }
});

// API 5 Update the Todo
app.put("/todos/:todoId/", checkingValidUpdates, async (request, response) => {
  const { todoId } = request.params;
  const todoObject = request.body;
  await db.run(dbQueries.updateTheTodo(todoId, todoObject));
  response.send(`${request.updateKey} Updated`);
});

// API 6 Delete ToDo
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = dbQueries.deleteTodo(todoId);
  console.log(deleteQuery);
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;