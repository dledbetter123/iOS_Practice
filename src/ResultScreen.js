import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultScreen = ({ route }) => {
  const { data } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>QR Code Scanned!</Text>
      <Text style={styles.result}>{data}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    color: '#333',
  },
});

export default ResultScreen;