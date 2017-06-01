module.exports = MessageDto;

function MessageDto() {
    this._message = undefined;
    this._username = undefined;
    this._postedDate = undefined;
}

function MessageDto(message) {
    this._message = message.getMessage();
    this._username = message.getUserName();
    this._postedDate = message.getTimestamp();
}

MessageDto.prototype.toJSON = function() {
    return {
        postedDate: this._postedDate,
        username: this._username,
        message: this._message
    };
}
