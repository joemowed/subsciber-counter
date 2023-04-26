import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getPerformance } from "firebase/performance";
interface dataToWriteIn{
    deviceID: string,
    platform: string,
    channelID: string,
    channelName: string,


} 

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
let deviceID="";
// Initialize Firebase 
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const writeDataToBackend = httpsCallable(functions, 'writeDataToBackend')
const actuallyWriteToBackEnd = httpsCallable(functions, 'actuallyWriteToBackEnd')
// Initialize Realtime Database and get a reference to the service
//const database = getDatabase(app);

const analytics = getAnalytics(app);
logEvent(analytics, 'user acsessed page');
const perf = getPerformance(app);
perf.instrumentationEnabled = true;
perf.dataCollectionEnabled = true;
document.getElementById("deviceIDInputButton")?.addEventListener("click",deviceIDUpdater);
//@ts-ignore

function deviceIDUpdater()

{ const sampleData:dataToWriteIn ={//@ts-ignore
    deviceID:  document.getElementById("deviceIDInput").value,
    platform: "youtube",
    channelID: "baller",
    channelName: "stillba764ler"
};
//@ts-ignore

    if(sampleData.deviceID.length != 0)
    {
  

        deviceID = sampleData.deviceID
//@ts-ignore
    writeDataToBackend(sampleData).then((response)=>{
    //@ts-ignore 

        updateCurrentDBDisplay(response.data.isValidDeviceID)
    
    }).catch(()=>console.log("no responce"))
}
else{
    console.log("shit broke")
}
}

function updateCurrentDBDisplay(state:boolean)
{
    if(state)
    {
        hideAndSeek("defaultText",true)
        hideAndSeek("IDScreen",true)
        hideAndSeek("badIDText",true)
        hideAndSeek("changeScreen",false)
        hideAndSeek("changeScreenTop",false)
document.getElementById("deviceIDInputButton")?.removeEventListener("click",deviceIDUpdater);
document.getElementById("channelIDInputButton")?.addEventListener("click",channelIDUpdater);

    }
    else{
        
        hideAndSeek("defaultText",true)
        hideAndSeek("badIDText",false)
    }
}

function hideAndSeek(eleID:string, trueOnHide:boolean)
{
    let ele = document.getElementById(eleID);
    if(!trueOnHide)
    {
        ele?.classList.remove("hidden")
        ele?.classList.add("visible")
    }
    else{
        ele?.classList.add("hidden")
        ele?.classList.remove("visible")
    }


}
function channelIDUpdater()
{
    let channelIDElement = document.getElementById("channelIDInput")
    let channelNameElement = document.getElementById("channelNameInput")
    //@ts-ignore
    if(!channelNameElement.value)
    {
        return false
    }
    else{
        
    const channelData:dataToWriteIn ={//@ts-ignore
        deviceID:  document.getElementById("deviceIDInput").value,
        platform: "youtube",
        //@ts-ignore
        channelID: channelIDElement.value,
        //@ts-ignore
        channelName: channelNameElement.value,
    };
    actuallyWriteToBackEnd(channelData).then((result)=>{
        //@ts-ignore
    
        //@ts-ignore//@ts-ignore
     
        
        console.log(result)
        //@ts-ignore
            hideAndSeek("hideAll",true)
            hideAndSeek("onSuccess",false)
            //@ts-ignore
            document.getElementById("onSuccessP")!.innerHTML = `Success! Your counter is now counting subscribers!`
      
    }).catch((er)=>{refreshAndTryAgain();console.log(er)})
}
}
function refreshAndTryAgain()
{
    hideAndSeek("hideAll",true)
    hideAndSeek("onSuccess",false)
    document.getElementById("onSuccessP")!.innerHTML = ` Error :(   Please refresh the page and try again, if the error persists, contact support`
}