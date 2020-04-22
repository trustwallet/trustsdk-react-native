'use strict'
var { TrustCommand, AccountsRequest, TransactionRequest, TrustError, DAppMetadata} = require('../dist')
var { CoinType } = require('../dist')
var TrustWallet = require('../dist').default

var TestCallbackScheme = 'trust-rn-example'

describe('TrustWallet tests', () => {
  var wallet = new TrustWallet('test')
  wallet.callbackId = 1527509558000
  test('constructor()', () => {
    expect(wallet.callbackScheme).toBe('test')
  })

  test('cleanup()', () => {
    var testWallet = new TrustWallet('test')
    testWallet.cleanup()
    expect(testWallet.resolvers).toEqual({})
  })

  test('installed()', () => {
    return wallet.installed().then(result => {
      expect(result).toEqual(true)
    })
  })

  test('requestAccounts()', () => {
    setTimeout(() => {
      wallet.handleOpenURL({
          url: 'test://sdk_sign_result?accounts=0xFC6CD054fAc48Df3744B42ea82E1Dd0fa7027086,bnb16cddarwr2gnf825fx5gyf676rakc4mwcnxzs7c&id=acc_1527509558001'
      });
    }, 1000);
    return wallet.requestAccounts([CoinType.ethereum, CoinType.binance]).then(result => {
      expect(result).toEqual(['0xFC6CD054fAc48Df3744B42ea82E1Dd0fa7027086', 'bnb16cddarwr2gnf825fx5gyf676rakc4mwcnxzs7c'])
    });
  })

  // test('signTransaction()', () => {
  //   var request = new TransactionRequest(ToAddress, '1')
  //   request.id = 'sign_sign_test'
  //   setTimeout(() => {
  //     wallet.handleOpenURL({
  //         url: 'test://sign-transaction?id=sign_sign_test&result=+HqAhDuaygCCUgiU5HSUN5wdSO5zRUwlGmOV/dT560MBlo+DQicAAAAAAAAAAAAAAAAAAAAAUiSB6qAEZLRc+TkIfbo5mPqsXEYBY+62m5AK8OuKz0z63hQg8aA4VF1NOW3edsGon0Sucr0G5AHxG3ddGz+PUgnD1ELqgA%3D%3D'
  //     })
  //   }, 10)
  //   return wallet.signTransaction(request).then(result => {
  //     expect(result).toEqual('f87a80843b9aca0082520894e47494379c1d48ee73454c251a6395fdd4f9eb4301968f83422700000000000000000000000000000000522481eaa00464b45cf939087dba3998faac5c460163eeb69b900af0eb8acf4cfade1420f1a038545d4d396dde76c1a89f44ae72bd06e401f11b775d1b3f8f5209c3d442ea80')
  //   })
  // })
})

describe('TrustCommand tests', () => {
  describe('TrustCommand enums', () => {
    test('.requestAccounts should equal to sdk_get_accounts', () => {
      expect(TrustCommand.requestAccounts).toBe('sdk_get_accounts')
    })

    test('.signTransaction should equal to sdk_sign', () => {
      expect(TrustCommand.signTransaction).toBe('sdk_sign')
    })
  })

  describe('Test TrustCommand.getURL()', () => {
    test('get url for .requestAccounts', () => {
      var request = new AccountsRequest([CoinType.ethereum, CoinType.binance], 'request_test', TestCallbackScheme)
      var url = TrustCommand.getURL(request)
      expect(url).toBe(
        'trust://sdk_get_accounts?coins.0=60&coins.1=714&app=trust-rn-example&callback=sdk_get_accounts&id=request_test'
      )
    })

    test('get url for .signTransaction', () => {
      var request = new TransactionRequest(CoinType.ethereum, "0xdeadbef", 'tx', true, null, TestCallbackScheme)
      var url = TrustCommand.getURL(request)
      expect(url).toBe(
        'trust://sdk_sign?coin=60&data=0xdeadbef&send=true&app=trust-rn-example&callback=sdk_sign&id=tx'
      )
    })
  })

  describe('Test TrustCommand.parseResult()', () => {
    test('parse result for .requestAccounts', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sdk_sign_result?accounts=0xFC6CD054fAc48Df3744B42ea82E1Dd0fa7027086,bnb16cddarwr2gnf825fx5gyf676rakc4mwcnxzs7c&id=acc_1527509558565')
      expect(result.id).toBe('acc_1527509558565')
      expect(result.result).toBe(
        '0xFC6CD054fAc48Df3744B42ea82E1Dd0fa7027086,bnb16cddarwr2gnf825fx5gyf676rakc4mwcnxzs7c'
      )
      expect(result.error).toEqual(TrustError.none)
    })

    test('parse result for .signTransaction', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sdk_sign_result?coin=60&data=Cm34a4IB3YR94pAAglIIlHKLAjdyMLXfc6pOMZLom2CQ3XMShlrzEHpAAIAmoB0Yegc2ZqxtkSkXlYo_TEg4eBrjopGUj9ySxJh6JlfToGqR7yNKzV8cD_yN_jVR5YrVaTANO05X2_9HleO8htQqEgEmGiAdGHoHNmasbZEpF5WKP0xIOHga46KRlI_cksSYeiZX0yIgapHvI0rNXxwP_I3-NVHlitVpMA07Tlfb_0eV47yG1Co&id=sign_1527509748703')
      expect(result.id).toBe('sign_1527509748703')
      expect(result.result).toBe(
        'Cm34a4IB3YR94pAAglIIlHKLAjdyMLXfc6pOMZLom2CQ3XMShlrzEHpAAIAmoB0Yegc2ZqxtkSkXlYo_TEg4eBrjopGUj9ySxJh6JlfToGqR7yNKzV8cD_yN_jVR5YrVaTANO05X2_9HleO8htQqEgEmGiAdGHoHNmasbZEpF5WKP0xIOHga46KRlI_cksSYeiZX0yIgapHvI0rNXxwP_I3-NVHlitVpMA07Tlfb_0eV47yG1Co'
      )
    })

    test('parse cancel error', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sdk_sign_result?id=acc_1528786624065&error=rejected_by_user')
      expect(result.result).toBe('')
      expect(result.error).toBe(TrustError.rejectedByUser)
    })

    test('parse unknown error', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sdk_sign_result?id=acc_1528786624065&error=unknown')
      expect(result.error).toBe(TrustError.unknown)
    })
  })
})

describe('Request tests', () => {
  var timestamp = 1527496572770
  describe('Test AccountsRequest.toQuery()', () => {
    var message_id = 'acc_' + timestamp
    test('coins is empty ', () => {
      let request = new AccountsRequest([])
      request.id = message_id
      let query = TrustCommand.processQuery(request.toQuery())
      expect(query).toBe('')
    })
    test('coins: [ethereum, bitcoin]', () => {
      let request = new AccountsRequest([CoinType.ethereum, CoinType.bitcoin], message_id)
      let query = TrustCommand.processQuery(request.toQuery())
      expect(query).toBe(
        'coins.0=60&coins.1=0&id=acc_1527496572770'
      )
    })
    test('coins + callback scheme', () => {
      let request = new AccountsRequest([CoinType.binance], message_id, TestCallbackScheme)
      let query = TrustCommand.processQuery(request.toQuery())
      expect(query).toBe(
        'coins.0=714&app=trust-rn-example&callback=sdk_get_accounts&id=acc_1527496572770'
      )
    })
  })

  describe('Test TransactionRequest.toQuery()', () => {
    var sign_id = 'sign_' + timestamp
    var data = 'ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAAd0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRmNzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA'
    var meta = new DAppMetadata("Test", "https://dapptest.com")
    test('coin + data + callback scheme', () => {
        var request = new TransactionRequest(CoinType.ethereum, data, sign_id, false, meta, TestCallbackScheme, "sdk_sign_result")
        let query = TrustCommand.processQuery(request.toQuery())
        expect(query).toBe(
          'coin=60&data=ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAAd0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRmNzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA&meta.__name=dApp&meta.name=Test&meta.url=https://dapptest.com&send=false&app=trust-rn-example&callback=sdk_sign_result&id=sign_1527496572770'
        )
      }
    )
  })
})
