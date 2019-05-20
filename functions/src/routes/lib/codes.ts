const express = require('express')

import { Codes, Auth } from '../../services';
import { WebError } from '../../errors';
import { authenticate } from './middleware';
import * as crypto from 'crypto';
// import * as twilio from 'twilio';

const router = express.Router()

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

router.post('/code', authenticate(), async (req: any, res: any) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            throw new WebError('Have not phone at request', 500);
        }

        console.log('phone', phone);

        // const accountSid = 'AC8ae96350365ab0b81cfd01c912f1dead';
        // const authToken = '5c80c6304180c4cf4b9e50be78e88518';
        // const client = twilio(accountSid, authToken);
        const code = makeid();

        // await client.messages
        //     .create({
        //         body: `Code: ${phoneCode}`,
        //         from: '+16304746538',
        //         to: `+${phoneNumber}`
        //     });
        console.log('code', code);
        console.log('phone', phone);
        try {
            await Codes.add({ phone, code, isSignIn: false, token: '' });
            res.send(`SMS sended on phone number: ${phone}`);
        } catch (err) {
            console.log(err);
            throw new WebError(`Error: ${err}`, 500);
        }

    } catch (e) {
        console.log(e);
        throw new WebError('Problem when add question. Please contact us', 500);
    }
})

router.post('/code-firebase', async (req: any, res: any) => {
    try {
        const { phone, captchaVerifier } = req.body;

        if (!phone) {
            throw new WebError('Have not phone at request', 500);
        }

        console.log('phone', phone);
        console.log('captchaVerifier', captchaVerifier);

        try {
            const confirmationResult = await Auth.signInWithPhone(phone, captchaVerifier)
            res.send(confirmationResult);
        } catch (err) {
            console.log(err);
            throw new WebError(`Error: ${err}`, 500);
        }

    } catch (e) {
        console.log(e);
        throw new WebError('Problem when add question. Please contact us', 500);
    }
})

router.post('/verify', authenticate(), async (req: any, res: any) => {
    const { phone, code } = req.body.code;

    if (!phone) {
        throw new WebError('Please fill phone', 500);
    }

    if (!code) {
        throw new WebError('Please fill code', 500);
    }

    try {
        console.log(phone, code)
        const codeDocs: any = await Codes.getByPhoneByCodeNotSighIn(phone, code)
        console.log(codeDocs.docs.length)

        if (codeDocs.docs.length) {
            const token = getToken().trim();
            console.log('id', codeDocs.docs[0].id);

            try {
                await Codes.update(codeDocs.docs[0].id, {
                    isSignIn: true,
                    token,
                });
            } catch (err) {
                res.header('Oops! Please contact us', err);
            }

            res.header('token', token);
        } else {
            throw new WebError('Incorrect code number!', 401);
        }

        res.send(`Hello from Firebase! Code: ${req.body.code}. Phone: ${req.body.phone}`);
    } catch (e) {
        throw new WebError(`Problem when get answers by phone. Phone ${phone}`, 500);
    }
})

export default router;