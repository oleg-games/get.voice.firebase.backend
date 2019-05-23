const express = require('express')
import { Users, Security } from '../../services';
import { WebError } from '../../errors';
import { authenticate } from '../../middleware';

const router = express.Router();

router.get('/', authenticate(), async (req: any, res: any) => {
    console.log('/')
    try {
        const phone: any = await Security.getPhoneByTokenFromRequest(req);
        const user = await Users.getByPhone(phone);

        if (user) {
            res.send(user);
        } else {
            res.send({});
        }
    } catch (e) {
        throw new WebError('Problem when get question. Please contact us');
    }
})

export default router;
