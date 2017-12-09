import { BaseService } from "../common/service/BaseService";
import { MessageDao } from "./MessageDao";
import { Message } from "./Message";

export class MessageService extends BaseService {

    private messageDao:MessageDao;

    constructor() {
        super();

        this.messageDao = new MessageDao();
    }

    /**
     * Get messages.
     * @param startDate
     *		Start date from when to get messages
     * @param start
     *      Start index for paged search
     * @param limit
     *		Max number of messages to get
     * @param callback
     *		A callback function(err, result)
     */
    get(startDate:Date|undefined, start:number, limit:number, callback:any) {
        var self = this;

        if (startDate) {
            self.messageDao.readLastMessages(startDate, start, limit, function handleError(err:any, response:any) {
                if (err || !response) {
                    callback(self._handleDAOError(err));
                }
                else {
                    callback(undefined, response);
                }
            });
        }
        else {
            self.messageDao.read(start, limit, function handleError(err:any, response:any) {
                if (err || !response) {
                    callback(self._handleDAOError(err));
                }
                else {
                    callback(undefined, response);
                }
            });
        }
    }

    /**
     * Retrieve message count
     * @param startDate
     *      Start date from when to get messages
     * @param callback
     *      A callback function(err, result)
     */
    size(startDate:Date|undefined, callback:any) {
        var self = this;

        self.messageDao.count(startDate, function handleReturn(err:any, response:any) {
            if (err || !response) {
                callback(self._handleDAOError(err));
            }
            else {
                callback(undefined, response);
            }
        });
    }

    /**
     * Add an array of messages.
     *
     * @param newMessages
     *		Array of new messages
     * @param callback
     * 		A callback function(err, insertId)
     */
    add(newMessages:Array<Message>, callback:any) {
        var self = this;

        var validationResults = self.validateMessages(newMessages);

        if (validationResults.nonValidElements.length == 0) {
            this.messageDao.create(validationResults.validElements, function (err:any, response:any) {
                if (err || !response) {
                    callback(self._handleDAOError(err));
                }
                else {
                    callback(undefined, response);
                }
            });
        }
        else {
            var errors = new Array();
            for (var i in validationResults.nonValidElements) {
                errors.push(validationResults.nonValidElements[i].getValidationErrors());
            }
            callback(errors);
        }
    }

    /**
     * Returns an object with 2 fields. One for valid elements, the other one for non valid elements
     * @param messages
     * 		An array of messages to validate
     */
    validateMessages(messages:Array<Message>) {
        var res = {
            validElements: new Array(),
            nonValidElements: new Array()
        };

        for (var i in messages) {
            if (messages[i].validate()) {
                res.validElements.push(messages[i]);
            }
            else {
                res.nonValidElements.push(messages[i]);
            }
        }

        return res;
    }
}
