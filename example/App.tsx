/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Linking,
  Alert,
  Button
} from 'react-native';

import { signMessage } from 'react-native-trust-sdk';

interface Props {}
export default class App extends Component<Props> {

  state = {
    address: '0xe47494379c1d48ee73454c251a6395fdd4f9eb43',
    amount: '1',
    message: 'hello trust'
  }

  signTx() {
    console.log(this.state.address);
  }

  signMsg() {
    signMessage(this.state.message)
    .then((value) => {
      Alert.alert('sign message result', value);
    });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} keyboardDismissMode='on-drag'>
        <Text style={styles.welcome}>
          react-native-trust-sdk example app
        </Text>
        <View>
          <View style={styles.row}>
            <Text style={styles.label}>
              Address:
            </Text>
            <TextInput style={styles.input} value={this.state.address} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>
              Amount:
            </Text>
            <TextInput style={styles.input} value={this.state.amount} />
          </View>
          <Button title='Sign Transaction' onPress={this.signTx.bind(this)} />
        </View>
        <View style={styles.messageContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>
              Message:
            </Text>
            <TextInput style={styles.input} value={this.state.message} />
          </View>
          <Button title='Sign Message' onPress={this.signMsg.bind(this)} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  messageContainer: {
    marginTop: 40
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 5
  },
  label: {
    flex: 1,
    fontSize: 12
  },
  input: {
    flex: 5,
    fontSize: 11,
    borderWidth: 1,
    padding: 4,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 64,
    marginBottom: 20
  }
});
