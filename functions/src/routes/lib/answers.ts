const express = require('express')
import { Answers, Questions } from '../../services';
import { WebError } from '../../errors';
import { authenticate } from './middleware';

const router = express.Router()

router.put('/:answerId', authenticate(), async (req: any, res: any) => {
    try {
        const { answerId }: any = req.params;
        const { text, url, contacts, id }: any = req.body;
        console.log('text', text)
        console.log('url', url)
        console.log('contacts', contacts)
        console.log('id', id)
        console.log('answerId', answerId)

        if (!answerId) {
            throw new WebError('Please fill answer id', 500);
        }

        if (!id) {
            throw new WebError('Please fill question id', 500);
        }

        if (!text) {
            throw new WebError('Please fill answer text', 500);
        }

        const data: any = { text: text };

        if (url) {
            data.image = url;
        }

        await Answers.update(answerId, data);
        const questionRef = await Questions.getDoc(id);
        const answers = await Answers.addForContacts(contacts, questionRef)
        res.status(200).send({ id: answerId, answers });
    } catch (e) {
        console.log(e);
        throw new WebError('Problem when add question. Please contact us', 500);
    }
})

router.get('/:phone/all/empty/my', authenticate(), async (req: any, res: any) => {
    const { phone } = req.params;

    if (!phone) {
        throw new WebError('Please fill phone', 500);
    }

    try {
        const items = await Answers.getEmptyTextByToPhone(phone);
        res.send(items);
    } catch (e) {
        throw new WebError(`Problem when get answers by phone. Phone ${phone}`, 500);
    }
})

router.get('/:phone/all/notempty/my', authenticate(), async (req: any, res: any) => {
    const { phone } = req.params;

    if (!phone) {
        throw new WebError('Please fill phone', 500);
    }

    try {
        const item = await Answers.getNotEmptyTextByToPhone(phone);
        res.send(item);
    } catch (e) {
        throw new WebError(`Problem when get questions by phone. Phone ${phone}`, 500);
    }
})

router.get('/:phone/all/notempty/forme', authenticate(), async (req: any, res: any) => {
    const { phone } = req.params;

    if (!phone) {
        throw new WebError('Please fill phone', 500);
    }

    try {
        const items = await Answers.getNotEmptyTextByFromPhone(phone);
        res.send(items);
    } catch (e) {
        throw new WebError(`Problem when get questions by phone. Phone ${phone}`, 500);
    }
})

export default router;
