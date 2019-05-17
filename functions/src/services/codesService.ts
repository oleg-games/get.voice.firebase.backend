import Firestore from './firestoreService';
import Auth from './authService';

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

    /**
     * Get code by token and signIn
     * @param {string} token
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getCodeByTokenSighIn(token: string) {
        console.log('getCodeByTokenSighIn token', token)
        return await this.getCodesCol()
            .where("token", "==", token)
            .where("isSignIn", "==", true)
            .get()
    }


    static async getPhoneByToken(token: string) {
        console.log('token', token)
        if (!token || token.indexOf('Bearer ') !== 0) {
            throw new Error('Wrong credentials')
        }

        const result = await Codes.getCodeByTokenSighIn(token.substring('Bearer '.length));
        console.log('number of codes', result.docs.length)
        if (result.docs.length) {
            console.log('user', result.docs[0].data());
            const code = { ...result.docs[0].data(), id: result.docs[0].id } as any;
            console.log('code', code);
            return code.phone;
        }

        return false;
    }

    /**
     * Get phone by token
     *
     * @param {string} token token
     */
    static getPhoneByTokenFirebase = async (token: string) => {
        console.log('token', token)
        if (!token || token.indexOf('Bearer ') !== 0) {
            throw new Error('Wrong credentials')
        }

        const decodedToken = await Auth.getAuth().verifyIdToken(token.substring('Bearer '.length));
        return decodedToken && decodedToken.phone_number && decodedToken.phone_number.substring(1);
    }

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

