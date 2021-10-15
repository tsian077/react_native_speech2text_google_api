import 'react-native-gesture-handler'
// import * as React from 'react';
import React ,{useEffect,useState} from 'react'
import { Text, View, StyleSheet, Button,PermissionsAndroid } from 'react-native';
import AudioRecord from 'react-native-audio-record';
// import {AAA} from "@env"
// import Permissions from 'react-native-permissions';

// import { AAA } from 'react-native-dotenv'

// ApiClient.init(AAA)

import { Buffer } from 'buffer';


export default function App() {

  

 

  
  const [recording, setRecording] = useState(false);
  const [myText, setMyText] = useState("My Original Text");
  
  // checkPermission = async () => {
  //   const p = await Permissions.check('microphone');
  //   console.log('permission check', p);
  //   if (p === 'authorized') return;
  //   return this.requestPermission();
  // };

  // requestPermission = async () => {
  //   const p = await Permissions.request('microphone');
  //   console.log('permission request', p);
  // };
  useEffect(()=>{

    if (Platform.OS === "android") {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);}
  

  })


  async function startRecording() {
    // console.log(AAA)
   
   

    
    // if (Platform.OS === 'android') {
    //   try {
    //     const grants = await PermissionsAndroid.requestMultiple([
    //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //       PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    //     ]);
    
    //     console.log('write external stroage', grants);
    
    //     if (
    //       grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
    //         PermissionsAndroid.RESULTS.GRANTED &&
    //       grants['android.permission.READ_EXTERNAL_STORAGE'] ===
    //         PermissionsAndroid.RESULTS.GRANTED &&
    //       grants['android.permission.RECORD_AUDIO'] ===
    //         PermissionsAndroid.RESULTS.GRANTED
    //     ) {
    //       console.log('Permissions granted');
    //     } else {
    //       console.log('All required permissions not granted');
    //       return;
    //     }
    //   } catch (err) {
    //     console.warn(err);
    //     return;
    //   }
    // }
    

    setRecording(true)
    // setMyText("open")
     
    const options = {
      // sampleRate: 16000,  // default is 44100 but 32000 is adequate for accurate voice recognition
      sampleRate: 8000,
      channels: 1,        // 1 or 2, default 1
      bitsPerSample: 16,  // 8 or 16, default 16
      audioSource: 6,     // android only (see below)
      bufferSize: 2048   // default is 2048
    };
    // //---------------------------------------------
    // var headers = {};
   
    
    var ws = new WebSocket('ws://')


    AudioRecord.init(options);
    AudioRecord.start();
    ws.onopen = ()=>{
     
      // connection opened
      // ws.send('open'); // send a message
     
      // ws.close()
      // var data_config = {
      //     "action": "start",
      //     "content-type": "audio/l16;rate=16000",
      //     "continuous": true,
      //     "interim_results": true,
      //     "word_confidence": true,
      //     "timestamps": true,
      //     "max_alternatives": 5
      // }
      // await ws.send(JSON.stringify(data_config))
      AudioRecord.on('data',(data)=>{
        chunk = Buffer.from(data,'base64')
        console.log(chunk.byteLength)
        ws.send(chunk)
      });
        
    };
    ws.onmessage = (e) => {
      // console.log(e)
      
      if('data' in e){
        data =  e['data']
        console.log(data)
        
        setMyText(data)
      }
      // console.log(e)
      // if('data' in e){
      //   data = JSON.parse(e['data']);
      //   if("results" in data){
      //       console.log(data['results'][0]['alternatives'][0]['transcript'])
      //       setMyText(data['results'][0]['alternatives'][0]['transcript'])
      //   }
      // }    
    };
    ws.onerror = (e) => {
      console.log('error',e.message);
    };
    
    ws.onclose = (e) => {
      // connection closed
      console.log('on_close',e.code, e.reason);
      
    };
  }

  async function stopRecording() {

    setRecording(false)
    // setMyText("close")
    AudioRecord.stop();
  }

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {/* <Text style={styles.baseText}>Hello world</Text> */}
      <Text>{myText}</Text>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  // baseText: {
  //   // flex:1,
  //   // fontFamily: "Cochin"
  // },
});
