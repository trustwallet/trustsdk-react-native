import {Linking} from 'react-native';

enum TrustWalletCommand {
  signMessage = 'sign-message',
  signTx = 'sign-transaction'
}

class TrustWallet {
  cbScheme: string = ''
  apps = [{
    name: 'Trust',
    scheme: 'trust',
    installURL: 'https://itunes.apple.com/ru/app/trust-ethereum-wallet/id1288339409'
  }]
  constructor(cbScheme: string) {
    this.cbScheme = cbScheme;
  }

  installed(): boolean {
    const installed = this.apps.filter((app) => Linking.canOpenURL(app.scheme + '://'));
    return installed.length > 0;
  }
}

export function signTransaction(transaction: object): Promise<string> {
  const promise = new Promise<string>((resolve: Function, reject: Function) => {
    resolve("");
  });
  return promise;
}

export function signMessage(message: string): Promise<string> {
  const promise = new Promise<string>((resolve: Function, reject: Function) => {
      resolve("");
  });
  return promise;
}