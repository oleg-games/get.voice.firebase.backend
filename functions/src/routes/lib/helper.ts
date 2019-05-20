const express = require('express')
import { FirestoreHelper } from '../../services';
import { WebError } from '../../errors';
import { authenticate } from './middleware';

const router = express.Router()

router.post('/fill', authenticate(), async (req: any, res: any) => {
    try {
        const { phone } = req.body.code;

        if (!phone) {
            throw new WebError('Have not phone at request', 500);
        }

        console.log('phone', phone);

        try {
            await FirestoreHelper.fillData(phone);
            res.send(`Filled data`);
        } catch (err) {
            console.log(err);
            throw new WebError(`Error: ${err}`, 500);
        }
    } catch (e) {
        console.log(e);
        throw new WebError('Problem when add question. Please contact us', 500);
    }
})

export default router;