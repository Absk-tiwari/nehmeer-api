const admin = require("firebase-admin");
const serviceAccount = require("../../firebase-service-account.json");

// firebase-service-account.json will be found in firebase account

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

exports.sendPush = async (token, title, body, data = {}) => {

    const message = {
        token,
        notification: {
            title,
            body,
        },
        data
    };

    return admin.messaging().send(message);
};