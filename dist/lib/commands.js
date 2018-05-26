"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
global.Buffer = buffer_1.Buffer;
const whatwg_url_1 = require("whatwg-url");
var TrustCommand;
(function (TrustCommand) {
    TrustCommand["signMessage"] = "sign-message";
    TrustCommand["signTransaction"] = "sign-transaction";
})(TrustCommand = exports.TrustCommand || (exports.TrustCommand = {}));
(function (TrustCommand) {
    function parseURL(urlString) {
        const url = new whatwg_url_1.URL(urlString);
        const result = url.searchParams.get('result') || '';
        const id = url.searchParams.get('id') || '';
        return {
            'id': id,
            'result': buffer_1.Buffer.from(result, 'base64').toString('hex')
        };
    }
    TrustCommand.parseURL = parseURL;
    function getURL(command, data, scheme = 'trust://') {
        switch (command) {
            case TrustCommand.signMessage:
                let msgUrl = new whatwg_url_1.URL(scheme + TrustCommand.signMessage + '?' + data.toQuery());
                return msgUrl.toString();
            case TrustCommand.signTransaction:
                let txUrl = new whatwg_url_1.URL(scheme + TrustCommand.signTransaction + '?' + data.toQuery());
                return txUrl.toString();
        }
    }
    TrustCommand.getURL = getURL;
})(TrustCommand = exports.TrustCommand || (exports.TrustCommand = {}));
class MessagePayload {
    constructor(message, callbackScheme) {
        this.id = 'msg';
        this.address = '';
        this.message = buffer_1.Buffer.from(message).toString('base64');
        this.callbackScheme = callbackScheme;
    }
    toQuery() {
        var searchParams = new whatwg_url_1.URLSearchParams({});
        searchParams.append('message', this.message);
        if (this.address.length > 0) {
            searchParams.append('address', this.address);
        }
        const callbackUrl = this.callbackScheme + TrustCommand.signMessage + '?id=' + this.id;
        searchParams.append('callback', callbackUrl);
        return searchParams.toString();
    }
}
exports.MessagePayload = MessagePayload;
class TransactionPayload {
    constructor(to, amount, callbackScheme, gasPrice, gasLimit, nonce) {
        this.id = 'tx';
        this.to = to;
        this.amount = amount;
        this.callbackScheme = callbackScheme;
        this.gasPrice = gasPrice || '21';
        this.gasLimit = gasLimit || '21000';
        this.nonce = nonce || '0';
    }
    toQuery() {
        var searchParams = new whatwg_url_1.URLSearchParams({});
        searchParams.append('gasPrice', this.gasPrice);
        searchParams.append('gasLimit', this.gasPrice);
        searchParams.append('to', this.to);
        searchParams.append('amount', this.amount);
        searchParams.append('nonce', this.nonce);
        searchParams.append('callback', this.callbackScheme);
        return searchParams.toString();
    }
}
exports.TransactionPayload = TransactionPayload;
