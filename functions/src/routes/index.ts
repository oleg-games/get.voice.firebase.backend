const Cors = require("cors");
const express = require("express");
import { QuestionsRouter, AnswersRouter, SecurityRouter, HelperRouter, UsersRouter, StorageRouter } from './lib';
import { errorHandler } from '../middleware';
const app = express().use(Cors({ origin: true }));

app.options('/v1/*', (req: any, res: any) => {
    res.sendStatus(200)
})

app.use((req: any, res: any, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', '*');  // enables all the methods to take place
    return next();
});

// app.use(logger('dev'));
// app.use('/uploads', express.static('uploads'));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/questions', QuestionsRouter)
app.use('/v1/answers', AnswersRouter)
app.use('/v1/security', SecurityRouter)
app.use('/v1/users', UsersRouter)
app.use('/v1/helper', HelperRouter)
app.use('/v1/storage', StorageRouter)
app.use(errorHandler);

export default app;