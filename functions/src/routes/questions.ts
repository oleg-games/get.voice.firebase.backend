// // import { Middleware } from '../middleware';
// // import { Questions, Answers } from '../services';
// const express = require('express');
// const app = express();
// const cors = require('cors')({origin: true});
// app.use(cors);

// // Automatically allow cross-origin requests
// // app.use(cors({ origin: true }));

// // Add middleware to authenticate requests
// // app.use(myMiddleware);

// // build multiple CRUD interfaces:
// app.get('/:id', (req: any, res: any) => res.send('get'));
// app.post('/', (req: any, res: any) => res.send('post'));
// app.put('/:id', (req: any, res: any) => res.send('put'));
// app.delete('/:id', (req: any, res: any) => res.send('delete'));
// app.get('/', (req: any, res: any) => res.send('Widgets.list()'));
// // app.get('/:id', (req: any, res: any) => res.send(Widgets.getById(req.params.id)));
// // app.post('/', (req: any, res: any) => res.send(Widgets.create()));
// // app.put('/:id', (req: any, res: any) => res.send(Widgets.update(req.params.id, req.body)));
// // app.delete('/:id', (req: any, res: any) => res.send(Widgets.delete(req.params.id)));
// // app.get('/', (req: any, res: any) => res.send(Widgets.list()));
// export const questions = functions.https.onRequest(app);


// // /**
// //  * Questions handler
// //  */
// // export default class QuestionsHandler {

// //     /**
// //      * Add new question
// //      *
// //      * @param req request
// //      * @param res response
// //      */
// //     static async put(req: any, res: any) {

// //         // // Grab the text parameter.
// //         const phone = await Middleware.getPhoneByTokenFromRequestFirebase(req);
// //         // const phone: any = await getPhoneByTokenFromRequest(req);
// //         const text = req.body.text;
// //         const url = req.body.url;
// //         const contacts = req.body.contacts;
// //         console.log('phone', phone)
// //         console.log('text', text)
// //         console.log('url', url)
// //         console.log('contacts', contacts)

// //         // console.log('code', code)
// //         // console.log('code.phone', code.phone)
// //         const questionRef = await Questions.addQuestion(phone, text, url);
// //         console.log('questionId' + questionRef.id);

// //         // const questionId = req.body.questionId;
// //         let validContacts = 0;

// //         // // const document = await admin.firestore().collection("questions").doc(questionId);
// //         // // console.log('document', document)
// //         // for (const contact of contacts) {
// //         for (const contact of contacts.splice(contacts.length - 2)) {
// //             if (contact) {
// //                 validContacts++;
// //                 const data = {
// //                     toPhone: contact,
// //                     questionRef: questionRef,
// //                     // questionRef: await Questions.getQuestion(questionId),
// //                     // questionRef: await admin.firestore().doc('questions/' + questionId),
// //                     text: '',
// //                     image: '',
// //                     // name: 'productName',
// //                     // size: 'medium',
// //                     // userRef: db.doc('users/' + firebase.auth().currentUser.uid)
// //                 };
// //                 // db.collection('products').add(data);
// //                 // await document.collection("answers").add({toPhone: contact})
// //                 // await admin.firestore().collection("answers").add({toPhone: contact, questionId})
// //                 await Answers.addAnswer(data)
// //             }
// //         }
// //         // // Push the new message into the Realtime Database using the Firebase Admin SDK.
// //         // // const snapshot = await admin.firestore..ref('/questions').push({ phone });
// //         // // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
// //         // // res.redirect(303, snapshot.ref.toString());
// //         // // Add a new document with a generated id.
// //         // // const questionRef = await admin.firestore().collection("questions").add({ phone })
// //         // // res.send(`Okay ${questionRef.id}`);
// //         res.status(200).send(`Answers ${validContacts} created`)
// //     }

// //     static async get(req: any, res: any) {

// //         // // Grab the text parameter.
// //         const phone = await Middleware.getPhoneByTokenFromRequestFirebase(req);
// //         // const phone: any = await getPhoneByTokenFromRequest(req);
// //         const id = req.params;

// //         console.log('phone', phone)
// //         console.log('req.params', req.params.id)
// //         console.log('req', req)
// //         console.log('req', req.query)
// //         console.log('id', id)

// //         // // console.log('code', code)
// //         // // console.log('code.phone', code.phone)
// //         // const questionRef = await Questions.addQuestion(phone, text, url);
// //         // console.log('questionId' + questionRef.id);

// //         // // const questionId = req.body.questionId;
// //         // let validContacts = 0;

// //         // // // const document = await admin.firestore().collection("questions").doc(questionId);
// //         // // // console.log('document', document)
// //         // // for (const contact of contacts) {
// //         // for (const contact of contacts.splice(contacts.length - 2)) {
// //         //     if (contact) {
// //         //         validContacts++;
// //         //         const data = {
// //         //             toPhone: contact,
// //         //             questionRef: questionRef,
// //         //             // questionRef: await Questions.getQuestion(questionId),
// //         //             // questionRef: await admin.firestore().doc('questions/' + questionId),
// //         //             text: '',
// //         //             image: '',
// //         //             // name: 'productName',
// //         //             // size: 'medium',
// //         //             // userRef: db.doc('users/' + firebase.auth().currentUser.uid)
// //         //         };
// //         //         // db.collection('products').add(data);
// //         //         // await document.collection("answers").add({toPhone: contact})
// //         //         // await admin.firestore().collection("answers").add({toPhone: contact, questionId})
// //         //         await Answers.addAnswer(data)
// //         //     }
// //         // }
// //         // // // Push the new message into the Realtime Database using the Firebase Admin SDK.
// //         // // // const snapshot = await admin.firestore..ref('/questions').push({ phone });
// //         // // // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
// //         // // // res.redirect(303, snapshot.ref.toString());
// //         // // // Add a new document with a generated id.
// //         // // // const questionRef = await admin.firestore().collection("questions").add({ phone })
// //         // // // res.send(`Okay ${questionRef.id}`);
// //         res.status(200).send(`id`)
// //         // res.status(200).send(`Answers ${validContacts} created`)
// //     }
// // }