import {Buffer} from 'buffer';
global.Buffer = Buffer;
import URL from 'url-parse';

export enum TrustCommand {
  // sign a message
  signMessage = 'sign-message',
  // sign a personal message
  signPersonalMessage = 'sign-personal-message',
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
    const url = URL(urlString, '', true);
    const id = url.query.id || '';
    let result = url.query.result || '';
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
  export function getURL(data: Payload, scheme: string = 'trust://'): string {
    var msgUrl = URL(scheme + data.type + '?' + data.toQuery());
    return msgUrl.toString();
  }
}

/**
 * Abstract Payload for TrustCommand
 */
export interface Payload {
  // payload bookkeeping id
  id: string
  // payload type
  type: TrustCommand
  // scheme for Trust calls back
  callbackScheme: string
  // convert to query string
  toQuery(): string
}

/**
 * MessagePayload for TrustCommand.signMessage|.signPersonalMessage
 */
export class MessagePayload implements Payload {
  id: string
  message: string
  address: string
  callbackScheme: string
  type: TrustCommand = TrustCommand.signMessage

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
    var array = [];
    array.push({k: 'message', v: this.message});
    if(this.address.length > 0) {
      array.push({k: 'address', v: this.address});
    }
    if(this.callbackScheme.length > 0) {
      const callbackUrl = this.callbackScheme + this.type + '?id=' + this.id;
      array.push({k: 'callback', v: callbackUrl});
    }
    return array.map((pair) => {
      return pair.k + '=' + encodeURIComponent(pair.v);
    }).join('&');
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
  type: TrustCommand = TrustCommand.signTransaction

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
    var array = [];
    array.push({k: 'to', v: this.to});
    array.push({k: 'amount', v: this.amount});
    array.push({k: 'gasPrice', v: this.gasPrice});
    array.push({k: 'gasLimit', v: this.gasLimit});
    if(this.data.length > 0) {
      array.push({k: 'data', v: this.data});
    }
    array.push({k: 'nonce', v: this.nonce});
    if(this.callbackScheme.length > 0) {
      const callbackUrl = this.callbackScheme + TrustCommand.signTransaction + '?id=' + this.id;
      array.push({k: 'callback', v: callbackUrl});
    }
    return array.map((pair) => {
      return pair.k + '=' + encodeURIComponent(pair.v);
    }).join('&');
  }
}
