import express from 'express';
import 'dotenv/config';

import databaseService from './services/database.services';
import defaultErrorHandler from './middlewares/error.middlewares';
import userRouter from './routes/users.routes';
import taskRouter from './routes/tasks.routes';

const app = express();
app.use(express.json());
databaseService.connect();

app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.use(defaultErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
