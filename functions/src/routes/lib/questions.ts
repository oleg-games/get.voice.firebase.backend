const express = require('express')
import { Questions, Answers } from '../../services';
import { WebError } from '../../errors';
import { authenticate } from '../../middleware';

const router = express.Router()

router.get('/:id', authenticate(), async (req: any, res: any) => {
    console.log('/:id')
    try {
        const { id } = req.params;

        if (!id) {
            throw new WebError('Please fill question id');
        }

        const questionRef = await Questions.get(id);

        if (questionRef && questionRef.exists) {
            res.send({ ...questionRef.data(), id: questionRef.id });
        } else {
            res.send({});
        }
    } catch (e) {
        throw new WebError('Problem when get question. Please contact us');
    }
})

router.get('/:phone/all', authenticate(), async (req: any, res: any) => {
    console.log('/:phone/all')
    const { phone } = req.params;

    if (!phone) {
        throw new WebError('Please fill phone');
    }

    try {
        const questionsSnapshot = await Questions.getByPhone(phone);
        res.send(questionsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (e) {
        throw new WebError(`Problem when get questions by phone. Phone ${phone}`);
    }
})

router.post('/', authenticate(), async (req: any, res: any) => {
    try {
        console.log('/')
        const { phone, text, url, contacts }: any = req.body;
        const questionRef = await Questions.add(phone, text, url);
        const answers = await Answers.addForContacts(contacts, questionRef)
        res.status(200).send({ id: questionRef.id, answers });
    } catch (e) {
        throw new WebError('Problem when add question. Please contact us');
    }
})

export default router;
