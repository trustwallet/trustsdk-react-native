# @trustwallet/rn-sdk

[![npm version](https://badge.fury.io/js/%40trustwallet%2Frn-sdk.svg)](https://badge.fury.io/js/%40trustwallet%2Frn-sdk)
![CI](https://github.com/trustwallet/react-native-trust-sdk/workflows/CI/badge.svg)

[@trustwallet/rn-sdk](https://www.npmjs.com/package/@trustwallet/rn-sdk) is Trust Wallet's react native SDK, it allows you to request accounts, sign messages and transactions.

- Table of Contents
  - [Installation](#installation)
  - [Configuring Android](#configuring-android)
  - [Configuring iOS](#configuring-ios)
  - [Example](#example)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

```shell
npm i @trustwallet/rn-sdk @trustwallet/wallet-core
```

## Configuring Android

Make sure you have set up intent-filter for your app ([documentation here](https://developer.android.com/training/app-links/deep-linking#adding-filters))

The `example` app settings:

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

The `example` app settings:

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
import TrustWallet, {CoinType} from '@trustwallet/rn-sdk'
```

initialize an instance, e.g. in `componentDidMount`:

```typescript
const wallet = new TrustWallet('<your_app_scheme>://');
```

request ETH/BNB accounts:

```typescript
wallet.requestAccounts([CoinType.ethereum, CoinType.binance])
.then((accounts) => {
  Alert.alert('Accounts', accounts.join('\n'))
}).catch(error => {
  Alert.alert('Error', JSON.stringify(error))
})
```

sign an Ethereum message:

```typescript
const message = utils.keccak256(this.ethereumMessage("Some message"))
wallet.signMessage(message, CoinType.ethereum)
.then((result) => {
  Alert.alert('Signature', result)
}).catch(error => {
  Alert.alert('Error', JSON.stringify(error))
})
```

sign an Ethereum transaction on *iOS*:

```typescript
const tx = {
  toAddress: '0x728B02377230b5df73Aa4E3192E89b6090DD7312',
  chainId: Buffer.from('0x01', 'hex'),
  nonce: this.serializeBigInt('447'),
  gasPrice: this.serializeBigInt('2112000000'),
  gasLimit: this.serializeBigInt('21000'),
  amount: this.serializeBigInt('100000000000000')
}
wallet.signTransaction(tx, CoinType.ethereum, send, undefined, Platform.OS)
.then(result =>{
  Alert.alert('Transaction', result)
}).catch(error => {
  Alert.alert('Error', JSON.stringify(error))
})
```

sign an Ethereum transaction on *Android*:

```typescript
const tx = {
  toAddress: '0x1b38BC1D3a7B2a370425f70CedaCa8119ac24576', // Recipient address
  tokenId: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // token (optional), following standard of unique identifier on the blockhain as smart contract address or asset ID
  fromAddress: '0xF36f148D6FdEaCD6c765F8f59D4074109E311f0c', // (Optional) "From" address parameter specifies a wallet which contains given account
  meta: '0xa9059cbb0000000000000000000000000F36f148D6FdEaCD6c765F8f59D4074109E311f0c0000000000000000000000000000000000000000000000000000000000000001', // (Optional) Transaction data in hex format, Memo or Destination tag
  toAddress: '0x728B02377230b5df73Aa4E3192E89b6090DD7312',
  nonce: "447", // (Optional) You can set your custom nonce or sequence
  gasPrice: "2112000000"), // (Optional) You can set your custom fee price in subunit format
  gasLimit: "21000", // (Optional) You can set your custom fee limit in subunit format
  amount: "0.001" // Transaction amount in human-readable (unit) format
  callbackHost: "tx_callback" // (Optional) host of you callback uri
}
wallet.signTransaction(tx, CoinType.ethereum, send, undefined, Platform.OS)
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

MIT
