'use strict';
var expect = require('chai').expect;
var sdk = require('../dist/index.js');

describe('signMessage test', () => {
    it('should return empty string', (done) => {
      sdk.signMessage('').then((value) => {
        expect(value).to.equal('');
        done();
      })
    });
});