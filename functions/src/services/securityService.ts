import { Codes, Auth } from '../services';
import { WebError } from '../errors';

export default class Security {

    /**
     * Get phone by token from request
     *
     * @param {any} req request
     */
    static async getPhoneByTokenFromRequestFirebase(req: any) {
        const token = req.headers.authorization;
        return await Codes.getPhoneByTokenFirebase(token);
    }

    /**
     * Get phone by token from request
     *
     * @param {any} req request
     */
    static async getPhoneByTokenFromRequest(req: any) {
        const token = req.headers.authorization;
        return await Codes.getPhoneByToken(token);
    }

    //Add login logout
    static async middlewareInFirebase(req: any, res: any) {
        console.log('headers', req.headers);
        const token = req.headers.authorization;
        console.log('token', token)
        if (!token || token.indexOf('Bearer ') !== 0) {
            throw new Error('Wrong credentials')
        }

        await Auth.get().verifyIdToken(token.substring('Bearer '.length));
    };

    //Add login logout
    static async auth(token: string) {
        if (!token || token.indexOf('Bearer ') !== 0) {
            throw new WebError('Wrong credentials', 401)
        }

        try {
            const tokenWithoutBearer = token.substring('Bearer '.length)
            console.log('tokenWithoutBearer', tokenWithoutBearer)
            const code = await Codes.getByTokenSighIn(tokenWithoutBearer);
            console.log('code', code)
            console.log(code.docs)
            console.log(code.docs.length)
            if (code && code.docs && code.docs.length) {
                return true;
            } else {
                throw new WebError('Wrong credentials', 401);
            }
        } catch (err) {
            throw new WebError('Wrong credentials', 401);
        }
    }
}