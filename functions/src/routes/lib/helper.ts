const express = require('express')
import { FirestoreHelper, Security } from '../../services';
import { WebError } from '../../errors';
import { authenticate } from '../../middleware';

const router = express.Router()

router.post('/fill', authenticate(), async (req: any, res: any) => {
    console.log('/fill')
    try {
        const phone: any = await Security.getPhoneByTokenFromRequest(req);

        if (!phone) {
            throw new WebError('Have not phone at request');
        }

        console.log('phone', phone);

        try {
            await FirestoreHelper.fillData(phone);
            res.send(`Filled data`);
        } catch (err) {
            console.log(err);
            throw new WebError(`Error: ${err}`);
        }
    } catch (e) {
        console.log(e);
        throw new WebError('Problem when add question. Please contact us');
    }
})

export default router;