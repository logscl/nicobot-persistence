var Error = require('../common/model/Error');

module.exports = Link;

function Link(idLink, link, count) {
	this._id = idLink;
	this._link = link;
	this._count = count;
	this._errors = new Error();
}

Link.prototype.getId = function() {
	return this._id;
}

Link.prototype.getLink = function() {
	return this._link;
}

Link.prototype.getCount = function() {
	return this._count;
}

Link.prototype.setCount = function(newCount) {
	this._count = newCount;
}

Link.prototype.validate = function() {
	if (!this._link) {
		this._errors.addFieldError("link", "Cannot be null");
	}
	else {
		this._link = this._link.trim();
		
		if (this._link.length == 0) {
			this._errors.addFieldError("link", "Cannot be empty");
		}
	}
	
	if (this._errors.hasError()) {
		return false;
	}

	return true;
}

Link.prototype.getValidationErrors = function() {
	return this._errors.getErrors();
}

Link.prototype.toJSON = function() {
	return {
		link: this._link,
		count: this._count
	};
}