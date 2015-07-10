var vow = require('vow');

function JobQueueStub() {}

JobQueueStub.prototype.processor = null;

JobQueueStub.prototype.push = function (module) {
    var args = [].slice.call(arguments, 1);
    return vow.invoke(function () {
        return (this.processor || require(module)).apply(null, args);
    }.bind(this));
};

JobQueueStub.prototype.destruct = function () {};

module.exports = JobQueueStub;
