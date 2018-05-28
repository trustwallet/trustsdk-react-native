'use strict';
var expect = require('chai').expect;
var {TrustCommand, MessagePayload, TransactionPayload} = require('../dist/index');

var TestCallbackScheme = 'trust-rn-example://';
var ToAddress = '0xE47494379c1d48ee73454C251A6395FDd4F9eb43';

describe('TrustCommand tests', () => {
  describe('TrustCommand enums', () => {
    it('.signMessage should equal to sign-message', () => {
      expect(TrustCommand.signMessage).to.equal('sign-message');
    });

    it('.signTransaction should equal to sign-transaction', () => {
      expect(TrustCommand.signTransaction).to.equal('sign-transaction');
    });
  });

  describe('Test TrustCommand.getURL()', () => {
    it('get url for .signMessage', () => {
      var payload = new MessagePayload('hey trust', '', TestCallbackScheme);
      payload.id = 'msg';
      var url = TrustCommand.getURL(TrustCommand.signMessage, payload);
      expect(url).to.equal('trust://sign-message?message=aGV5IHRydXN0&callback=trust-rn-example%3A%2F%2Fsign-message%3Fid%3Dmsg');
    });

    it('get url for .signTransaction', () => {
      var payload = new TransactionPayload(ToAddress, '1', '8f834227000000000000000000000000000000005224');
      payload.id = 'tx';
      payload.callbackScheme = TestCallbackScheme;
      var url = TrustCommand.getURL(TrustCommand.signTransaction, payload);
      expect(url).to.equal('trust://sign-transaction?to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1&gasPrice=21&gasLimit=21000&data=8f834227000000000000000000000000000000005224&nonce=0&callback=trust-rn-example%3A%2F%2Fsign-transaction%3Fid%3Dtx');
    });
  });

  describe('Test TrustCommand.parseResult()', () => {
    it('parse result for .signMessage', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-message?id=msg_1527509558565&result=XkKQfY3KAYXgQdBhEUaegGhQagNYxIT8XCcr3CJnzNJPNYKlh0LP9vemwXTV+qD3ZFExEzjptmpAajp4q8f9Yxs%3D');
      expect(result.id).to.equal('msg_1527509558565');
      expect(result.result).to.equal('5e42907d8dca0185e041d06111469e8068506a0358c484fc5c272bdc2267ccd24f3582a58742cff6f7a6c174d5faa0f76451311338e9b66a406a3a78abc7fd631b');
    });

    it('parse result for .signTransaction', () => {
      var result = TrustCommand.parseURL('trust-rn-example://sign-transaction?id=tx_1527509748703&result=+HqAhDuaygCCUgiU5HSUN5wdSO5zRUwlGmOV/dT560MBlo+DQicAAAAAAAAAAAAAAAAAAAAAUiSB6qAEZLRc+TkIfbo5mPqsXEYBY+62m5AK8OuKz0z63hQg8aA4VF1NOW3edsGon0Sucr0G5AHxG3ddGz+PUgnD1ELqgA%3D%3D');
      expect(result.id).to.equal('tx_1527509748703');
      expect(result.result).to.equal('f87a80843b9aca0082520894e47494379c1d48ee73454c251a6395fdd4f9eb4301968f83422700000000000000000000000000000000522481eaa00464b45cf939087dba3998faac5c460163eeb69b900af0eb8acf4cfade1420f1a038545d4d396dde76c1a89f44ae72bd06e401f11b775d1b3f8f5209c3d442ea80');
    });
  });
});

describe('Payload tests', () => {

  var timestamp = 1527496572770;
  describe('Test MessagePayload.toQuery()', () => {
    var message_id = 'msg_' + timestamp;
    it('message is empty ', () => {
      var msgPayload = new MessagePayload('', undefined, undefined);
      expect(msgPayload.toQuery()).to.equal('message=');
    });
    it('message is hello trust ', () => {
      var msgPayload = new MessagePayload('hello trust', undefined, undefined);
      expect(msgPayload.toQuery()).to.equal('message=aGVsbG8gdHJ1c3Q%3D');
    });
    it('message + address', () => {
      var msgPayload = new MessagePayload('hello trust', ToAddress, undefined);
      msgPayload.id = message_id;
      expect(msgPayload.toQuery()).to.equal('message=aGVsbG8gdHJ1c3Q%3D&address=0xE47494379c1d48ee73454C251A6395FDd4F9eb43');
    });
    it('message + callback scheme', () => {
      var msgPayload = new MessagePayload('hello trust', undefined, TestCallbackScheme);
      msgPayload.id = message_id;
      expect(msgPayload.toQuery()).to.equal('message=aGVsbG8gdHJ1c3Q%3D&callback=trust-rn-example%3A%2F%2Fsign-message%3Fid%3Dmsg_1527496572770');
    });
    it('message + address + callback scheme', () => {
      var msgPayload = new MessagePayload('hello trust', ToAddress, TestCallbackScheme);
      msgPayload.id = 'msg_' + timestamp;
      expect(msgPayload.toQuery()).to.equal('message=aGVsbG8gdHJ1c3Q%3D&address=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&callback=trust-rn-example%3A%2F%2Fsign-message%3Fid%3Dmsg_1527496572770');
    });
  });

  describe('Test TransactionPayload.toQuery()', () => {
    var tx_id = 'tx_' + timestamp;
    var amount = '1000000000000000000';
    var data = '0x8f834227000000000000000000000000000000005224';
    it('address + amount (default gas price / limit)', () => {
      var txPayload = new TransactionPayload(ToAddress, amount, undefined, undefined, undefined, undefined, undefined);
      expect(txPayload.toQuery()).to.equal('to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1000000000000000000&gasPrice=21&gasLimit=21000&nonce=0');
    });

    it('address + amount + data + nonce (default gas price / limit)', () => {
      var txPayload = new TransactionPayload(ToAddress, amount, data, undefined, undefined, 1, undefined);
      expect(txPayload.toQuery()).to.equal('to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1000000000000000000&gasPrice=21&gasLimit=21000&data=0x8f834227000000000000000000000000000000005224&nonce=1');
    });

    it('address + amount + callback scheme (default gas price / limit)', () => {
      var txPayload = new TransactionPayload(ToAddress, amount, undefined, undefined, undefined, undefined, TestCallbackScheme);
      txPayload.id = tx_id;
      expect(txPayload.toQuery()).to.equal('to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1000000000000000000&gasPrice=21&gasLimit=21000&nonce=0&callback=trust-rn-example%3A%2F%2Fsign-transaction%3Fid%3Dtx_1527496572770');
    });

    it('address + amount + gasPrice + gasLimit', () => {
      var txPayload = new TransactionPayload(ToAddress, amount, undefined, '60', '45000', undefined, undefined);
      expect(txPayload.toQuery()).to.equal('to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1000000000000000000&gasPrice=60&gasLimit=45000&nonce=0');
    });

    it('address + amount + data + gasPrice + gasLimit + callback scheme )', () => {
      var txPayload = new TransactionPayload(ToAddress, '1', data, '45', '50000', undefined, TestCallbackScheme);
      txPayload.id = tx_id;
      expect(txPayload.toQuery()).to.equal('to=0xE47494379c1d48ee73454C251A6395FDd4F9eb43&amount=1&gasPrice=45&gasLimit=50000&data=0x8f834227000000000000000000000000000000005224&nonce=0&callback=trust-rn-example%3A%2F%2Fsign-transaction%3Fid%3Dtx_1527496572770');
    });
  });
});
