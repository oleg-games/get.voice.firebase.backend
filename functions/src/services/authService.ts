import Firebase from '../config/firebase';

/**
 * @class Auth
 */
export default class Auth {

    static getAuth() {
        return Firebase.getAuth();
    }

};