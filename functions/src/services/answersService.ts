import Firestore from './firestoreService';
import Questions from './questionsService';

/**
 * @class Answers
 */
export default class Answers {

    /**
     * Get answer by id
     * @param {string} id
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async get(id: string) {
        const doc = await this.getCol().doc(id).get();
        if (!doc || !doc.exists) {
            throw new Error(`Cannot find answer with id ${id}`)
        }

        const newItem: any = { ...doc.data(), id: doc.id };

        if (newItem.questionRef) {
            const question: any = await newItem.questionRef.get()
            newItem.questionRef = { ...question.data(), id: question.id };
        }
        return newItem;
    }

    /**
     * Update answer by id
     *
     * @param {string} id
     * @param {object} data
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async update(id: string, data: any) {
        try {
            await this.getCol().doc(id).update(data);
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Add answers for all contacts
     * TODO check if have question yet
     * @param {string[]} contacts contacts
     * @param {any} question question
     */
    static async addForContacts(contacts: string[], question: any) {
        let validContacts = 0;

        // for (const contact of contacts) {
        for (const contact of contacts.splice(contacts.length - 2)) {
            if (contact) {
                validContacts++;
                const data = {
                    toPhone: contact,
                    questionRef: question,
                    text: '',
                    image: '',
                };

                await Answers.add(data)
            }
        }

        return validContacts;
    }

    /**
     * Add new answer
     *
     * @param toPhone
     * @param text answer text
     * @param image answer image
     * @param questionRef question reference for object -> .doc('questions/' + questionRefs.id)
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static add({ toPhone, text, images, questionRef }: any) {
        const answer: any = {
            toPhone,
            text: text || '',
            questionRef,
        }

        if (images && images.length) {
            answer.images = images;
        }

        return this.getCol().add(answer);
    }

    /**
     * Get all answers by fromPhone number
     * @param {string} fromPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getByFromPhone(fromPhone: string) {
        const res: any = this.getCol().where("toPhone", "==", fromPhone).get()
        const mainListItems = [];

        for (const doc of res.docs) {
            const newItem = doc.data();
            newItem.id = doc.id;
            if (newItem.questionRef) {
                const question = await newItem.questionRef.get()
                newItem.questionRef = question.data()
                mainListItems.push(newItem);
            } else {
                mainListItems.push(newItem);
            }

        }

        return mainListItems;
    }

    /**
     * Get all answers by toPhone number
     * @param {string} toPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getByToPhone(toPhone: string) {
        const res = await this.getCol().where("toPhone", "==", toPhone).get()
        const mainListItems = [];

        for (const doc of res.docs) {
            const newItem = { ...doc.data(), id: doc.id } as any;
            if (newItem.questionRef) {
                const question = await newItem.questionRef.get()
                newItem.questionRef = { ...question.data(), id: question.id };
            }

            mainListItems.push(newItem);
        }

        return mainListItems;
    }

    /**
     * Get all answers by fromPhone number which contains not empty answer
     *
     * @param {string} toPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getNotEmptyTextByFromPhone(fromPhone: string) {
        const questions = await Questions.getCol()
            .where("fromPhone", "==", fromPhone)
            .get()
        const mainListItems = [];
        for (const question of questions.docs) {
            const ref = await Questions.getCol().doc(question.id)
            const answers = await this.getCol()
                .where("text", '>', '')
                .where("questionRef", '==', ref)
                .get()

            for (const answer of answers.docs) {
                mainListItems.push({
                    ...answer.data(),
                    id: answer.id,
                    questionRef: {
                        ...question.data(),
                        id: question.id
                    }
                })
            }
        }

        return mainListItems;
    }

    /**
         * Get all answers by toPhone number which contains empty answer
         *
         * @param {string} toPhone
         * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
         */
    static async getEmptyTextByToPhone(toPhone: string) {
        const res = await this.getCol()
            .where("toPhone", "==", toPhone)
            .where("text", '==', '')
            .get()
        const mainListItems = [];

        for (const doc of res.docs) {
            const newItem = { ...doc.data(), id: doc.id } as any;
            if (newItem.questionRef) {
                const question = await newItem.questionRef.get()
                newItem.questionRef = { ...question.data(), id: question.id };
            }

            mainListItems.push(newItem);
        }

        return mainListItems;
    }

    /**
     * Get all answers by toPhone number which contains not empty answer
     *
     * @param {string} toPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getNotEmptyTextByToPhone(toPhone: string) {
        const res = await this.getCol()
            .where("toPhone", "==", toPhone)
            .where("text", '>', '')
            .get()
        const mainListItems = [];

        for (const doc of res.docs) {
            const newItem = { ...doc.data(), id: doc.id } as any;
            if (newItem.questionRef) {
                const question = await newItem.questionRef.get()
                newItem.questionRef = { ...question.data(), id: question.id };
            }

            mainListItems.push(newItem);
        }

        return mainListItems;
    }

    /**
     * Get answers collection
     */
    static getCol() {
        return Firestore.get().collection("answers");
    }
}

