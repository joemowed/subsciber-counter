//@ts-ignore
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const fetch = require('node-fetch');
admin.initializeApp();
admin.firestore();
const backEnd = admin.firestore().collection("backEnd");
const counterData = admin.firestore().collection("counterData");
//create firebase collection refrences
interface dataToWriteIn{
    deviceID: string,
    platform: string,
    channelID: string,
    channelName: string,


} 
// // Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const writeDataToBackend = functions.https.onCall((request:dataToWriteIn) => {
    
   return counterData.doc(request.deviceID).get().then((snap =>{
        if(snap.exists)
        {
            
            return {
                isValidDeviceID: true
            }
        }
        else{
            return {
                isValidDeviceID: false
            }
        }
    })).catch((error)=>{
        functions.logger.error("could not process request",request)
    })
  
});
export  const  actuallyWriteToBackEnd =  functions.https.onCall((request:dataToWriteIn) =>
{   let chanName = request.channelName
    let chanID = request.channelID
    if(!chanID)
    {
        fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${chanName}&type=channel&key=AIzaSyDOR6Z8CGyRk4RhetVPCNTtSIQVEPKJ0cA
        
        `)
        //@ts-ignore
        .then((response)=> response.json()).then((jsonResponse)=>{
           const chanID = jsonResponse.items[0].id.channelId
            functions.logger.info(`got channel ID for ${chanName} as "${chanID}"`)
            const filteredRequest = {
        "channelID": chanID,
        "channelName": chanName,
        "platform": "youTube"
            }
    backEnd.doc(request.deviceID).set(filteredRequest).then(()=>functions.logger.info(`Succesfully Wrote channel Name`))
    return {data: true,"channelID":chanID}
}).catch(()=>{functions.logger.error("cant resolve chanID promise")
return {data: false}})
}
    
    else{
        let chanName = request.channelName
        let chanID = request.channelID
        const filteredRequest = {
            channelID: chanID,
            channelName: chanName,
            platform: "youTube"}
           backEnd.doc(request.deviceID).set(filteredRequest)}
         return {data: true, "channelID":chanID}})
        


         exports.updateSubData = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
            backEnd.get().then((snap)=>
            {
                snap.forEach((document)=>
                {//@ts-ignore
                     //@ts-ignore
                    fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${document.data().channelID}&key=AIzaSyDOR6Z8CGyRk4RhetVPCNTtSIQVEPKJ0cA`).then((response)=> response.json()).then((jsonResponse)=>{
                       var subs =  jsonResponse.items[0].statistics.subscriberCount 
                      //@ts-ignore
                       counterData.doc(document.id).update({'data':subs}).then(()=>{functions.logger.info(`automatically updated device ${document.id} with channel ${jsonResponse.items[0].id} to ${subs} subscribers`)}).catch((error)=>{functions.logger.info(document.data(), error)})
                })
            })
            
           })
      return null;  }
        )

    exports.useMultipleWildcards = functions.firestore
    .document('backEnd/{deviceID}')
    .onWrite((change, context) => {//@ts-ignore
        backEnd.doc(context.params.deviceID).get().then((snap)=>{ 
       //@ts-ignore
            fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${snap.data().channelID}&key=AIzaSyDOR6Z8CGyRk4RhetVPCNTtSIQVEPKJ0cA`).then((response)=> response.json()).then((jsonResponse)=>{
                var subs =  jsonResponse.items[0].statistics.subscriberCount //@ts-ignore
                counterData.doc(snap.id).update({'data':subs}).then(()=>{functions.logger.info(`New device ${snap.id} tracking ${snap.data().channelID} as ${subs} subscribers`)}).catch((error)=>{functions.logger.info(error); "update subs on write failed"})
        })
        
      // If we set `/users/marie/incoming_messages/134` to {body: "Hello"} then
      // context.params.userId == "marie";
      // context.params.messageCollectionId == "incoming_messages";
      // context.params.messageId == "134";
      // ... and ...
      // change.after.data() == {body: "Hello"}
    })});