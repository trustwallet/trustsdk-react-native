import {Linking} from 'react-native';
import {TrustCommand, Payload, MessagePayload, TransactionPayload} from './lib/commands';

class TrustWallet {
  callbackScheme: string
  app = {
    name: 'Trust',
    scheme: 'trust://',
    AppStoreURL: 'https://itunes.apple.com/us/app/trust-ethereum-wallet/id1288339409',
    GooglePlayURL: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp'
  }
  resolvers: {[key: string]: {[key: string]: (value: string) => void}}= {}

  /**
   * constructor
   * @param callbackScheme default callback scheme
   */
  constructor(callbackScheme: string) {
    // Linking.getInitialURL().then((url: string) => this.handleURL(url));
    this.callbackScheme = callbackScheme
    this.start();
  }

  /**
   * start listening openURL event, you don't need to call it unless you explicit called cleanup
   */
  public start() {
    Linking.addEventListener('url', this.handleOpenURL.bind(this));
  }

  /**
   * stop listening openURL event and clean resolvers
   */
  public cleanup() {
    Linking.removeEventListener('url', this.handleOpenURL.bind(this));
    this.resolvers = {};
  }

  /**
   * check if Trust Wallet is installed
   */
  public installed(): Promise<boolean> {
    const testUrl = this.app.scheme + TrustCommand.signMessage; // works for iOS and Android
    return Linking.canOpenURL(testUrl);
  }

  /**
   * sign a transaction
   * @param payload transaction payload
   * @returns {Promise<string>} signed transaction hash
   */
  public signTransaction(payload: TransactionPayload): Promise<string> {
    return this.runCommand(payload);
  }

  /**
   * sign a message
   * @param payload message payload
   * @returns {Promise<string>} signed message hash
   */
  public signMessage(payload: MessagePayload): Promise<string> {
    return this.runCommand(payload)
  }

  /**
   * sign a personal message
   * @param payload message payload
   * @returns {Promise<string>} signed personal message hash
   */
  public signPersonalMessage(payload: MessagePayload): Promise<string> {
    if(payload.type !== TrustCommand.signPersonalMessage) {
      payload.type = TrustCommand.signPersonalMessage;
    }
    return this.runCommand(payload);
  }

  private runCommand(payload: Payload): Promise<string> {
    return this.installed()
    .then((result) => {
      return new Promise<string>((resolve, reject) => {
        if (result) {
          if (payload.callbackScheme.length <= 0) {
            // set default callback scheme
            payload.callbackScheme = this.callbackScheme;
          }
          // tracking resolve/reject by payload id
          this.resolvers[payload.id] = {
            resolve,
            reject
          }
          const url = TrustCommand.getURL(payload);
          Linking.openURL(url);
        } else {
          reject('Trust not installed');
        }
      });
    });
  }

  private handleOpenURL(event: { url: string; }) {
    const response = TrustCommand.parseURL(event.url);
    const resolver = this.resolvers[response.id];
    if (resolver) {
      if (response.error.length > 0) {
        resolver.reject(response.error);
      } else {
        resolver.resolve(response.result);
      }
      delete this.resolvers[response.id];
    }
  }
}

export default TrustWallet;
export {TrustCommand, MessagePayload, TransactionPayload};