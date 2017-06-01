module.exports = User;

function User(idUser, name, token) {
    this._id = idUser;
    this._name = name;
    this._token = token;
}

User.prototype.toJSON = function() {
    return {
        name: this._name,
        token: this._token
    };
}