module.exports = Paging;

function Paging(start, limit, total) {
    this._start = start;
    this._limit = limit;
    this._total = total;
}

Paging.prototype.toJSON = function() {
    return {
        start: this._start,
        limit: this._limit,
        total: this._total
    };
}