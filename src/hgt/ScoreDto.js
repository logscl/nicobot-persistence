module.exports = ScoreDto

function ScoreDto() {
    this._userId = undefined;
    this._score = undefined;
}

function ScoreDto(score) {
    this._score = score.getScore();
    this._userId = score.getUserId();
}

ScoreDto.prototype.toJSON = function() {
    return {
        userId : this._userId,
        score : this._score
    };
}