import Firestore from './firestoreService';

/**
 * @class Questions
 */
export default class Questions {

    /**
     * Get questions collection
     */
    static getCol() {
        return Firestore.get().collection("questions");
    }

    /**
     * Add new question
     *
     * @param fromPhone
     * @param text question text
     * @param image question image
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static add(fromPhone: string, text: string, images: string[]) {
        const question: any = {
            fromPhone,
            text
        }

        if (images && images.length) {
            question.images = images;
        }

        return this.getCol().add(question);
    }

    /**
     * Get all question by phone number
     * @param {string} phone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getByPhone(phone: string) {
        return this.getCol().where("fromPhone", "==", phone).get();
    }

    /**
     * Get question by id
     * @param {string} id
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static get(id: string) {
        return this.getCol().doc(id).get();
    }

    /**
     * Get question by id
     * @param {string} id
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static getDoc(id: string) {
        return this.getCol().doc(id);
    }

}

