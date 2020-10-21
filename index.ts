import { Linking } from "react-native";
import { Buffer } from "buffer";
import {
  TrustCommand,
  Request,
  AccountsRequest,
  MessageRequest,
  TransactionRequest,
  AndroidTransactionRequest,
  DAppMetadata,
} from "./lib/commands";
import { TrustError } from "./lib/errors";
import { TW, CoinType } from "@trustwallet/wallet-core";
import {utils, BigNumber} from 'ethers';

class TrustWallet {
  callbackScheme: string;
  callbackId = new Date().getTime();
  app = {
    name: "Trust",
    scheme: "trust://",
    AppStoreURL:
      "https://itunes.apple.com/us/app/trust-ethereum-wallet/id1288339409",
    GooglePlayURL:
      "https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp",
  };
  resolvers: { [key: string]: (value: string) => void } = {};
  rejectors: { [key: string]: (value: Object) => void } = {};

  /**
   * constructor
   * @param callbackScheme default callback scheme
   */
  constructor(callbackScheme: string) {
    // Linking.getInitialURL().then((url: string) => this.handleURL(url))
    this.callbackScheme = callbackScheme;
    this.start();
  }

  /**
   * start listening openURL event, you don"t need to call it unless you explicit called cleanup
   */
  public start() {
    Linking.addEventListener("url", this.handleOpenURL.bind(this));
  }

  /**
   * stop listening openURL event and clean resolvers
   */
  public cleanup() {
    Linking.removeEventListener("url", this.handleOpenURL.bind(this));
    this.resolvers = {};
  }

  /**
   * check if Trust Wallet is installed
   */
  public installed(): Promise<boolean> {
    const testUrl = this.app.scheme + TrustCommand.requestAccounts; // works for iOS and Android
    return Linking.canOpenURL(testUrl);
  }

  /**
   * request coin addresses
   * @param request account request
   * @returns {Promise<string>} signed transaction hash
   */
  public requestAccounts(coins: CoinType[]): Promise<string[]> {
    const request = new AccountsRequest(
      coins,
      this.genId("acc_"),
      this.callbackScheme
    );
    return this.sendRequest(request).then((result) => {
      return result.split(",");
    });
  }

  /**
   * sign a transaction
   * @param request message request
   * @returns {Promise<string>} signed transaction hash
   */
  public signMessage(message: string, coin: CoinType): Promise<string> {
    const request = new MessageRequest(
      coin,
      message,
      this.genId("msg_"),
      this.callbackScheme
    );
    return this.sendRequest(request);
  }

  /**
   * sign a transaction
   * @param request transaction request
   * @returns {Promise<string>} signed transaction hash
   */
  public signTransaction(
    input: Object,
    coin: CoinType,
    send: boolean = false,
    meta?: DAppMetadata,
    platform?: string
  ): Promise<string> {
    if (platform === "android") {
      return this.signAndroidTransaction(coin, input, send);
    } else {
      return this.signIOSTransaction(input, coin, send, meta);
    }
  }

  private signIOSTransaction(
    input: Object,
    coin: CoinType,
    send: boolean = false,
    meta?: DAppMetadata
  ): Promise<string> {
    let data = new Uint8Array(0);
    switch (coin) {
      case CoinType.ethereum:
        let proto = TW.Ethereum.Proto.SigningInput.create(input);
        data = TW.Ethereum.Proto.SigningInput.encode(proto).finish();
        break;
      default:
        throw new Error("not implemented yet");
    }
    const request = new TransactionRequest(
      coin,
      Buffer.from(data).toString("base64"),
      this.genId("tx_"),
      send,
      meta,
      this.callbackScheme
    );
    return this.sendRequest(request);
  }

  private signAndroidTransaction(
    coin: CoinType,
    input: Object,
    send: boolean
  ): Promise<string> {
    const object = input as {
      amount: Buffer;
      toAddress: string;
      nonce?: Buffer;
      gasPrice?: Buffer;
      gasLimit?: Buffer;
      payload?: Buffer;
      chainId?: Buffer;
    };
    switch (coin) {
      case CoinType.ethereum:
        const request = new AndroidTransactionRequest(
          coin.toString(),
          object["toAddress"],
          this.deserializeBigInt(object["amount"]) || "0",
          this.callbackScheme,
          send,
          this.genId("tx_"),
          this.deserializeBigInt(object["nonce"]),
          this.deserializeBigInt(object["gasPrice"]),
          this.deserializeBigInt(object["gasLimit"]),
          (object["payload"] || '').toString('hex')
        );
        return this.sendRequest(request);
        break;
      default:
        throw new Error("not implemented yet");
    }
  }

  private deserializeBigInt(value?: Buffer): string | undefined {
    if (value) {
      return BigNumber.from('0x' + value.toString('hex')).toString();
    } else {
      return undefined;
    }
  }

  private genId(prefix?: string): string {
    this.callbackId++;
    return (prefix || "") + this.callbackId;
  }

  private sendRequest(request: Request): Promise<string> {
    return this.installed().then((result) => {
      return new Promise<string>((resolve, reject) => {
        if (result) {
          if (request.callbackScheme.length <= 0) {
            // set default callback scheme
            request.callbackScheme = this.callbackScheme;
          }
          // tracking resolve/reject by payload id
          this.resolvers[request.id] = resolve;
          this.rejectors[request.id] = reject;
          const url = TrustCommand.getURL(request);
          Linking.openURL(url);
        } else {
          reject({
            error: TrustError.notInstalled,
            message: TrustError.toString(TrustError.notInstalled),
          });
        }
      });
    });
  }

  private handleOpenURL(event: { url: string }) {
    const response = TrustCommand.parseURL(event.url);
    const resolver = this.resolvers[response.id];
    const rejector = this.rejectors[response.id];
    if (!resolver || !rejector) {
      return;
    }
    if (response.error !== TrustError.none) {
      rejector({
        error: response.error,
        message: TrustError.toString(response.error),
      });
    } else {
      resolver(response.result);
    }
    delete this.resolvers[response.id];
    delete this.rejectors[response.id];
  }
}

export default TrustWallet;
export {
  TrustCommand,
  AccountsRequest,
  MessageRequest,
  TransactionRequest,
  AndroidTransactionRequest,
  CoinType,
  TrustError,
  DAppMetadata,
};
