// const _ = require('lodash')
// const { securityService } = requireRoot('lib/services')
import { WebError } from '../errors';
import { Security } from '../services';

/**
	Initialises the standard view locals
*/
export const initLocals = function (req: any, res: any, next: any) {
	next()
}

/**
	Prevents people from accessing protected pages when they're not signed in
 */
export const requireUser = function (req: any, res: any, next: any) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.')
		res.redirect('/keystone/signin')
	} else {
		next()
	}
}

export const authenticate = () => {
	return async (req: any, res: any, next: any) => {
		try {
			const token = req.headers.authorization;
			console.log('token', token)
			await Security.auth(token);
			console.log('okay')
			next();
		} catch (err) {
			console.log('error')
			req.token = null
			next(err);
		}
		// next(e);
		// 	securityService
		// 		.hasAuthority({ token: req.headers.authorization, scopes: (scopes && scopes.kjs) })
		// 		.then(result => next())
		// 		.catch(e => {
		// 			console.log(e)
		// 			req.token = null
		// 			next(e)
		// 		})
	}
}

// Forced to have 4 arguments due to express convension about error handlers
// eslint-disable-next-line
export const errorHandler = function (err: any, req: any, res: any, next: any) {
	// eslint-disable-next-line
	console.log('error from handler', err)
	const status = (err instanceof WebError)
		? err.status
		: 500
	console.log(err)
	console.log(err.message)
	res.status(status).send({ error: { ...err, message: err.message } })
}
