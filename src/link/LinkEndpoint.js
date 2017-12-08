var util 		= require('util');

var Response 	= require('../common/dto/Response');
var Link	 	= require('./Link');
var LinkService	= require('./LinkService');

var linkService = new LinkService();

exports.index = function(req, res){
	console.log("[LinkEndpoint] Incoming 'index' request : %j", req.query.link);
	
	var response = new Response();
	
	var link = new Link(undefined, req.query.link, 0);
	if (!link.validate()) {
		response.setErrors(link.getValidationErrors());
		res.json(response.toJSON());
		return;
	}
	
	linkService.get(link, function(err, result){
		if (err) {
			console.log("[LinkEndpoint] Errors : %j", err);
			response.addErrors(err);
		}
		else {
			response.setContent(getLinkDTO(result));
		}
		
		res.json(response);
	});
	
} 

exports.create = function(req, res) {
	console.log("[LinkEndpoint] Incoming 'create' request : %j", req.body.link);
	
	var response = new Response();
	
	var link = new Link(undefined, req.body.link, 0);
	
	linkService.add(link, function(err, result){
		if (err) {
			console.log("[LinkEndpoint] Errors : %j", err);
			response.addErrors(err);
		}
		else {
			response.setContent(getLinkDTO(result));
		}
		
		res.json(response.toJSON());
	});
}

function getLinkDTO(s) {
	return s;
}