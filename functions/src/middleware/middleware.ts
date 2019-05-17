import { Codes, Auth } from '../services';

export default class Middleware {

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

        await Auth.getAuth().verifyIdToken(token.substring('Bearer '.length));
    };

    //Add login logout
    static async middleware(req: any, res: any) {
        console.log('headers', req.headers);
        const token = req.headers.authorization;
        // const token = req.headers.token;
        console.log('token', token)
        if (!token || token.indexOf('Bearer ') !== 0) {
            throw new Error('Wrong credentials')
        }

        try {
            console.log('token2', token.substring('Bearer '.length))
            const code = await Codes.getCodeByTokenSighIn(token.substring('Bearer '.length));
            console.log('code', code)
            console.log(code.docs)
            console.log(code.docs.length)
            if (code.docs.length) {
                return true;
            } else {
                throw new Error('Wrong credentials');
            }
        } catch (err) {
            throw new Error('Wrong credentials');
        }
    }
}