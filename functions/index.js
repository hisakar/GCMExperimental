const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().functions);

var newData;

exports.messageTrigger = functions.firestore.document('Messages/{messageId}').onCreate(async (snapshot, context) => {
    if (snapshot.empty) {
        console.log('No devices');
        return;
    }
    newData = snapshot.data;

    var tokens = [];

    const deviceTokens = await admin.firestore().collection('DeviceTokens').get();

    deviceTokens.docs.forEach((token) => {
        tokens.push(token.data().device_token);
    });

    var payload = {
        notification: { title: 'Push title', body: 'Push body', sound: 'default' },
        data: { click_action: 'FLUTTER_NOTIFICATION_CLICK', message: 'Sample push message' }
    };
    try {
        const response = await admin.messaging().sendToDevice(tokens,payload);
        console.log('Notification sent succesfully');
    } catch (err) { 
        console.log('Error sendind notfiication.');
    }
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
