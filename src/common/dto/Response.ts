export class Response<T> {
    private errors : Array<Error>;
    private content : T;

    getErrors() : Array<Error> { return this.errors; }
    setErrors(errors: Array<Error>) { this.errors = errors; }
    getContent() : T { return this.content; }
    setContent(content: T) { this.content = content; }

    addErrors(errors : Array<Error>) {
        if (this.errors == undefined) {
            this.errors = new Array();
        }	
        
        if (Array.isArray(errors)) {
            this.errors = this.errors.concat(errors);
        }
        else {
            this.errors.push(errors);
        }
    }

    toJSON() : any {	
        return {
            content: this.content,
            errors: this.errors
        };
    }
}
