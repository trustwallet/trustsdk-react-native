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

import TrustWallet, { MessagePayload, TransactionPayload } from 'react-native-trust-sdk';

interface Props {}
export default class App extends Component<Props> {

  wallet: TrustWallet
  callbackScheem: string = 'trust-rn-example://'

  state = {
    address: '0xE47494379c1d48ee73454C251A6395FDd4F9eb43',//FIXME eip55
    amount: '1',
    message: 'hello trust',
    data: '0x8f834227000000000000000000000000000000005224'
  }

  componentDidMount() {
    this.wallet = new TrustWallet();
  }

  componentWillUnmount() {
    this.wallet.cleanup();
  }

  signTx() {
    console.log('to: ' + this.state.address);
    console.log('amount: ' + this.state.amount);
    console.log('data: ' + this.state.data);
    var payload = new TransactionPayload(this.state.address, this.state.amount, this.callbackScheem, this.state.data);
    this.wallet.signTransaction(payload, (result) => {
      Alert.alert('Transaction Signed', result);
    });
  }

  signMsg() {
    console.log(this.state.message);
    const payload = new MessagePayload(this.state.message, this.callbackScheem);
    this.wallet.signMessage(payload, (result => {
      Alert.alert('Message Signed', result);
    }));
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
            <TextInput style={styles.input} value={this.state.address} onChangeText={(address) => this.setState({address})}/>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>
              Data:
            </Text>
            <TextInput style={styles.input} value={this.state.data} onChangeText={(data) => this.setState({data})}/>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>
              Amount:
            </Text>
            <TextInput style={styles.input} value={this.state.amount} onChangeText={(amount) => this.setState({amount})}/>
          </View>
          <Button title='Sign Transaction' onPress={this.signTx.bind(this)} />
        </View>
        <View style={styles.messageContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>
              Message:
            </Text>
            <TextInput style={styles.input} value={this.state.message} onChangeText={(message) => this.setState({message})}/>
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
