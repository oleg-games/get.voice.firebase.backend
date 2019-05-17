export default class RestApiError extends Error {
	errors: any = [];
	status = '';

	constructor(message: string, status: number) {
		super(message)
		Error.captureStackTrace(this, this.constructor)
		this.name = this.constructor.name
		const error = {
			code: 400,
			title: this.message
		}
		this.errors = [error]
		this.status = "fail"
	}
};
