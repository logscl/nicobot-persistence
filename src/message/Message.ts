import { Error } from "../common/model/Error";

export class Message {

    private id?:number;
    private timestamp:Date;
    private username:string;
    private message:string;
    private error: Error;

    constructor(timestamp:number, username:string, message:string, id?:number) {
        this.id = id;
        this.timestamp	= new Date(timestamp);
        this.username = username;
        this.message = message;
        this.error = new Error();
    }

    getTimestamp() { return this.timestamp; }
    getUserName() { return this.username; }
    getMessage() { return this.message; }
    getValidationErrors() { return this.error.getErrors(); }

    validate() {
        if (!this.timestamp) {
            this.error.addFieldError("timestamp", "Cannot be null");
        }
        if (!this.username || this.username.length == 0) {
            this.error.addFieldError("username", "Cannot be null or empty");
        }
        if (!this.message || this.message.length == 0) {
            this.error.addFieldError("message", "Cannot be null or empty");
        }
        if (this.error.hasError()) {
            return false;
        }

        return true;
    }

}
