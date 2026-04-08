const BaseModel = require("./BaseModel");

class WorkerAvailability extends BaseModel {
    
    static get tableName() {
        return "worker_availability";
    }

}

module.exports = WorkerAvailability