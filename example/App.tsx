/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Alert,
} from 'react-native';

import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

import TrustWallet, {CoinType} from '@trustwallet/rn-sdk';
import {Buffer} from 'buffer';
import {utils, BigNumber} from 'ethers';
import console from 'console';

declare const global: {HermesInternal: null | {}};

class App extends React.Component {
  wallet?: TrustWallet;

  componentDidMount() {
    this.wallet = new TrustWallet('trust-rn-example://');
    this.wallet.installed().then((installed) => {
      if (!installed) {
        Alert.alert('Info', 'Trust Wallet is not installed');
      }
    });
  }

  componentWillUnmount() {
    this.wallet?.cleanup();
  }

  requestAccount(coins: CoinType[]) {
    console.log('requestAccount');
    this.wallet
      ?.requestAccounts(coins)
      .then((accounts) => {
        Alert.alert('Accounts', accounts.join('\n'));
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Error', JSON.stringify(error));
      });
  }

  signMessage() {
    console.log('sign Ethereum message');
    const message = utils.keccak256(this.ethereumMessage('Some message'));
    this.wallet
      ?.signMessage(message, CoinType.ethereum)
      .then((result) => {
        Alert.alert('Signature', result);
      })
      .catch((error) => {
        Alert.alert('Error', JSON.stringify(error));
      });
  }

  ethereumMessage(str: string): Buffer {
    const data = Buffer.from(str, 'utf8');
    const prefix = Buffer.from(
      `\u{19}Ethereum Signed Message:\n${data.length}`,
      'utf8',
    );
    return Buffer.concat([prefix, data]);
  }

  serializeBigInt(value: string): Buffer {
    const serialized = Buffer.from(
      BigNumber.from(value).toHexString().slice(2),
      'hex',
    );
    return serialized;
  }

  signEthereumTransaction(send: boolean = false) {
    console.log('signTransaction send: ' + send);

    const tx = {
      toAddress: '0x728B02377230b5df73Aa4E3192E89b6090DD7312',
      chainId: Buffer.from('0x01', 'hex'),
      nonce: this.serializeBigInt('447'),
      gasPrice: this.serializeBigInt('2112000000'),
      gasLimit: this.serializeBigInt('21000'),
      amount: this.serializeBigInt('10000'),
      payload: Buffer.from("a9059cbb0000000000000000000000000F36f148D6FdEaCD6c765F8f59D4074109E311f0c0000000000000000000000000000000000000000000000000000000000000001", 'hex')
    }
    this.wallet?.signTransaction(tx, CoinType.ethereum, send)
    .then((result) => {
      Alert.alert('Transaction', result);
    })
    .catch((error) => {
      Alert.alert('Error', JSON.stringify(error));
    });
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Request Accounts</Text>
                <Button 
                  title="Ethereum" onPress={() => {
                    this.requestAccount([CoinType.ethereum]);
                  }} 
                />
                <Button
                  title="Ethereum + Cosmos + Binance" onPress={() => {
                    this.requestAccount([
                      CoinType.ethereum,
                      CoinType.cosmos,
                      CoinType.binance,
                    ]);
                  }}
                />
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Sign Transactions</Text>
                <Button
                  title="Sign Ethereum Message" onPress=
                  {() => {
                    this.signMessage();
                  }}
                />
                <Button
                  title="Sign Ethereum Tx"
                  onPress={() => {
                    this.signEthereumTransaction();
                  }}
                />
                <Button
                  title="Sign and Send Ethereum Tx"
                  onPress={() => {
                    this.signEthereumTransaction(true);
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
