import Firestore from './firestoreService';

/**
 * @class Users
 */
export default class Users {

    /**
     * Get user by id
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
     * Get user by phone
     * @param {string} phone
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static async getByPhone(phone: string) {
        const res = await this.getCol().where("phone", "==", phone).get()

        if (res.docs && res.docs.length) {
            if (res.docs.length === 1) {
                return ({ ...res.docs[0].data(), id: res.docs[0].id });
            } else {
                throw new Error(`More then one user with phone ${phone}`);
            }
        }

        return null;
    }

    /**
     * Update user by id
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
        }
    }

    /**
     * Add new user
     *
     * @param phone
     * @param name user name
     * @param smsInvite user smsInvite
     * @param inSystem user inSystem
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static add({ phone, name, smsInvite, inSystem }: any) {
        const user = {
            phone: phone || '',
            name: name || '',
            smsInvite: smsInvite || false,
            inSystem: inSystem || true,
        }

        return this.getCol().add(user);
    }

    /**
     * Get users collection
     */
    static getCol() {
        return Firestore.get().collection("users");
    }
}

