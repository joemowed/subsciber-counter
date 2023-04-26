"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("firebase/app");
var analytics_1 = require("firebase/analytics");
var functions_1 = require("firebase/functions");
var performance_1 = require("firebase/performance");
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
var firebaseConfig = {
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
var deviceID = "";
// Initialize Firebase 
var app = (0, app_1.initializeApp)(firebaseConfig);
var functions = (0, functions_1.getFunctions)(app);
var writeDataToBackend = (0, functions_1.httpsCallable)(functions, 'writeDataToBackend');
var actuallyWriteToBackEnd = (0, functions_1.httpsCallable)(functions, 'actuallyWriteToBackEnd');
// Initialize Realtime Database and get a reference to the service
//const database = getDatabase(app);
var analytics = (0, analytics_1.getAnalytics)(app);
(0, analytics_1.logEvent)(analytics, 'user acsessed page');
var perf = (0, performance_1.getPerformance)(app);
perf.instrumentationEnabled = true;
perf.dataCollectionEnabled = true;
(_a = document.getElementById("deviceIDInputButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", deviceIDUpdater);
//@ts-ignore
function deviceIDUpdater() {
    var sampleData = {
        deviceID: document.getElementById("deviceIDInput").value,
        platform: "youtube",
        channelID: "baller",
        channelName: "stillba764ler"
    };
    //@ts-ignore
    if (sampleData.deviceID.length != 0) {
        deviceID = sampleData.deviceID;
        //@ts-ignore
        writeDataToBackend(sampleData).then(function (response) {
            //@ts-ignore 
            updateCurrentDBDisplay(response.data.isValidDeviceID);
        }).catch(function () { return console.log("no responce"); });
    }
    else {
        console.log("shit broke");
    }
}
function updateCurrentDBDisplay(state) {
    var _a, _b;
    if (state) {
        hideAndSeek("defaultText", true);
        hideAndSeek("IDScreen", true);
        hideAndSeek("badIDText", true);
        hideAndSeek("changeScreen", false);
        hideAndSeek("changeScreenTop", false);
        (_a = document.getElementById("deviceIDInputButton")) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", deviceIDUpdater);
        (_b = document.getElementById("channelIDInputButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", channelIDUpdater);
    }
    else {
        hideAndSeek("defaultText", true);
        hideAndSeek("badIDText", false);
    }
}
function hideAndSeek(eleID, trueOnHide) {
    var ele = document.getElementById(eleID);
    if (!trueOnHide) {
        ele === null || ele === void 0 ? void 0 : ele.classList.remove("hidden");
        ele === null || ele === void 0 ? void 0 : ele.classList.add("visible");
    }
    else {
        ele === null || ele === void 0 ? void 0 : ele.classList.add("hidden");
        ele === null || ele === void 0 ? void 0 : ele.classList.remove("visible");
    }
}
function channelIDUpdater() {
    var channelIDElement = document.getElementById("channelIDInput");
    var channelNameElement = document.getElementById("channelNameInput");
    //@ts-ignore
    if (!channelNameElement.value) {
        return false;
    }
    else {
        var channelData = {
            deviceID: document.getElementById("deviceIDInput").value,
            platform: "youtube",
            //@ts-ignore
            channelID: channelIDElement.value,
            //@ts-ignore
            channelName: channelNameElement.value,
        };
        actuallyWriteToBackEnd(channelData).then(function (result) {
            //@ts-ignore
            //@ts-ignore//@ts-ignore
            console.log(result);
            //@ts-ignore
            hideAndSeek("hideAll", true);
            hideAndSeek("onSuccess", false);
            //@ts-ignore
            document.getElementById("onSuccessP").innerHTML = "Success! Your counter is now counting subscribers!";
        }).catch(function (er) { refreshAndTryAgain(); console.log(er); });
    }
}
function refreshAndTryAgain() {
    hideAndSeek("hideAll", true);
    hideAndSeek("onSuccess", false);
    document.getElementById("onSuccessP").innerHTML = " Error :(   Please refresh the page and try again, if the error persists, contact support";
}
