import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import {format} from 'date-fns'
const app = express();

app.use(cors({
  origin : '*',
  methods: [ "GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
  }
))

let  result = new Date()
result = format(result, "PPP h:m:ss")


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