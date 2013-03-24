var util 			= require('util');

var Response 		= require('../dto/Response');
var Message 		= require('../model/Message');
var MessageService	= require('../service/MessageService');

var ONE_MINUTE_IN_MS = 60 * 1000;
var FIVE_MINUTES_IN_MS = 5 * ONE_MINUTE_IN_MS;

var messageService = new MessageService();

exports.index = function(req, res){
	var maxMessages = (req.query.max_messages) ? parseInt(req.query.max_messages) : 10;
	var startDate = (req.query.start_date) ? new Date(req.query.start_date) : new Date(new Date().getTime() - FIVE_MINUTES_IN_MS);
	
	var response = new Response();
	
	messageService.get(maxMessages, startDate, function(err, result){
		if (err) {
			console.log("[MessageEndpoint] Errors : %j", err);
			response.addErrors(err);
		}
		else {
			response.setContent(getMessagesDTO(result));
		}
		
		res.json(response);
	});
} 


exports.create = function(req, res) {
	console.log("[MessageEndpoint] Incoming 'create' request : %j", req.body);
	
	var messages = parseMessages(req.body.messages);
	
	var response = new Response();

	messageService.add(messages, function(err, result){
		if (err) {
			console.log("[MessageEndpoint] Errors : %j", err);
			response.addErrors(err);
		}
		else {
			response.setContent(result);
		}
		
		res.json(response.toJSON());
	});	
}

function getMessagesDTO(result) {
	var res = new Array();
	
	for(var i = 0; i < result.length; i++) {
		res.push(result[i].toJSON());
	}
	
	return res;
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