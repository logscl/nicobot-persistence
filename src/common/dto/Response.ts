import { Error, ErrorItem } from "../model/Error";

export class Response<T> {
    private error : Error;
    private content : T;

    getError() { return this.error; }
    setError(error: Error) { this.error = error; }

    getContent() : T { return this.content; }
    setContent(content: T) { this.content = content; }

    addErrors(errors : Array<ErrorItem>) {
        if (this.error == undefined) {
            this.error = new Error();
        }

        for(var error of errors) {
            this.error.addError(error);
        }
    }

    addError(error : ErrorItem) {
        this.addErrors([error]);
    }

    toJSON() : object {
        var errors = (this.error)? this.error.toJSON() : undefined;

        return {
            content: this.content,
            errors: errors
        };
    }
}
