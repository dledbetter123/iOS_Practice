import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NfcManager, { NfcEvents } from "react-native-nfc-manager";
import NFCScanner from './NFCScanner';
import ResultScreen from "./ResultScreen";
import ScanScreen from "./ScanScreen";

const Stack = createStackNavigator();

function App() {
  const [hasNfc, setHasNfc] = React.useState(null);

  React.useEffect(() => {
    async function checkNfc() {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
      }
      setHasNfc(supported);
    }

    checkNfc();
  }, []);

  React.useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
      console.log('tag found')
    })

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    }
  }, [])


  const readTag = async () => {
    await NfcManager.registerTagEvent();
  }

  if (hasNfc == null) {
    return null;
  } else if (!hasNfc) {
    return (
      <View style={styles.wrapper}>
        <Text>Your device doesn't support NFC</Text>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NFC">
        <Stack.Screen name="NFC" component={NFCScanner} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  whiteText: {
    color: 'white',
  },
});

export default App;