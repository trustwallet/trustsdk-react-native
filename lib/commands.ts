import URL from "url-parse";
import { CoinType } from "@trustwallet/wallet-core";
import { TrustError } from "./errors";

export enum TrustCommand {
  requestAccounts = "sdk_get_accounts",
  signTransaction = "sdk_sign",
  signMessage = "sdk_sign_message",
  androidTransaction = "sdk_transaction",
}

/**
 * @typedef {Object} Result
 * @property {string} id request id
 * @property {string} result result value
 * @property {string} error error message
 */
export namespace TrustCommand {
  /**
   * helper method to parse url called back from Trust
   * @param urlString url called back
   * @returns {Result} parsed result
   */
  export function parseURL(
    urlString: string
  ): { id: string; result: string; error: string } {
    const url = URL(urlString, "", true);
    const id = url.query.id || "";
    let error = "" + TrustError.invalidResponse;
    let result = "";
    if (!id) {
      return { id, result, error };
    }
    error = url.query.error || TrustError.none;
    if (id.startsWith("acc_")) {
      result = url.query.accounts || "";
    } else if (id.startsWith("msg_")) {
      result = url.query.signature || "";
    } else if (id.startsWith("tx_")) {
      result = url.query.data || url.query.transaction_hash || url.query.transaction_sign || "";
    }
    return { id, result, error };
  }

  /**
   * generate url for Linking.openURL
   * @param data concrete command payload
   * @param scheme target wallet scheme default: trust://
   */
  export function getURL(
    request: Request,
    scheme: string = "trust://"
  ): string {
    let query = processQuery(request.toQuery());
    var msgUrl = URL(scheme + request.command + "?" + query);
    return msgUrl.toString();
  }

  export function processQuery(query: QueryItem[]): string {
    return query
      .map((pair) => {
        return pair.k + "=" + pair.v;
      })
      .join("&");
  }
}

/**
 * Abstract Request for TrustCommand
 */
export interface Request {
  id: string;
  command: string;
  callbackScheme: string;
  callbackPath: string;
  toQuery(): QueryItem[];
}

class QueryItem {
  k: string;
  v: string;
  constructor(k: string, v: string) {
    this.k = k;
    this.v = v;
  }
}

export class AccountsRequest implements Request {
  id: string;
  command: string = TrustCommand.requestAccounts;
  coins: CoinType[];
  callbackScheme: string;
  callbackPath: string;

  constructor(
    coins: CoinType[],
    callbackId: string,
    callbackScheme?: string,
    callbackPath?: string
  ) {
    this.coins = coins;
    this.callbackScheme = callbackScheme || "";
    this.callbackPath = callbackPath || TrustCommand.requestAccounts;
    this.id = callbackId;
  }

  toQuery(): QueryItem[] {
    var array: QueryItem[] = [];
    if (this.coins.length > 0) {
      this.coins.forEach((coin, index) => {
        array.push({ k: `coins.${index}`, v: `${coin}` });
      });
    } else {
      return [];
    }
    if (this.callbackScheme.length > 0) {
      array.push({ k: "app", v: this.callbackScheme });
      array.push({ k: "callback", v: this.callbackPath });
    }
    array.push({ k: "id", v: this.id });
    return array;
  }
}

export class DAppMetadata {
  name: string;
  url: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
  }

  toQuery(): QueryItem[] {
    return [
      { k: "meta.__name", v: "dApp" },
      { k: "meta.name", v: this.name },
      { k: "meta.url", v: this.url },
    ];
  }
}

export class TransactionRequest implements Request {
  id: string;
  command: string = TrustCommand.signTransaction;
  coin: CoinType;
  data: string;
  send: boolean;
  meta?: DAppMetadata;
  callbackScheme: string;
  callbackPath: string;

  constructor(
    coin: CoinType,
    data: string,
    callbackId: string,
    send?: boolean,
    meta?: DAppMetadata,
    callbackScheme?: string,
    callbackPath?: string
  ) {
    this.coin = coin;
    this.data = data;
    this.send = send || false;
    this.meta = meta;
    this.callbackScheme = callbackScheme || "";
    this.callbackPath = callbackPath || TrustCommand.signTransaction;
    this.id = callbackId;
  }

  toQuery(): QueryItem[] {
    var array: QueryItem[] = [];
    array.push({ k: "coin", v: `${this.coin}` });
    array.push({ k: "data", v: this.data });
    if (this.meta) {
      array = array.concat(this.meta.toQuery());
    }
    array.push({ k: "send", v: `${this.send}` });
    if (this.callbackScheme.length > 0) {
      array.push({ k: "app", v: this.callbackScheme });
      array.push({ k: "callback", v: this.callbackPath });
    }
    array.push({ k: "id", v: this.id });
    return array;
  }
}

export class AndroidTransactionRequest implements Request {
  coin: string;
  toAddress: string;
  nonce?: string;
  gasPrice?: string;
  gasLimit?: string;
  amount: string;
  meta: string;
  id: string = "0";
  command: string = TrustCommand.androidTransaction;
  callbackScheme: string;
  callbackPath: string;
  confirmType: string;

  constructor(
    coin: string,
    toAddress: string,
    amount: string,
    callbackScheme: string,
    send: boolean,
    callbackId: string,
    nonce?: string,
    gasPrice?: string,
    gasLimit?: string,
    meta?: string
  ) {
    this.coin = coin;
    this.toAddress = toAddress;
    this.nonce = nonce;
    this.gasPrice = gasPrice;
    this.gasLimit = gasLimit;
    this.amount = amount;
    this.meta = meta || "";
    this.callbackScheme = callbackScheme;
    this.callbackPath = TrustCommand.signTransaction;
    this.id = callbackId;
    if (send) {
      this.confirmType = "send";
    } else {
      this.confirmType = "sign";
    }
  }

  toQuery(): QueryItem[] {
    var array: QueryItem[] = [];
    array.push({ k: "asset", v: 'c' + this.coin });
    array.push({ k: "to", v: this.toAddress });
    array.push({ k: "meta", v: this.meta });
    if (this.nonce) {
      array.push({ k: "nonce", v: this.nonce });
    }
    if (this.gasPrice) {
      array.push({ k: "fee_price", v: this.gasPrice });
    }
    if (this.gasLimit) {
      array.push({ k: "fee_limit", v: this.gasLimit });
    }
    array.push({ k: "wei_amount", v: this.amount });
    array.push({ k: "action", v: "transfer" });
    array.push({ k: "confirm_type", v: this.confirmType });
    array.push({ k: "callback", v: this.callbackScheme + this.callbackPath });
    array.push({ k: "id", v: this.id });
    return array;
  }
}

export class MessageRequest implements Request {
  id: string;
  command: string = TrustCommand.signMessage;
  coin: CoinType;
  message: string;
  callbackScheme: string;
  callbackPath: string;

  constructor(
    coin: CoinType,
    message: string,
    callbackId: string,
    callbackScheme?: string,
    callbackPath?: string
  ) {
    this.coin = coin;
    this.message = message;
    this.callbackScheme = callbackScheme || "";
    this.callbackPath = callbackPath || TrustCommand.signMessage;
    this.id = callbackId;
  }

  toQuery(): QueryItem[] {
    var array: QueryItem[] = [];
    array.push({ k: "coin", v: `${this.coin}` });
    array.push({ k: "data", v: this.message });
    if (this.callbackScheme.length > 0) {
      array.push({ k: "app", v: this.callbackScheme });
      array.push({ k: "callback", v: this.callbackPath });
    }
    array.push({ k: "id", v: this.id });
    return array;
  }
}
