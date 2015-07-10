var JobQueueStub = require('./job-queue-stub'),
    inherit = require('inherit');

module.exports = inherit({
    __constructor: function () {
        this.jobQueue = new JobQueueStub();
    },

    destruct: function () {
        this.jobQueue.destruct();
    }
});
