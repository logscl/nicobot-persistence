module.exports = ScoreResponse;

var Response = require("../common/dto/Response");
var ScoreDto = require("./ScoreDto");

function ScoreResponse() {
    Response.call(this);

    this._scores = undefined;
}

ScoreResponse.prototype = new Response();
ScoreResponse.prototype.constructor = Response;

ScoreResponse.prototype.setScores = function(scores) {
    this._scores = scores;
}

ScoreResponse.prototype.toJSON = function() {
    return {
        scores : this.transform(),
        errors: this._errors
    }
}

ScoreResponse.prototype.transform = function() {
    var res = new Array();

    for(var i = 0; this._scores && i < this._scores.length; i++) {
        res.push(new ScoreDto(this._scores[i]).toJSON());
    }

    return res;
}