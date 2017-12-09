export class Error {
	private errors : Array<ErrorItem> = new Array();

	hasError() : boolean {
		return (this.errors.length == 0) ? false : true;
	}

	addFieldError(fieldName:string, errorMessage:string) {
		this.errors.push(new ErrorItem(fieldName, errorMessage));
	}

	getErrors() : Array<ErrorItem> {
		return this.errors;
	}
}

export class ErrorItem {
	private field:string;
	private message:string;

	constructor(field:string, message:string) {
		this.field = field;
		this.message = message;
	}

	getField() : string { return this.field; }
	getMessage() : string { return this.message; }

}