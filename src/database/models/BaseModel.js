const { Model } = require("objection");

class BaseModel extends Model {
    static get modelPaths() {
        return [__dirname];
    }

    $beforeInsert() {
        if(this.created_at) {
            this.created_at = new Date().toISOString();
        }
    }

    $beforeUpdate() {
        if(this.updated_at) {
            this.updated_at = new Date().toISOString();
        }
    }
}

module.exports = BaseModel;