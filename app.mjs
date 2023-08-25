import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
// import addDays from "date-fns/addDays";

// const result = addDays(new Date(2000, 0, 20))
// console.log(result);

const app = express();

app.get('/', (req, res) => {
  res.send("Hello World");
});


app.get('/login', (req, res) => {
  res.send("Login Page");
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});

export default app;