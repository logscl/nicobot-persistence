import { Message } from "./Message";
import { Response } from "../common/dto/Response";
import { Paging } from "../common/model/Paging";
import { MessageDto } from "./MessageDto";
import { MessageDao } from "./MessageDao";
import { ErrorItem } from "../common/model/ErrorItem";

export class MessageResponse extends Response<Array<Message>>{

    private messages:Array<Message>;
    private paging:Paging;

    constructor() {
        super();
    }

    setMessages(messages:Array<Message>) { this.messages = messages; }
    setPaging(paging:Paging) { this.paging = paging; }

    toJSON() {
        var errors:Array<ErrorItem>|undefined = (this.getError()) ? this.getError().toJSON() : undefined;

        return {
            messages: this.transform(),
            paging: this.paging,
            errors: errors
        };
    }

    transform() : Array<object> {
        return this.messages
            .map(message => new MessageDto(message))
            .map(messageDto => messageDto.toJSON())
            .reduce((values:Array<object>, msgDto) => {
                values.push(msgDto);
                return values;
            }, []);
    }
}
