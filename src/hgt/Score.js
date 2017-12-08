module.exports = Score

function Score(userId, channelId, year, week, score = 1) {
    this._userId = userId;
    this._channelId = channelId;
    this._year = year;
    this._week = week;
    this._score = score;
}

Score.prototype.getScore = function() {
    return this._score;
}

Score.prototype.getUserId = function() {
    return this._userId;
}

Score.prototype.getChannelId = function() {
    return this._channelId;
}

Score.prototype.getYear = function() {
    return this._year;
}

Score.prototype.getWeek = function(){
    return this._week;
}