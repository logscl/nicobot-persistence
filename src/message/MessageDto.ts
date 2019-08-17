import { Message } from "./Message";

export class MessageDto {

    private message?: string;
    private username?: string;
    private postedDate?: Date;

    constructor(message?:Message) {
        if (message != undefined) {
            this.message = message.getMessage();
            this.username = message.getUserName();
            this.postedDate = message.getTimestamp();
        }
    }

    toJSON() {
        return {
            postedDate: this.postedDate,
            username: this.username,
            message: this.message
        };
    }
}
