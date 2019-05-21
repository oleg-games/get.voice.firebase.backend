const express = require('express')
import { Users } from '../../services';
import { WebError } from '../../errors';
import { authenticate } from '../../middleware';

const router = express.Router();

router.get('/:phone', authenticate(), async (req: any, res: any) => {
    console.log('/:phone')
    try {
        const { phone } = req.params;

        if (!phone) {
            throw new WebError('Please fill phone');
        }

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
