const { Model } = require("objection");

class ModelWithoutTimestamp extends Model {
    static get modelPaths() {
        return [__dirname];
    }

    $beforeInsert() {
        // this.created_at = new Date().toISOString();
    }

    $beforeUpdate() {
        // this.updated_at = new Date().toISOString();
    }
}

module.exports = ModelWithoutTimestamp;