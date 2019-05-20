import Firebase from '../config/firebase';

/**
 * @class Auth
 */
export default class Auth {

    static get() {
        return Firebase.getAuth();
    }

    /**
     * Sign in with phone number from Firebase
     *
     * @param {string} phone phone
     * @param {string} captchaVerifier captcha result
     */
    static async signInWithPhone(phone: any, captchaVerifier: any) {
        return await (Auth.get() as any).signInWithPhoneNumber(`+${phone}`, captchaVerifier);
    }
};