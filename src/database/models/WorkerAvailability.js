const ModelWithoutTimestamp = require("./ModelWithoutTimestamp");


class WorkerAvailability extends ModelWithoutTimestamp {
    
    static get tableName() {
        return "worker_availability";
    }

}

module.exports = WorkerAvailability