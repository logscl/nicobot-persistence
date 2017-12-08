var util 		= require('util');

var ScoreResponse = require('./ScoreResponse');
var HgtService    = require('./HgtService');

var hgtService = new HgtService();

exports.index = function(req, res){
    console.log("[HgtEndpoint] Incoming 'this week' request : %j", req.query);

    var now = new Date();

    retrieveByWeek(res, req.params.channel, now.getFullYear(), now.getWeek());
}

exports.byWeek = function(req, res){
    console.log("[HgtEndpoint] Incoming 'weekly' request : %j", req.query);

    retrieveByWeek(res, req.params.channel, req.params.year, req.params.week);
}

function retrieveByWeek(res, channel, year, week) {
    hgtService.retrieveWeek(channel, year, week, function(err, result){
        var response = new ScoreResponse();

        if (err) {
            console.log("[HgtEndpoint] Errors : %j", err);
            response.addErrors(err);
        }
        else {
            response.setScores(result);
        }

        res.json(response.toJSON());
    });
}

exports.byYear = function(req, res){
    console.log("[HgtEndpoint] Incoming 'yearly' request : %j", req.query);

    var response = new ScoreResponse();

    hgtService.retrieveYear(req.params.channel, req.params.year, function(err, result){
        if (err) {
            console.log("[HgtEndpoint] Errors : %j", err);
            response.addErrors(err);
        }
        else {
            response.setScores(result);
        }

        res.json(response.toJSON());
    });
}

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    var millisecsInDay = 86400000;
    return Math.ceil((((this - onejan) /millisecsInDay) + onejan.getDay()+1)/7);
};