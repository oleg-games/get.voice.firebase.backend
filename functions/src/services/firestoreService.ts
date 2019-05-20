import Firebase from '../config/firebase';

/**
 * @class Firestore
 */
export default class Firestore {

    /**
     * Get current Database
     */
    static get() {
        return Firebase.getFirestore();
    }
};