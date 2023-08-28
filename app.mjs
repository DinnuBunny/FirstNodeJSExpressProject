import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import {format} from 'date-fns'

let  result = new Date()
result = format(result, "PPP h:m:ss")
console.log(result);

const app = express();

app.get('/', (req, res) => {
  res.send({date : result});
});


app.get('/login', (req, res) => {
  res.send("Login Page");
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});

export default app;