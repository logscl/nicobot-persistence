import { ErrorItem } from "./ErrorItem";

export class Error {
    private errors : Array<ErrorItem> = new Array();

    hasError() : boolean {
        return (this.errors.length == 0) ? false : true;
    }

    addFieldError(fieldName:string, errorMessage:string) {
        this.errors.push(new ErrorItem(fieldName, errorMessage));
    }

    addError(error:ErrorItem) {
        this.errors.push(error);
    }

    getErrors() { return this.errors; }

    toJSON() : Array<ErrorItem> {
        return this.errors;
    }
}