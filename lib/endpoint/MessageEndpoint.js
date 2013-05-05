var util 			= require('util');

var MessageResponse = require('../dto/MessageResponse');
var Message 		= require('../model/Message');
var Paging 		    = require('../model/Paging');
var MessageService	= require('../service/MessageService');

var messageService = new MessageService();

exports.index = function(req, res){
	var startDate = (req.query.start_date) ? new Date(req.query.start_date) : undefined;

    //gestion pagination
    var start = (req.query.start) ? parseInt(req.query.start) : 0;
    var limit = (req.query.limit) ? parseInt(req.query.limit) : 10;

	var response = new MessageResponse();
	
	messageService.get(startDate, start, limit, function(err, result){
		if (err) {
			console.log("[MessageEndpoint] Errors : %j", err);
			response.addErrors(err);
            res.json(response);
		}
		else {
			response.setMessages(result);

            messageService.size(startDate, function(err, result){
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

exports.create = function(req, res) {
	console.log("[MessageEndpoint] Incoming 'create' request : %j", req.body);
	
	var messages = parseMessages(req.body.messages);
	
	var response = new MessageResponse();

	messageService.add(messages, function(err, result){
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

function parseMessages(items) {
	var messages = new Array();
	
	if (Array.isArray(items)) {
		for(var i = 0; i < items.length; i++) {
			var item = items[i];
			messages.push(new Message(item.postedDate, item.username, item.message));
		}
	}
	
	return messages;
}