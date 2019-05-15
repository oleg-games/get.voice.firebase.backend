import Firestore from './firestoreService';

/**
 * @class Questions
 */
export default class Questions {

    /**
     * Get questions collection
     */
    static getQuestionsCol() {
        return Firestore.getFirestore().collection("questions");
    }

    /**
     * Add new question
     *
     * @param fromPhone
     * @param text question text
     * @param image question image
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static addQuestion(fromPhone: string, text: string, image: string) {
        const question = {
            fromPhone,
            text,
            image: image || ''
        }

        return this.getQuestionsCol().add(question);
    }

    /**
     * Get all question by fromPhone number
     * @param {string} fromPhone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getQuestionsByPhone(fromPhone: string) {
        return this.getQuestionsCol().where("fromPhone", "==", fromPhone).get();
    }

    /**
     * Get question by id
     * @param {string} id
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static getQuestion(id: string) {
        return this.getQuestionsCol().doc(id).get();
    }

}

