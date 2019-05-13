import * as functions from 'firebase-functions';
// import * as twilio from 'twilio';
import * as crypto from 'crypto';
// const express = require('express');
// const app = express();

// // The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';
admin.initializeApp();

// app.get('/', (req, res) => {
//     const date = new Date();
//     const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
//     res.send(`
//       <!doctype html>
//       <head>
//         <title>Time</title>
//         <link rel="stylesheet" href="/style.css">
//         <script src="/script.js"></script>
//       </head>
//       <body>
//         <p>In London, the clock strikes:
//           <span id="bongs">${'BONG '.repeat(hours)}</span></p>
//         <button onClick="refresh(this)">Refresh</button>
//       </body>
//     </html>`);
// });

// app.get('/api', (req, res) => {
//     console.log('test')
//     const date = new Date();
//     const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
//     res.json({ bongs: 'BONG '.repeat(hours) });
// });

// exports.app = functions.https.onRequest(app);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

function makeid() {
    let text = "";
    const possible = "0123456789";

    for (let i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getToken() {
    return crypto.randomBytes(64).toString('hex');
}

export const getCode = functions.https.onRequest(async (request, response) => {
    console.log('verifyPhone');
    console.log('requestBody', request.body);
    if (request.body.phone) {
        console.log('phone', request.body.phone);
        const phoneNumber = request.body.phone;

        if (phoneNumber) {
            // const accountSid = 'AC8ae96350365ab0b81cfd01c912f1dead';
            // const authToken = '5c80c6304180c4cf4b9e50be78e88518';
            // const client = twilio(accountSid, authToken);
            const phoneCode = makeid();

            // await client.messages
            //     .create({
            //         body: `Code: ${phoneCode}`,
            //         from: '+16304746538',
            //         to: `+${phoneNumber}`
            //     });
            console.log('phoneCode', phoneCode);
            console.log('phoneNumber', phoneNumber);
            try {
                await admin.firestore().collection("codes").add({ phone: phoneNumber, code: phoneCode, isSignIn: false, token: '' });
                response.send(`SMS sended on phone number: ${phoneNumber}`);
            } catch (err) {
                console.log(err);
                response.status(500).send(`Error: ${err}`);
            }

            response.status(200).send('SMS sended!');
        }
    } else {
        response.status(500).send('Have not phone at request!');
    }
});

export const verifyPhone = functions.https.onRequest(async (request, response) => {
    console.log('verifyPhone');
    console.log('requestBody', request.body);
    if (request.body.code && request.body.phone) {
        console.log('phone', request.body.phone);
        console.log('code', request.body.code);
        const code = request.body.code
        const phone = request.body.phone
        console.log(phone, code, false)
        const codeDocs = await admin.firestore().collection("codes")
            .where("phone", "==", phone)
            .where("code", "==", code)
            .where("isSignIn", "==", false)
            .get()

        if (codeDocs.docs.length) {
            const token = getToken().trim();
            console.log('id', codeDocs.docs[0].id);

            try {
                await admin.firestore().collection("codes").doc(codeDocs.docs[0].id).update({
                    isSignIn: true,
                    token,
                });
            } catch (err) {
                response.header('Oops! Please contact us', err);
            }

            response.header('token', token);
        } else {
            response.status(500).send('Incorrect code number!');
        }
    } else {
        response.status(500).send('Have not phone or code at request!');
    }

    response.status(200).send(`Hello from Firebase! Code: ${request.body.code}. Phone: ${request.body.phone}`);
});

// const middleware = async function (req, res, next) {

//     const token = req.headers.token;

//     if (!token) {
//         throw new Error('Wrong credentials');
//     }
//     try {
//         const decodedIdToken = await admin.auth()
//             .verifyIdToken(token)
//         // admin.auth().getUser(decodedIdToken.uid);
//     } catch (err) {
//         throw new Error('Wrong credentials');
//     }

//     addAnswers(req, res, next);
// };


// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
export const addQuestion = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const phone = req.body.phone;

    // admin.auth()
    //     .verifyIdToken(accessToken)
    //     .then(decodedIdToken => {
    //         return firebaseAdmin.auth().getUser(decodedIdToken.uid);
    //     })
    //     .then(user => {
    //         // Do whatever you want with the user.
    //     });

    // // const { id } = await Questions.addQuestion(this.state.phoneNumber, this.state.questionText, url);
    console.log(phone)
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    // const snapshot = await admin.firestore..ref('/questions').push({ phone });
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    // res.redirect(303, snapshot.ref.toString());
    // Add a new document with a generated id.
    // const questionRef = await admin.firestore().collection("questions").add({ phone })
    // res.send(`Okay ${questionRef.id}`);
});

export const addAnswers = functions.https.onRequest(async (req, res) => {
    const questionId = req.body.questionId;
    const contacts = req.body.contacts;
    let validContacts = 0;

    // const document = await admin.firestore().collection("questions").doc(questionId);
    // console.log('document', document)
    for (const contact of contacts) {
        if (contact) {
            validContacts++;
            const data = {
                toPhone: contact,
                questionRef: await admin.firestore().doc('questions/' + questionId),
                text: '',
                image: '',
                // name: 'productName',
                // size: 'medium',
                // userRef: db.doc('users/' + firebase.auth().currentUser.uid)
            };
            // db.collection('products').add(data);
            // await document.collection("answers").add({toPhone: contact})
            // await admin.firestore().collection("answers").add({toPhone: contact, questionId})
            await admin.firestore().collection("answers").add(data)
        }
    }

    res.send(`${validContacts} answers created`);
});


// // Take the text parameter passed to this HTTP endpoint and insert it into the
// // Realtime Database under the path /messages/:pushId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into the Realtime Database using the Firebase Admin SDK.
//     const snapshot = await admin.database().ref('/messages').push({ original: original });
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     res.redirect(303, snapshot.ref.toString());
// });

// // Listens for new messages added to /messages/:pushId/original and creates an
// // uppercase version of the message to /messages/:pushId/uppercase
// exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
//     .onCreate((snapshot, context) => {
//         // Grab the current value of what was written to the Realtime Database.
//         const original = snapshot.val();
//         console.log('snapshot', snapshot);
//         console.log('Uppercasing', context.params.pushId, original);
//         const uppercase = original.toUpperCase();
//         // You must return a Promise when performing asynchronous tasks inside a Functions such as
//         // writing to the Firebase Realtime Database.
//         // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
//         return snapshot.ref.parent.child('uppercase').set(uppercase);
//     });
// // Take the text parameter passed to this HTTP endpoint and insert it into the
// // Realtime Database under the path /messages/:pushId/original
// exports.addNewQuestions = functions.https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const contacts = req.body.contacts;
//     const text = req.body.text;
//     const fromPhone = req.body.phone;
//     // Push the new message into the Realtime Database using the Firebase Admin SDK.
//     // for (const toPhone in contacts) {
//     console.log('add', contacts[0], fromPhone, text)
//     await admin.database().ref('/questions').push({ toPhone: contacts[0], fromPhone, text });
//     // await admin.database().ref('/questions').push({ toPhone, fromPhone, text });
//     // }
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     res.redirect(303, 'Questions created');
// });

// // // Listens for new messages added to /messages/:pushId/original and creates an
// // // uppercase version of the message to /messages/:pushId/uppercase
// // exports.makeUppercase = functions.database.ref('/questions/{pushId}/toPhone/fromPhone/text')
// //     .onCreate((snapshot, context) => {
// //         // Grab the current value of what was written to the Realtime Database.
// //         const original = snapshot.val();
// //         console.log('Uppercasing', context.params.pushId, original);
// //         // const uppercase = original.toUpperCase();
// //         // You must return a Promise when performing asynchronous tasks inside a Functions such as
// //         // writing to the Firebase Realtime Database.
// //         // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
// //         return snapshot.ref.parent;
// //         // return snapshot.ref.parent.child('uppercase').set(uppercase);
// //     });


// // const functions = require('firebase-functions');

// // // The Firebase Admin SDK to access the Firebase Realtime Database.
// // const admin = require('firebase-admin');
// // admin.initializeApp();
// // // [END import]

// // // [START addMessage]
// // // Take the text parameter passed to this HTTP endpoint and insert it into the
// // // Realtime Database under the path /messages/:pushId/original
// // // [START addMessageTrigger]
// // exports.addMessage = functions.https.onRequest(async (req, res) => {
// //     // [END addMessageTrigger]
// //     // Grab the text parameter.
// //     const original = req.query.text;
// //     // [START adminSdkPush]
// //     // Push the new message into the Realtime Database using the Firebase Admin SDK.
// //     const snapshot = await admin.database().ref('/messages').push({ original: original });
// //     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
// //     res.redirect(303, snapshot.ref.toString());
// //     // [END adminSdkPush]
// // });
// // // [END addMessage]

// // // [START makeUppercase]
// // // Listens for new messages added to /messages/:pushId/original and creates an
// // // uppercase version of the message to /messages/:pushId/uppercase
// // exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
// //     .onCreate((snapshot, context) => {
// //         // Grab the current value of what was written to the Realtime Database.
// //         const original = snapshot.val();
// //         console.log('Uppercasing', context.params.pushId, original);
// //         const uppercase = original.toUpperCase();
// //         // You must return a Promise when performing asynchronous tasks inside a Functions such as
// //         // writing to the Firebase Realtime Database.
// //         // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
// //         return snapshot.ref.parent.child('uppercase').set(uppercase);
// //     });
// // // [END makeUppercase]
// // // [END all]
// // // // Create and Deploy Your First Cloud Functions
// // // // https://firebase.google.com/docs/functions/write-firebase-functions
// // //
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
// });

// exports.test = functions.https.onRequest(async (req, res) => {
//     // // Grab the text parameter.
//     // const contacts = req.body.contacts;
//     // const text = req.body.text;
//     console.log('req', req)
//     console.log('req.body', req.body)
//     console.log('req.body.phone', req.body.phone)
//     // const fromPhone = req.body.phone;
//     // // Push the new message into the Realtime Database using the Firebase Admin SDK.
//     // // for (const toPhone in contacts) {
//     //     console.log('add', contacts[0], fromPhone, text)
//     //     await admin.database().ref('/questions').push({ toPhone: contacts[0], fromPhone, text });
//     //     // await admin.database().ref('/questions').push({ toPhone, fromPhone, text });
//     // // }
//     // // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     // res.redirect(303, 'Questions created');
//     res.send(`req.body ${req.body.phone}`);
// });

// exports.createUser = functions.firestore
//     .document('users/{userId}')
//     .onCreate((snap, context) => {
//         // Get an object representing the document
//         // e.g. {'name': 'Marie', 'age': 66}
//         const newValue = snap.data();

//         // access a particular field as you would any JS property
//         const name = newValue.name;

//         // perform desired operations ...
//     });

// export const addAnswers = functions.https.onRequest(async (req, res) => {
//     const questionId = req.body.questionId;
//     const contacts = req.body.contacts;
//     let validContacts = 0;

//     // const document = await admin.firestore().collection("questions").doc(questionId);
//     // console.log('document', document)
//     for (const contact of contacts) {
//         if (contact) {
//             validContacts++;
//             // await document.collection("answers").add({toPhone: contact})
//             // await admin.firestore().collection("answers").add({toPhone: contact, questionId})
//             await admin.firestore().collection("answers").add({toPhone: contact, question: `questions/${questionId}`})
//         }
//     }

//     res.send(`${validContacts} answers created`);
// });

export const createQuestion = functions.firestore
    .document('questions/{questionId}')
    .onCreate((snap, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue: any = snap.data();

        // access a particular field as you would any JS property
        const fromPhone = newValue.fromPhone;
        console.log('newValue', newValue)
        console.log('questionId', fromPhone)
        return snap.ref.parent;
        // perform desired operations ...
    });
// export const createUser = functions.firestore
//     .document('users/{userId}')
//     .onCreate((snap, context) => {
//         // Get an object representing the document
//         // e.g. {'name': 'Marie', 'age': 66}
//         const newValue: any = snap.data();

//         // access a particular field as you would any JS property
//         const name = newValue.name;
//         console.log('name', name)
//         // perform desired operations ...
//     });

// exports.createQuestion = functions.firestore
//     .document('questions/{questionId}')
//     .onCreate((snap, context) => {
//         // Get an object representing the document
//         // e.g. {'name': 'Marie', 'age': 66}
//         // console.log('context', context)
//         // console.log('context', context.req)
//         // console.log('context', context.req.body)
//         const newValue = snap.data();

//         // access a particular field as you would any JS property
//         const name = newValue.name;

//         // perform desired operations ...
//     });
