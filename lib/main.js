"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const database_1 = require("firebase/database");
const analytics_1 = require("firebase/analytics");
const functions_1 = require("firebase/functions");
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    // ...
    // The value of `databaseURL` depends on the location of the database
    apiKey: "AIzaSyBDshE-xyUbqPcE-CKYCYzBgrYyntRKcGg",
    authDomain: "jgmiistudios-b7eba.firebaseapp.com",
    projectId: "jgmiistudios-b7eba",
    storageBucket: "jgmiistudios-b7eba.appspot.com",
    messagingSenderId: "959237305410",
    appId: "1:959237305410:web:7b9a19775d32704b6a69db",
    measurementId: "G-D56Q119CFW",
};
// Initialize Firebase 
const app = (0, app_1.initializeApp)(firebaseConfig);
let deviceID;
// let channelID:string;
// let userName:string;
// let subCount:string;
// let userNameToSearch;
const functions = (0, functions_1.getFunctions)(app);
const writeDataToBackend = (0, functions_1.httpsCallable)(functions, 'writeDataToBackend');
// Initialize Realtime Database and get a reference to the service
const database = (0, database_1.getDatabase)(app);
const analytics = (0, analytics_1.getAnalytics)(app);
(0, analytics_1.logEvent)(analytics, 'user acsessed page');
document.getElementById("deviceIDInputButton").onclick = deviceIDUpdater;
function deviceIDUpdater() {
    deviceID = document.getElementById("deviceIDInput").innerHTML;
    var sampleData = {
        deviceID: deviceID,
        platform: "youtube",
        channelID: "baller",
        channelName: "stillballer"
    }; //@ts-ignore
    writeDataToBackend(sampleData).then((response) => {
        console.log(response.data.isValidDeviceID);
    }).catch(() => console.log("no responce"));
}
//# sourceMappingURL=main.js.map