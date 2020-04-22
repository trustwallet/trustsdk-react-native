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
  Alert
} from 'react-native';

import {
  Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import TrustWallet, {CoinType} from './lib';

declare const global: {HermesInternal: null | {}};

class App extends React.Component {
  wallet?: TrustWallet

  componentDidMount() {
    this.wallet = new TrustWallet("trust-rn-example://");
    this.wallet.installed().then(installed => {
      if (!installed) {
        Alert.alert('Info', 'Trust Wallet is not installed');
      }
    });
  }

  componentWillUnmount() {
    this.wallet?.cleanup();
  }

  requestAccount(coins: CoinType[]) {
    console.log("requestAccount");
    this.wallet?.requestAccounts(coins)
    .then((accounts) => {
      Alert.alert('Accounts', accounts.join('\n'));
    }).catch(console.log);
  }

  signTransaction(send: boolean = false) {

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
                <Text style={styles.sectionDescription}>                
                </Text>
                <Button title='Ethereum' onPress={() => {
                  this.requestAccount([CoinType.ethereum]);
                }} />
                <Button title='Ethereum + Cosmos +Binance' onPress={() => {
                  this.requestAccount([CoinType.ethereum, CoinType.cosmos, CoinType.binance]);
                }}/>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Sign Transactions</Text>
                <Text style={styles.sectionDescription}>                
                </Text>
                <Button title='Sign Ethereum' onPress={() => {
                  this.signTransaction();
                }} />
                <Button title='Sign and Send Ethereum' onPress={() => {
                  this.signTransaction(true);
                }}/>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
};

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
