// import { Middleware } from '../middleware';
// import { Questions, Answers } from '../services';
const express = require('express');
const app = express();
const cors = require('cors')({ origin: true });

app.use(cors);

// Automatically allow cross-origin requests
// app.use(cors({ origin: true }));
// const keystone = require('@eklogvinov/keystone')

import { QuestionsRouter, AnswersRouter, CodesRouter, HelperRouter, UsersRouter, errorHandler } from './lib';
// const middlewareRouter = require('./lib/middleware')
// const userRouter = require('./others/user')
// const shopRouter = require('./shop/shop')

// const restful = require('restful-keystone')(keystone, {
//     root: '/api/v1'
// })

// keystone.pre('routes', middlewareRouter.initLocals)
// app.all('/api/v1/*', keystone.middleware.cors)
app.options('/v1/*', (req: any, res: any) => {
    res.sendStatus(200)
})
app.use('/v1/questions', QuestionsRouter)
app.use('/v1/answers', AnswersRouter)
app.use('/v1/security', CodesRouter)
app.use('/v1/users', UsersRouter)
app.use('/v1/helper', HelperRouter)
app.use(errorHandler)


export default app;

// export default function (app: any) {
//     // app.all('/api/v1/*', keystone.middleware.cors)

//     app.options('/api/v1/*', (req: any, res: any) => {
//         res.sendStatus(200)
//     })

//     // app.use('/api/v1/security', securityRouter)
//     // app.use('/api/v1/users', userRouter)
//     // app.use('/api/v1/shop', shopRouter)
//     app.use('/api/v1/shop/baskets',
//         async (req: any, res: any) => {
//             try {
//                 // const { page, size, identifier, updatedAt, friendIds } = req.query
//                 // const baskets = await basketService.getBaskets({ page, size, token: req.headers.authorization })

//                 res.status(200).send('baskets')
//             } catch (e) {
//                 // if (e instanceof WebError) {
//                 //     console.log(e)
//                     res.status(e.status).send(e.message)
//                 // } else {
//                 //     console.log(e)
//                 //     res.status(500).send(e.message)
//                 // }
//             }
//         })

//     // app.use(middlewareRouter.errorHandler)

//     // app.get('/', (req: any, res: any) => {
//     //     res.redirect('/keystone/')
//     // })
// }