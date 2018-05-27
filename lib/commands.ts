import {Buffer} from 'buffer';
global.Buffer = Buffer;
import {URL, URLSearchParams} from 'whatwg-url';

export enum TrustCommand {
  signMessage = 'sign-message',
  signTransaction = 'sign-transaction'
}

export namespace TrustCommand {
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

export interface Payload {
    id: string
    callbackScheme: string
    toQuery(): string
}

export class MessagePayload implements Payload {
    id: string = 'msg'
    message: string
    address: string = ''
    callbackScheme: string

    constructor(message: string, callbackScheme: string) {
        this.message = Buffer.from(message).toString('base64');
        this.callbackScheme = callbackScheme;
    }

    toQuery(): string {
        const searchParams = new URLSearchParams({});
        searchParams.append('message', this.message);
        if(this.address.length > 0) {
          searchParams.append('address', this.address);
        }
        const callbackUrl = this.callbackScheme + TrustCommand.signMessage + '?id=' + this.id;
        searchParams.append('callback', callbackUrl);
        return searchParams.toString();
    }
}

export class TransactionPayload implements Payload {
    id: string = 'tx'
    gasPrice: string
    gasLimit: string
    to: string
    amount: string
    nonce: string
    data: string
    callbackScheme: string

    constructor(to: string, amount: string, callbackScheme: string, data?: string, gasPrice?: string, gasLimit?: string, nonce?: string) {
      this.to = to;
      this.amount = amount;
      this.callbackScheme = callbackScheme;
      this.gasPrice = gasPrice || '21';
      this.gasLimit = gasLimit || '21000';
      this.nonce = nonce || '0';
      this.data = data || '';
    }

    toQuery(): string {
        const searchParams = new URLSearchParams({});
        searchParams.append('gasPrice', this.gasPrice);
        searchParams.append('gasLimit', this.gasLimit);
        searchParams.append('to', this.to);
        searchParams.append('amount', this.amount);
        if (this.data.length > 0) {
          searchParams.append('data', this.data);
        }
        searchParams.append('nonce', this.nonce);
        const callbackUrl = this.callbackScheme + TrustCommand.signTransaction + '?id=' + this.id;
        searchParams.append('callback', callbackUrl);
        return searchParams.toString();
    }
}
