# react-native-trust-sdk
[![Build Status](https://travis-ci.org/TrustWallet/react-native-trust-sdk.svg?branch=master)](https://travis-ci.org/TrustWallet/react-native-trust-sdk)
[![npm version](https://badge.fury.io/js/react-native-trust-sdk.svg)](https://badge.fury.io/js/react-native-trust-sdk)

The react-native-trust-sdk lets you sign Ethereum transactions and messages with Trust Wallet so that you can bulid a react native DApp without having to worry about keys or wallets.

* [Installation](#installation)
* [Configuring Android](#configuring-android)
* [Configuring iOS](#configuring-ios)
* [Example](#example)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

## Installation

```shell
npm i react-native-trust-sdk
```

## Configuring Android

> Trust Android is not ready yet.

Make sure you have set up intent-filter for your app ([documentation here](https://developer.android.com/training/app-links/deep-linking#adding-filters))

## Configuring iOS

Make sure you have set up url scheme for your app (Open Xcode an click on your project. Go to the 'Info' tab and expand the 'URL Types' group).

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
npm install && npm start
react-native run-ios
```

![demo gif](doc/demo.gif)

## Usage

import the package:
```typescript
import TrustWallet, { MessagePayload, TransactionPayload } from 'react-native-trust-sdk';
```

initialize an instance, e.g. in `componentDidMount`:
```typescript
const wallet = new TrustWallet('<your_app_scheme>://');
```

sign a message:
```typescript
const payload = new MessagePayload('hello trust');
wallet.signMessage(payload, (result => {
    console.log('Message Signed', result);
}));
```

sign a transaction:
```typescript
var payload = new TransactionPayload('<address>', '<amount>', '<data>');
wallet.signTransaction(payload, (result) => {
    console.log('Transaction Signed', result);
});
```

clean up all callback handlers, e.g. in`componentWillUnmount`:
```typescript
wallet.cleanup();
```

## Contributing

You are welcome! Create pull requests and help to improve the package.

## License

GPLv3
