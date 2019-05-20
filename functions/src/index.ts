import * as functions from 'firebase-functions';
import routes from './routes';

export const api = functions.https.onRequest(routes);
