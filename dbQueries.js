const format = require("date-fns/format");

//Where Clause to get all states with filter
function whereClauseStates(queryParamObject) {
  let clause = "";
  if (Object.keys(queryParamObject).length !== 0) {
    clause = "WHERE";
    Object.keys(queryParamObject).forEach(function (key) {
      //   console.log(key + ": " + queryParamObject[key]);
      if (key === "search_q") {
        clause += ` todo LIKE '%${queryParamObject[key]}%' AND`;
      } else if (key === "date") {
        const dueDate = dateFormatter(queryParamObject[key]);
        clause += ` due_date = '${dueDate}' AND`;
      } else {
        clause += ` ${key} LIKE '${queryParamObject[key]}' AND`;
      }
    });
    clause = clause.substring(0, clause.length - 3);
    console.log(clause);
    return clause;
  }
  return clause;
}

// Date Formatter Function
function dateFormatter(dueDate) {
  const date = new Date(dueDate);
  const formattedDate = format(date, "yyyy-LL-dd");
  return formattedDate;
}

// API 1 API 3
exports.getTodoByFilterQuery = (queryParamObject) => {
  const clause = whereClauseStates(queryParamObject);
  const query = `
  SELECT 
    id, todo, priority, status, category, due_date as dueDate
  FROM
    todo
  ${clause}
  ORDER BY id;
  `;
  console.log(query);
  return query;
};

// API 2
exports.getTodoQuery = (todoId) => {
  return `
    SELECT 
       id, todo, priority, status, category, due_date as dueDate
    FROM
        todo
    WHERE
        id = ${todoId}; 
    `;
};

// API 4
exports.addTodoQuery = (todoObject) => {
  let { id, todo, priority, status, category, dueDate } = todoObject;
  dueDate = dateFormatter(dueDate);
  return `
    INSERT INTO todo
        (id, todo, priority, status, category, due_date)
    VALUES(
        ${id},
        '${todo}',
        '${priority}',
        '${status}',
        '${category}',
        '${dueDate}'
        );
    `;
};

// Set Clause Function
function setClause(setObject) {
  let clause = "";
  if (setObject !== undefined) {
    Object.keys(setObject).forEach(function (key) {
      if (key === "dueDate") {
        const dueDate = dateFormatter(setObject[key]);
        clause += ` due_date = '${dueDate}',`;
      } else {
        clause += ` ${key} = "${setObject[key]}",`;
      }
    });
    clause = clause.substring(0, clause.length - 1);
    return clause;
  }
  return clause;
}

// API 5
exports.updateTheTodo = (todoId, todoObject) => {
  const clauseSet = setClause(todoObject);
  const updateQuery = `
    UPDATE
        todo
    SET
        ${clauseSet}
    WHERE
        id = ${todoId};
    `;
  return updateQuery;
};

// API 6
exports.deleteTodo = (todoId) => {
    console.log(todoId)
  return `
    DELETE FROM
        todo
    WHERE
        id = ${todoId};
    `;
};
