const express = require('express')
import { Answers, Questions, Security } from '../../services';
import { WebError } from '../../errors';
import { authenticate } from '../../middleware';

const router = express.Router()

router.get('/:answerId', authenticate(), async (req: any, res: any, next: any) => {
    console.log('get /:answerId')
    try {
        const { answerId }: any = req.params;
        console.log('answerId', answerId)

        if (!answerId) {
            throw new WebError('Please fill answer id');
        }

        const answer = await Answers.get(answerId);
        res.status(200).send({ ...answer });
    } catch (e) {
        next(e);
    }
})

router.put('/:answerId', authenticate(), async (req: any, res: any, next: any) => {
    console.log('/:answerId')
    try {
        const { answerId }: any = req.params;
        const { text, contacts, images }: any = req.body;
        const phone: any = await Security.getPhoneByTokenFromRequest(req);

        console.log('phone', phone)
        console.log('text', text)
        console.log('images', images)
        console.log('contacts', contacts)
        console.log('answerId', answerId)

        if (!answerId) {
            throw new WebError('Please fill answer id');
        }

        if (!text) {
            throw new WebError('Please fill answer text');
        }

        const data: any = { text };

        if (images && images.length) {
            data.images = images;
        }

        await Answers.update(answerId, data);

        const answer = await Answers.get(answerId);
        const questionId = answer && answer.questionRef && answer.questionRef.id;
        if (!questionId) {
            throw new WebError('Empty question id in answer');
        }
        const questionRef = await Questions.getDoc(questionId);
        const answers = await Answers.addForContacts(contacts, questionRef);
        res.status(200).send({ id: answerId, answers });
    } catch (e) {
        next(e);
    }
})

router.get('/all/empty/my', authenticate(), async (req: any, res: any, next: any) => {
    console.log('/all/empty/my')
    try {
        const phone: any = await Security.getPhoneByTokenFromRequest(req);
        const items = await Answers.getEmptyTextByToPhone(phone);
        res.send(items);
    } catch (e) {
        next(e);
    }
})

router.get('/all/my', authenticate(), async (req: any, res: any, next: any) => {
    console.log('/all/my')

    try {
        const phone: any = await Security.getPhoneByTokenFromRequest(req);
        const item = await Answers.getNotEmptyTextByToPhone(phone);
        res.send(item);
    } catch (e) {
        next(e);
    }
})

router.get('/all/forme', authenticate(), async (req: any, res: any, next: any) => {
    console.log('/all/forme')

    try {
        const phone: any = await Security.getPhoneByTokenFromRequest(req);
        const items = await Answers.getNotEmptyTextByFromPhone(phone);
        res.send(items);
    } catch (e) {
        next(e);
    }
})

export default router;
