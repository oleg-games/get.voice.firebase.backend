const express = require('express')
import { Users } from '../../services';
import { WebError } from '../../errors';
import { authenticate } from './middleware';

const router = express.Router()

router.get('/:phone', authenticate(), async (req: any, res: any) => {
    try {
        const { phone } = req.params;

        if (!phone) {
            throw new WebError('Please fill phone', 500);
        }

        const user = await Users.getByPhone(phone);

        if (user) {
            res.send(user);
        } else {
            res.send({});
        }
    } catch (e) {
        throw new WebError('Problem when get question. Please contact us', 500);
    }
})

export default router;
