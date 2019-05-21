const express = require('express');
const app = express();
const cors = require('cors')({ origin: true });
import { QuestionsRouter, AnswersRouter, SecurityRouter, HelperRouter, UsersRouter } from './lib';
import { errorHandler } from '../middleware';
app.use(cors);

app.options('/v1/*', (req: any, res: any) => {
    res.sendStatus(200)
})
app.use('/v1/questions', QuestionsRouter)
app.use('/v1/answers', AnswersRouter)
app.use('/v1/security', SecurityRouter)
app.use('/v1/users', UsersRouter)
app.use('/v1/helper', HelperRouter)
app.use(errorHandler)

export default app;