import {Linking} from 'react-native';
import {TrustCommand, Payload, MessagePayload, TransactionPayload} from './lib/commands';

export enum TrustError {
  // Unknown Error
  unknown = -1,
  // No Error occurred
  none = 0,
  // Error generated when the user cancells the sign request.
  cancelled = 1,
  // Error generated when the request is invalid.
  invalidRequest = 2,
  // Error generated when current wallet is watch only
  watchOnly = 3,

  // Error generated when Trust Wallet is not installed
  notInstalled = 1000
}

export namespace TrustError {
  export function toString(error: TrustError) {
    switch(error) {
      case TrustError.unknown:
        return 'Unknown Error';
      case TrustError.none:
        return 'No Error';
      case TrustError.cancelled:
        return 'User cancelled';
      case TrustError.invalidRequest:
        return 'Signing request is invalid';
      case TrustError.watchOnly:
        return 'Wallet is watch only';
      case TrustError.notInstalled:
        return 'Trust Wallet is not installed';
      default:
        return ''
    }
  }
}

class TrustWallet {
  callbackScheme: string
  app = {
    name: 'Trust',
    scheme: 'trust://',
    AppStoreURL: 'https://itunes.apple.com/us/app/trust-ethereum-wallet/id1288339409',
    GooglePlayURL: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp'
  }
  resolvers: {[key: string]: (value: string) => void} = {}
  rejectors: {[key: string]: (value: Object) => void} = {}

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
          this.resolvers[payload.id] = resolve;
          this.rejectors[payload.id] = reject;
          const url = TrustCommand.getURL(payload);
          Linking.openURL(url);
        } else {
          reject({
            code: TrustError.notInstalled,
            msg: TrustError.toString(TrustError.notInstalled)
          });
        }
      });
    });
  }

  private handleOpenURL(event: { url: string; }) {
    const response = TrustCommand.parseURL(event.url);
    const errorCode = parseInt(response.error);
    const resolver = this.resolvers[response.id];
    const rejector = this.rejectors[response.id];
    if (!resolver || !rejector) {
      return;
    }

    if (errorCode !== TrustError.none) {
        rejector({
          code: errorCode,
          msg: TrustError.toString(errorCode)
        });
    } else {
        resolver(response.result);
    }
    delete this.resolvers[response.id];
    delete this.rejectors[response.id];
  }
}

export default TrustWallet;
export {TrustCommand, MessagePayload, TransactionPayload};