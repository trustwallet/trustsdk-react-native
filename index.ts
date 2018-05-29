import {Linking} from 'react-native';
import {URL} from 'whatwg-url';
import {TrustCommand, Payload, MessagePayload, TransactionPayload} from './lib/commands';

class TrustWallet {
  callbackScheme: string
  apps = [{
    name: 'Trust',
    scheme: 'trust://',
    installURL: 'https://itunes.apple.com/ru/app/trust-ethereum-wallet/id1288339409'
  }]
  callbacks: {[key: string]: (value?: string | undefined) => void}= {}

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
   * start listening openURL event
   */
  public start() {
    Linking.addEventListener('url', this.handleOpenURL.bind(this));
  }

  /**
   * clean callbacks and stop listening openURL event
   */
  public cleanup() {
    Linking.removeEventListener('url', this.handleOpenURL.bind(this));
    this.callbacks = {};
  }

  /**
   * check if Trust Wallet is installed
   */
  public installed(): boolean {
    const installed = this.apps.filter((app) => Linking.canOpenURL(app.scheme + ''));
    return installed.length > 0;
  }

  /**
   * sign a transaction
   * @param payload transaction payload
   * @param callback callback handler
   */
  public signTransaction(payload: TransactionPayload, callback: (value?: string | undefined) => void) {
    return this.runCommand(payload, callback);
  }

  /**
   * sign a message
   * @param payload message payload
   * @param callback callback handler
   */
  public signMessage(payload: MessagePayload, callback: (value?: string | undefined) => void) {
    return this.runCommand(payload, callback);
  }

  /**
   * sign a personal message
   * @param payload message payload
   * @param callback callback handler
   */
  public signPersonalMessage(payload: MessagePayload, callback: (value?: string | undefined) => void) {
    if(payload.type !== TrustCommand.signPersonalMessage) {
      payload.type = TrustCommand.signPersonalMessage;
    }
    return this.runCommand(payload, callback);
  }

  private runCommand(payload: Payload, callback: (value?: string | undefined) => void) {
    if (!this.installed()) {
      callback();
    }
    if (payload.callbackScheme.length <= 0) {
      // set default callback scheme
      payload.callbackScheme = this.callbackScheme;
    }
    // tracking callback handlers by payload id
    this.callbacks[payload.id] = callback;
    const url = TrustCommand.getURL(payload);
    Linking.openURL(url);
  }

  private handleOpenURL(event: { url: string; }) {
    const response = TrustCommand.parseURL(event.url);
    const callback = this.callbacks[response.id];
    if (callback) {
      callback(response.result);
      delete this.callbacks[response.id];
    }
  }
}

export default TrustWallet;
export {TrustCommand, MessagePayload, TransactionPayload};