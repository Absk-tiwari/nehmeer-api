const BaseModel = require("./BaseModel");

class Role extends BaseModel {
    static get tableName() {
        return "roles";
    }
}

module.exports = Role;