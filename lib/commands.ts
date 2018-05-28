import {Buffer} from 'buffer';
global.Buffer = Buffer;
import {URL, URLSearchParams} from 'whatwg-url';

export enum TrustCommand {
  // sign a message
  signMessage = 'sign-message',
  // sign a transaction
  signTransaction = 'sign-transaction'
}

/**
 * @typedef {Object} Result
 * @property {string} id payload id
 * @property {string} result result value
 */

export namespace TrustCommand {
  /**
   * helper method to parse url called back from Trust
   * @param urlString url called back
   * @returns {Result} parsed result
   */
  export function parseURL(urlString: string): {id: string, result: string} {
    const url = new URL(urlString);
    const id = url.searchParams.get('id') || '';
    let result = url.searchParams.get('result') || '';
    result = result.replace(/ /g, '+');
    return {
      'id': id,
      'result': Buffer.from(result, 'base64').toString('hex')
    };
  }

  /**
   * generate url for Linking.openURL
   * @param command concrete TrustCommand
   * @param data concrete command payload
   * @param scheme target wallet scheme default: trust://
   */
  export function getURL(command: TrustCommand, data: Payload, scheme: string = 'trust://'): string {
    switch(command) {
        case TrustCommand.signMessage:
            var msgUrl = new URL(scheme + TrustCommand.signMessage + '?' + data.toQuery());
            return msgUrl.toString();
        case TrustCommand.signTransaction:
            var txUrl = new URL(scheme + TrustCommand.signTransaction + '?' + data.toQuery());
            return txUrl.toString();
    }
  }
}

/**
 * Abstract Payload for TrustCommand
 */
export interface Payload {
  // payload bookkeeping id
  id: string
  // scheme for Trust calls back
  callbackScheme: string
  // convert to query string
  toQuery(): string
}

/**
 * MessagePayload for TrustCommand.signMessage
 */
export class MessagePayload implements Payload {
  id: string
  message: string
  address: string
  callbackScheme: string

  /**
   * constructor
   * @param message message to sign
   * @param address optional wallet address
   * @param callbackScheme scheme for Trust calls back
   */
  constructor(message: string, address?: string, callbackScheme?: string) {
    this.message = Buffer.from(message).toString('base64');
    this.address = address || '';
    this.callbackScheme = callbackScheme || '';
    this.id = 'msg_' + (new Date()).getTime();
  }

  toQuery(): string {
    const searchParams = new URLSearchParams({});
    searchParams.append('message', this.message);
    if(this.address.length > 0) {
      searchParams.append('address', this.address);
    }
    if(this.callbackScheme.length > 0) {
      const callbackUrl = this.callbackScheme + TrustCommand.signMessage + '?id=' + this.id;
      searchParams.append('callback', callbackUrl);
    }
    return searchParams.toString();
  }
}

/**
 * TransactionPayload for TrustCommand.signTransaction
 */
export class TransactionPayload implements Payload {
  id: string
  gasPrice: string
  gasLimit: string
  to: string
  amount: string
  nonce: string
  data: string
  callbackScheme: string

  /**
   * constructor
   * @param to EIP55 Address
   * @param amount Amount
   * @param data optioanl transaction data represented by hex string
   * @param gasPrice default: 21, unit: Gwei
   * @param gasLimit default: 21000
   * @param nonce default: 0
   * @param callbackScheme scheme for Trust calls back
   */
  constructor(to: string, amount: string, data?: string, gasPrice?: string, gasLimit?: string, nonce?: string, callbackScheme?: string) {
    this.to = to;
    this.amount = amount;
    this.data = data || '';
    this.gasPrice = gasPrice || '21';
    this.gasLimit = gasLimit || '21000';
    this.nonce = nonce || '0';
    this.callbackScheme = callbackScheme || '';
    this.id = 'tx_' + (new Date()).getTime();
  }

  toQuery(): string {
    const searchParams = new URLSearchParams({});
    searchParams.append('to', this.to);
    searchParams.append('amount', this.amount);
    searchParams.append('gasPrice', this.gasPrice);
    searchParams.append('gasLimit', this.gasLimit);
    if (this.data.length > 0) {
      searchParams.append('data', this.data);
    }
    searchParams.append('nonce', this.nonce);
    if (this.callbackScheme.length > 0) {
      const callbackUrl = this.callbackScheme + TrustCommand.signTransaction + '?id=' + this.id;
      searchParams.append('callback', callbackUrl);
    }
    return searchParams.toString();
  }
}
