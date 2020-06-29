# react-native-trust-sdk

![CI](https://github.com/trustwallet/react-native-trust-sdk/workflows/CI/badge.svg)
[![npm version](https://badge.fury.io/js/react-native-trust-sdk.svg)](https://badge.fury.io/js/react-native-trust-sdk)
[![Coverage Status](https://coveralls.io/repos/github/TrustWallet/react-native-trust-sdk/badge.svg?branch=master)](https://coveralls.io/github/TrustWallet/react-native-trust-sdk?branch=master)

The react-native-trust-sdk lets you sign Ethereum transactions and messages with Trust Wallet so that you can bulid a react native DApp without having to worry about keys or wallets.

- [react-native-trust-sdk](#react-native-trust-sdk)
  - [Installation](#installation)
  - [Configuring Android](#configuring-android)
  - [Configuring iOS](#configuring-ios)
  - [Example](#example)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

```shell
npm i react-native-trust-sdk
```

## Configuring Android

Make sure you have set up intent-filter for your app ([documentation here](https://developer.android.com/training/app-links/deep-linking#adding-filters))

example app settings:

```xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask"
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:scheme="trust-rn-example"/>
    </intent-filter>
</activity>
```

## Configuring iOS

Make sure you have set up url scheme for your app (Open Xcode an click on your project. Go to the 'Info' tab and expand the 'URL Types' group).

example app settings:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>trust-rn-example</string>
    </array>
  </dict>
</array>
```

```objc
// iOS 9.x or newer
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

// If your app is using Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}
```

## Example

Checkout the example typescript project in `example` folder.

```shell
git clone git@github.com:TrustWallet/react-native-trust-sdk.git
cd react-native-trust-sdk/example
npm install && npm start
react-native run-ios
```

![demo gif](https://user-images.githubusercontent.com/360470/86009121-669bf880-ba4c-11ea-8bb7-3c2d8a139a68.gif)

## Usage

import the package:

```typescript
import TrustWallet, {CoinType} from 'react-native-trust-sdk'
```

initialize an instance, e.g. in `componentDidMount`:

```typescript
const wallet = new TrustWallet('<your_app_scheme>://');
```

request accounts

```typescript
wallet.requestAccounts([CoinType.ethereum, CoinType.binance])
.then((accounts) => {
  Alert.alert('Accounts', accounts.join('\n'))
}).catch(error => {
  console.log(error)
  Alert.alert('Error', JSON.stringify(error))
})
```

sign a message:

```typescript
const message = utils.keccak256(this.ethereumMessage("Some message"))
wallet.signMessage(message, CoinType.ethereum)
.then((result) => {
  Alert.alert('Signature', result)
}).catch(error => {
  Alert.alert('Error', JSON.stringify(error))
})
```

sign a transaction:

```typescript
const tx = {
  toAddress: '0x728B02377230b5df73Aa4E3192E89b6090DD7312',
  chainId: Buffer.from('0x01', 'hex'),
  nonce: this.serializeBigInt('447'),
  gasPrice: this.serializeBigInt('2112000000'),
  gasLimit: this.serializeBigInt('21000'),
  amount: this.serializeBigInt('100000000000000')
}
wallet.signTransaction(tx, CoinType.ethereum, send)
.then(result =>{
  Alert.alert('Transaction', result)
}).catch(error => {
  Alert.alert('Error', JSON.stringify(error))
})
```

clean up all resolve handlers, e.g. in`componentWillUnmount`:

```typescript
wallet.cleanup();
```

## Contributing

You are welcome! Create pull requests and help to improve the package.

## License

GPLv3
