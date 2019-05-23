const express = require('express')
import { Questions, Answers, Security } from '../../services';
import { WebError } from '../../errors';
import { authenticate } from '../../middleware';

const router = express.Router()

router.get('/:id', authenticate(), async (req: any, res: any, next: any) => {
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
        next(e)
    }
})

router.get('/all/my', authenticate(), async (req: any, res: any, next: any) => {
    console.log('/all/my')
    try {
        const phone: any = await Security.getPhoneByTokenFromRequest(req);
        console.log('phone', phone)
        const questionsSnapshot = await Questions.getByPhone(phone);
        res.send(questionsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (e) {
        next(e);
    }
})

router.post('/', authenticate(), async (req: any, res: any, next: any) => {
    try {
        console.log('/')
        console.log('req.body', req.body)
        const { text, contacts, images }: any = req.body;
        const phone: any = await Security.getPhoneByTokenFromRequest(req);
        console.log('phone', phone)
        console.log('text', text)
        console.log('contacts', contacts)
        console.log('images', images)

        if (!text) {
            throw new WebError("Please fill question text");
        }

        const questionRef = await Questions.add(phone, text, images);
        const answers = await Answers.addForContacts(contacts, questionRef)
        res.status(200).send({ id: questionRef.id, answers });
    } catch (e) {
        next(e);
    }
})

export default router;
