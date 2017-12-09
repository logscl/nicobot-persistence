import { MessageService } from "./MessageService";
import { MessageResponse } from "./MessageResponse";
import { Paging } from "../common/model/Paging";
import { Message } from "./Message";
import { Response } from "../common/dto/Response";

export class MessageEndpoint {

    private static messageService:MessageService = new MessageService();

    public static index = function(req:any, res:any){
        var startDate = (req.query.start_date) ? new Date(req.query.start_date) : undefined;

        //gestion pagination
        var start = (req.query.start) ? parseInt(req.query.start) : 0;
        var limit = (req.query.limit) ? parseInt(req.query.limit) : 10;

        var response = new MessageResponse();

        MessageEndpoint.messageService.get(startDate, start, limit, function(err:any, result:any){
            if (err) {
                console.log("[MessageEndpoint] Errors : %j", err);
                response.addErrors(err);
                res.json(response);
            }
            else {
                response.setMessages(result);

                MessageEndpoint.messageService.size(startDate, function(err:any, result:any){
                    if (err) {
                        console.log("[MessageEndpoint] Errors : %j", err);
                        response.addErrors(err);
                    }
                    else {
                        response.setPaging(new Paging(start,limit, result));
                    }

                    res.json(response);
                });
            }
        });
    }

    private static parseMessages(items:any) : Array<Message> {
        var messages = new Array();

        if (Array.isArray(items)) {
            messages = items
                .map(item => new Message(item.postedDate, item.username, item.message))
                .reduce((values:Array<Message>, message) => {
                    values.push(message);
                    return values;
                }, []);
        }

        return messages;
    }

    public static create = function(req:any, res:any) {
        console.log("[MessageEndpoint] Incoming 'create' request : %j", req.body);

        var msgBody = req.body.messages;

		if (!msgBody) {
			res.statusCode = 204
			res.json();
			return;
		}

        var messages = MessageEndpoint.parseMessages(req.body.messages);

        MessageEndpoint.messageService.add(messages, function(err:any, result:any){
            var response = new Response();

            if (err) {
                console.log("[MessageEndpoint] Errors : %j", err);
                response.addErrors(err);
            }
            else {
                res.statusCode = 201;
            }

            res.json(response.toJSON());
        });
    }
}