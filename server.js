import dotenv from 'dotenv';
import express, { json } from 'express';
import router from './routes/index.js';

const app = express();
const port = process.env.PORT || 8080;

dotenv.config();

app.use(json());
app.use(router);

app.get('/', (_, res) => {
  res.send('Hello Scraper');
});

app.listen(port, () => {
  console.log(`App listening at ${port} port`);
});
