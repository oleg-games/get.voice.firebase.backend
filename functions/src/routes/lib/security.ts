const express = require('express')

import { Codes, Users } from '../../services';
import { WebError } from '../../errors';
import * as crypto from 'crypto';
// import * as twilio from 'twilio';

const router = express.Router()

function makeid() {
    let text = "";
    const possible = "0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getToken() {
    return crypto.randomBytes(64).toString('hex');
}

router.post('/code', async (req: any, res: any, next: any) => {
    console.log('/code')
    try {
        const { phone } = req.body;

        if (!phone) {
            throw new WebError('Have not phone at request');
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
        await Codes.add({ phone, code, isSignIn: false, token: '' });
        res.send({ phone, code });
    } catch (e) {
        console.log(e);
        next(e);
    }
})

router.post('/verify', async (req: any, res: any, next: any) => {
    console.log('/verify')
    const { phone, code } = req.body;
    try {
        if (!phone) {
            throw new WebError('Please fill phone');
        }

        if (!code) {
            throw new WebError('Please fill code');
        }

        console.log(phone, code)
        const codeDocs: any = await Codes.getByPhoneByCodeNotSighIn(phone, code)
        console.log(codeDocs.docs.length)

        if (codeDocs.docs.length) {
            const token = getToken().trim();
            console.log('id', codeDocs.docs[0].id);

            await Codes.update(codeDocs.docs[0].id, {
                isSignIn: true,
                token,
            });

            if (phone) {
                let userInDb = await Users.getByPhone(phone);

                if (!userInDb) {
                    const user = {
                        phone: phone,
                        smsInvite: true,
                        inSystem: true,
                    }

                    userInDb = await Users.add(user);
                }

                res.header('token', token);
                res.send({
                    user: await Users.get(userInDb.id),
                    code: req.body.code,
                    phone: req.body.phone
                });
            } else {
                throw new WebError('Incorrect code number!', 401);
            }
        } else {
            throw new WebError('Incorrect code number!', 401);
        }
    } catch (e) {
        next(e)
    }
})

export default router;