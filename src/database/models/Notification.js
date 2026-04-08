const BaseModel = require("./BaseModel");

class Notification extends BaseModel {
    static get tableName() {
        return "notifications";
    }
}

module.exports = Notification;