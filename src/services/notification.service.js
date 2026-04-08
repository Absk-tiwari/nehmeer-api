// Example skeleton (FCM integration can be added later)

exports.sendNotification = async ({
    userId,
    title,
    body,
    data,
}) => {
    // Save to DB (notifications table)
    // Send push via FCM
    console.log("Sending notification:", title);

    return true;
};