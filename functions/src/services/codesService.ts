import Firestore from './firestoreService';
import Auth from './authService';
import { WebError } from '../errors';

/**
 * @class Codes
 */
export default class Codes {

    /**
     * Get code by id
     * @param {string} id
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async get(id: string) {
        const doc = await this.getCol().doc(id).get();
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
    static async getByPhoneByCodeNotSighIn(phone: string, code: string) {
        return await this.getCol()
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
    static async getByTokenSighIn(token: string) {
        console.log('getByTokenSighIn token', token)
        return await this.getCol()
            .where("token", "==", token)
            .where("isSignIn", "==", true)
            .get()
    }

    /**
     * Delete code by token
     * @param {string} token
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async deleteByToken(token: string) {
        const codes = await this.getCol()
            .where("token", "==", token)
            .get()
        for (const code of codes.docs) {
            await this.getCol().doc(code.id).delete()
        }

        return true;
    }

    static async getPhoneByToken(token: string) {
        console.log('token', token)
        if (!token || token.indexOf('Bearer ') !== 0) {
            throw new Error('Wrong credentials')
        }

        const result = await Codes.getByTokenSighIn(token.substring('Bearer '.length));
        console.log('number of codes', result.docs.length)
        if (!result.docs.length) {
            throw new WebError('Cannot find phone');
        }

        if (result.docs.length > 1) {
            throw new WebError('A lot of phones for this token');
        }

        console.log('user', result.docs[0].data());
        const code = { ...result.docs[0].data(), id: result.docs[0].id } as any;
        console.log('code', code);
        if (!code.phone) {
            throw new WebError('Empty phone');
        }

        return code.phone;
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

        const decodedToken = await Auth.get().verifyIdToken(token.substring('Bearer '.length));
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
            await this.getCol().doc(id).update(data);
        } catch (err) {
            console.log(err)
            throw new WebError(`Error when update code ${err}`);
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

        return this.getCol().add(newCode);
    }

    /**
     * Get codes collection
     */
    static getCol() {
        return Firestore.get().collection("codes");
    }
}

