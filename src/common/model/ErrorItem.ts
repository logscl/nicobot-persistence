export class ErrorItem {
    private field:string;
    private message:string;

    constructor(field:string, message:string) {
        this.field = field;
        this.message = message;
    }

    getField() { return this.field; }
    getMessage() { return this.message; }

}