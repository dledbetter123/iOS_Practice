// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
// import NfcManager, { NfcTech } from 'react-native-nfc-manager';
// import Dialog from 'react-native-dialog';

// const NFCScanner = () => {
//   const [dialogVisible, setDialogVisible] = useState(false);
//   const [dialogText, setDialogText] = useState('');
//   const [writingText, setWritingText] = useState('');

//   useEffect(() => {
//     initNFC();
//     return () => {
//       NfcManager.stop();
//     };
//   }, []);

//   const initNFC = async () => {
//     try {
//       await NfcManager.start();
//     } catch (ex) {
//       console.warn(ex);
//     }
//   };

//   const handleNfcDiscover = async (tag) => {
//     if (tag.techTypes.includes(NfcTech.Ndef)) {
//       const text = tag.ndefMessage[0].payload;
//       setDialogText(text);
//       setDialogVisible(true);
//     }
//   };

//   const writeNFC = async () => {
//     try {
//       const resp = await NfcManager.requestTechnology(NfcTech.Ndef);

//       if (resp) {
//         const bytes = NfcManager.stringToBytes("writingText");
//         const message = NfcManager.createNdefMessage(bytes);
//         await NfcManager.writeNdefMessage(message);
//         NfcManager.cancelTechnologyRequest();
//       }
//     } catch (ex) {
//       console.warn(ex);
//     }
//   };

//   return (
//     <View>
//       <Text>NFC Scanner App</Text>
//       <TouchableOpacity style={styles.btn} onPress={() => writeNFC()}>
//          <Text>Write NFC</Text>
//       </TouchableOpacity>
//       <Dialog.Container visible={dialogVisible}>
//         <Dialog.Title>NFC Tag Content</Dialog.Title>
//         <Dialog.Description>{dialogText}</Dialog.Description>
//         <Dialog.Button label="OK" onPress={() => setDialogVisible(false)} />
//       </Dialog.Container>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   whiteText: {
//     color: 'white',
//   },

//   btn: {
//     margin: 15,
//     padding: 15,
//     borderRadius: 8,
//     backgroundColor: 'white'
//   },
// });

// export default NFCScanner;

// import React from 'react';
// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import NfcManager, {NfcTech} from 'react-native-nfc-manager';

// // Pre-step, call this before any NFC operations
// NfcManager.start();

// function App() {
//   async function readNdef() {
//     try {
//       // register for the NFC tag with NDEF in it
//       await NfcManager.requestTechnology(NfcTech.Ndef);
//       // the resolved tag object will contain `ndefMessage` property
//       const tag = await NfcManager.getTag();
//       console.warn('Tag found', tag);
//     } catch (ex) {
//       console.warn('Oops!', ex);
//     } finally {
//       // stop the nfc scanning
//       NfcManager.cancelTechnologyRequest();
//     }
//   }

//   return (
//     <View style={styles.wrapper}>
//       <TouchableOpacity onPress={readNdef}>
//         <Text style={styles.text}>Scan a Tag</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   text:{
//     color: 'white'
//   },
// });

// export default App;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import Dialog from 'react-native-dialog';
import { Buffer } from "buffer";
import { Button } from 'react-native';

// Pre-step, call this before any NFC operations
NfcManager.start();

const NFCScanner = ({ navigation }) => {
  const [readDialogVisible, setReadDialogVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [writingText, setWritingText] = useState('Hello, NFC!');


  const openWriteDialog = () => {
    setDialogVisible(true);
  };

  const closeWriteDialog = () => {
    setDialogVisible(false);
  };

  const handleWriteDialogSubmit = async () => {
    await writeNdef();
    closeWriteDialog();
  };

  async function readNdef() {
    try {
      // Register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // The resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      // console.warn("test: ", tag["ndefMessage"][0]["payload"]);
      const parsedRecords = tag.ndefMessage.map(record => {
        const payloadText = Buffer.from(record.payload.slice(3)).toString('utf-8');
        return payloadText;
      });
  
      setDialogText(parsedRecords.join('\n'));
      // console.warn("test: ", text);
      // setDialogText(text);
      setReadDialogVisible(true);
      NfcManager.cancelTechnologyRequest();
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // Stop the NFC scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  // async function writeNdef() {
  //   try {
  //     await NfcManager.requestTechnology(NfcTech.Ndef);

  //     const textPayload = [0x02, ...Buffer.from("writingText", 'utf-8')];
  //     const textRecord = Ndef.record(Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT, [], textPayload);
  
  //     const message = [textRecord];
  
  //     await NfcManager.writeNdefMessage(message);
  
  //     await NfcManager.writeNdefMessage(message);
  //     NfcManager.cancelTechnologyRequest();
  //   } catch (ex) {
  //     console.warn('Oops! ', ex);
  //   }
  // }

  async function writeNdef() {
    let result = false;
  
    try {
      // STEP 1
      await NfcManager.requestTechnology(NfcTech.Ndef);
  
      const bytes = Ndef.encodeMessage([Ndef.textRecord(writingText)]);
  
      if (bytes) {
        await NfcManager.ndefHandler // STEP 2
          .writeNdefMessage(bytes); // STEP 3
        result = true;
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
    }
  
    return result;
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={readNdef}>
        <Text style={styles.text}>Scan a Tag</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={openWriteDialog}>
        <Text style={styles.text}>Write to Tag</Text>
      </TouchableOpacity>

      <Button
        title="Scan QR Code"
        onPress={() => navigation.navigate('Scan')}
      />

      <Dialog.Container visible={readDialogVisible}>
        <Dialog.Title style={styles.text}>NFC Tag Content</Dialog.Title>
        <Dialog.Description>{dialogText}</Dialog.Description>
        <Dialog.Button label="OK" onPress={() => setReadDialogVisible(false)} />
      </Dialog.Container>

      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title style={styles.text}>Write to NFC Tag</Dialog.Title>
        <Dialog.Description>Enter text to write to the NFC tag:</Dialog.Description>
        <TextInput
          style={styles.input}
          value={writingText}
          onChangeText={setWritingText}
        />
        <Dialog.Button label="Cancel" onPress={closeWriteDialog} />
        <Dialog.Button label="Write" onPress={handleWriteDialogSubmit} />
      </Dialog.Container>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  text: {
    color: 'white',
    marginVertical: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginVertical: 10,
  },
});

export default NFCScanner;
