import Firestore from './firestoreService';

/**
 * @class Users
 */
export default class Codes {

    /**
     * Get user by id
     * @param {string} id
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getCode(id: string) {
        const doc = await this.getCodesCol().doc(id).get();
        if (!doc || !doc.exists) {
            throw new Error(`Cannot find user with id ${id}`)
        }

        return { ...doc.data(), id: doc.id };
    }

    /**
     * Get code by phone and code not signIn
     * @param {string} phone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getCodeByPhoneByCodeNotSighIn(phone: string, code: string) {
        return await this.getCodesCol()
            .where("phone", "==", phone)
            .where("code", "==", code)
            .where("isSignIn", "==", false)
            .get()
    }

    // /**
    //  * Get user by phone
    //  * @param {string} phone
    //  * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
    //  */
    // static async getCodeByPhoneByCodeNotSighIn(phone: string, code: string, ) {
    //     const res = await this.getCodesCol()
    //         .where("phone", "==", phone)
    //         .where("code", "==", code)
    //         .where("isSignIn", "==", false)
    //         .get()

    //     if (res.docs && res.docs.length) {
    //         if (res.docs.length === 1) {
    //             return ({ ...res.docs[0].data(), id: res.docs[0].id });
    //         } else {
    //             throw new Error(`More then one user with phone ${phone}`);
    //         }
    //     }

    //     return null;
    // }

    /**
     * Update code by id
     *
     * @param {string} id
     * @param {object} data
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async update(id: string, data: any) {
        try {
            await this.getCodesCol().doc(id).update(data);
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Add new code
     *
     * @param phone
     * @param code code
     * @param isSignIn isSignIn
     * @param token token
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static add({ phone, code, isSignIn, token }: any) {
        const newCode = {
            phone: phone || '',
            code: code || '',
            isSignIn: isSignIn || false,
            token: token || '',
        }

        return this.getCodesCol().add(newCode);
    }

    /**
     * Get codes collection
     */
    static getCodesCol() {
        return Firestore.getFirestore().collection("codes");
    }
}

