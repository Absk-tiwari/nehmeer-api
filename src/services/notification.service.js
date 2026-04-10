const { Expo } = require("expo-server-sdk");
const User = require("../database/models/User");
const Notification = require("../database/models/Notification");
const expo = new Expo();

const sendPush = async (token, title, message) => {
    if (!Expo.isExpoPushToken(token)) return;

    await expo.sendPushNotificationsAsync([
        {
            to: token,
            sound: 'default',
            title,
            body: message,
        }
    ]);
};

exports.sendNotification = async ({
    user_id,
    title,
    message,
    data={},
}) => {
    // Save to DB (notifications table)
    // Send push via FCM
    const notification = await Notification.query().insert({
        user_id,
        title,
        message,
        action: data,
        is_read: false
    });

    // 🔥 Send push
    const user = await User.query().findById(user_id);

    if (user?.expo_push_token) {
        sendPush(user.expo_push_token, title, message);
    }

    return notification;
};