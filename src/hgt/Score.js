module.exports = Score

function Score(score, userId) {
    this._score = score;
    this._userId = userId;
}

Score.prototype.getScore = function() {
    return this._score;
}

Score.prototype.getUserId = function() {
    return this._userId;
}