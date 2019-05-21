import Firebase from '../config/firebase';

/**
 * @class Auth
 */
export default class Auth {

    static get() {
        return Firebase.getAuth();
    }
};