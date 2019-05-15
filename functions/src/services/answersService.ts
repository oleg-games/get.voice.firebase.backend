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
    static async getAnswer(id: string) {
        const doc = await this.getAnswersCol().doc(id).get();
        if (!doc || !doc.exists) {
            throw new Error(`Cannot find answer with id ${id}`)
        }

        const newItem: any = { ...doc.data(), id: doc.id };

        if (newItem.questionRef) {
            const question = await newItem.questionRef.get()
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
    static async updateAnswer(id: string, data: any) {
        try {
            await this.getAnswersCol().doc(id).update(data);
        } catch (err) {
            console.log(err)
        }
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
    static addAnswer({ toPhone, text, image, questionRef }: any) {
        const answer = {
            toPhone,
            text: text || '',
            questionRef,
            image: image || '',
        }

        return this.getAnswersCol().add(answer);
    }

    /**
     * Get all answers by fromPhone number
     * @param {string} fromPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getAnsersByFromPhone(fromPhone: string) {
        const res: any = this.getAnswersCol().where("toPhone", "==", fromPhone).get()
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
    static async getAnsersByToPhone(toPhone: string) {
        const res = await this.getAnswersCol().where("toPhone", "==", toPhone).get()
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
    static async getAnsersNotEmptyTextByFromPhone(fromPhone: string) {
        const questions = await Questions.getQuestionsCol()
            .where("fromPhone", "==", fromPhone)
            .get()
        const mainListItems = [];
        for (const question of questions.docs) {
            const ref = await Questions.getQuestionsCol().doc(question.id)
            const answers = await this.getAnswersCol()
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
    static async getAnsersEmptyTextByToPhone(toPhone: string) {
        const res = await this.getAnswersCol()
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
    static async getAnsersNotEmptyTextByToPhone(toPhone: string) {
        const res = await this.getAnswersCol()
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
    static getAnswersCol() {
        return Firestore.getFirestore().collection("answers");
    }
}

