import URL from 'url-parse'
import { CoinType } from './wallet-core'
import { TrustError } from './errors'

export enum TrustCommand {
  requestAccounts = 'sdk_get_accounts',
  signTransaction = 'sdk_sign'
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
  export function parseURL(urlString: string): {id: string, result: string, error: string} {
    const url = URL(urlString, '', true)
    const id = url.query.id || ''
    let error = '' + TrustError.invalidResponse
    let result = ''
    if (!id) {
      return {id, result, error}
    }
    error = url.query.error || TrustError.none
    if (id.startsWith('acc_')) {
      result = url.query.accounts || ''
    } else if (id.startsWith('sign_')) {
      result = url.query.data || ''
      if (result.length < 0) {
        result = url.query.tx_hash || ''
      }
    }
    return {id, result, error}
  }

  /**
   * generate url for Linking.openURL
   * @param data concrete command payload
   * @param scheme target wallet scheme default: trust://
   */
  export function getURL(request: Request, scheme: string = 'trust://'): string {
    let query = processQuery(request.toQuery())
    var msgUrl = URL(scheme + request.command + '?' + query)
    return msgUrl.toString()
  }

  export function processQuery(query: QueryItem[]): string {
    return query.map((pair) => {
      return pair.k + '=' + pair.v
    }).join('&')
  }
}

/**
 * Abstract Request for TrustCommand
 */
export interface Request {
  id: string
  command: string
  callbackScheme: string
  callbackPath: string
  toQuery(): QueryItem[]
}

class QueryItem {
  k: string
  v: string
  constructor(k: string, v: string) {
    this.k = k
    this.v = v
  }
}

export class AccountsRequest implements Request {
  id: string
  command: string = TrustCommand.requestAccounts
  coins: CoinType[]
  callbackScheme: string
  callbackPath: string

  constructor(coins: CoinType[], callbackId: string, callbackScheme?: string, callbackPath?: string) {
    this.coins = coins
    this.callbackScheme = callbackScheme || ''
    this.callbackPath = callbackPath || TrustCommand.requestAccounts
    this.id = callbackId
  }

  toQuery(): QueryItem[] {
    var array: QueryItem[] = []
    if (this.coins.length > 0) {
      this.coins.forEach((coin, index) => {
        array.push({k: `coins.${index}`, v: `${coin}`})
      })
    } else {
      return []
    }
    if(this.callbackScheme.length > 0) {
      array.push({k: 'app', v: this.callbackScheme})
      array.push({k: 'callback', v: this.callbackPath})
    }
    array.push({k: 'id', v: this.id})
    return array
  }
}

export class DAppMetadata {
  name: string
  url: string

  constructor(name: string, url: string) {
    this.name = name
    this.url = url
  }


  toQuery(): QueryItem[] {
    return [
      {k: 'meta.__name', v: 'dApp'},
      {k: 'meta.name', v: this.name},
      {k: 'meta.url', v: this.url},
    ]
  }
}

export class TransactionRequest implements Request {
  id: string
  command: string = TrustCommand.signTransaction
  coin: CoinType
  data: string
  send: boolean
  meta?: DAppMetadata
  callbackScheme: string
  callbackPath: string

  constructor(coin: CoinType, data: string, callbackId: string, send?: boolean, meta?: DAppMetadata, callbackScheme?: string, callbackPath?: string) {
    this.coin = coin
    this.data = data
    this.send = send || false
    this.meta = meta
    this.callbackScheme = callbackScheme || ''
    this.callbackPath = callbackPath || TrustCommand.signTransaction
    this.id = callbackId
  }

  toQuery(): QueryItem[] {
    var array: QueryItem[] = []
    array.push({k: 'coin', v: `${this.coin}`})
    array.push({k: 'data', v: this.data})
    if (this.meta) {
      array = array.concat(this.meta.toQuery())
    }
    array.push({k: 'send', v: `${this.send}`})
    if(this.callbackScheme.length > 0) {
      array.push({k: 'app', v: this.callbackScheme})
      array.push({k: 'callback', v: this.callbackPath})
    }
    array.push({k: 'id', v: this.id})
    return array
  }
}
