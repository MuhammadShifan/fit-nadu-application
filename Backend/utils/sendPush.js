const axios = require('axios');

const sendPushNotification = async (expoPushToken, title, body) => {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title, // Ithu thaan OS banner title
        body: body,   // Ithu thaan OS banner text
        data: { screen: 'Notifications' },
    };

    try {
        await axios.post('https://exp.host/--/api/v2/push/send', message);
        console.log('Expo-kku Push trigger anuppiyachu!');
    } catch (error) {
        console.error('Push anuppurathula error:', error);
    }
};

module.exports = sendPushNotification;