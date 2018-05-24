"use strict";
exports.__esModule = true;
var react_native_1 = require("react-native");
var TrustWalletCommand;
(function (TrustWalletCommand) {
    TrustWalletCommand["signMessage"] = "sign-message";
    TrustWalletCommand["signTx"] = "sign-transaction";
})(TrustWalletCommand || (TrustWalletCommand = {}));
var TrustWallet = /** @class */ (function () {
    function TrustWallet(cbScheme) {
        this.cbScheme = '';
        this.apps = [{
                name: 'Trust',
                scheme: 'trust',
                installURL: 'https://itunes.apple.com/ru/app/trust-ethereum-wallet/id1288339409'
            }];
        this.cbScheme = cbScheme;
    }
    TrustWallet.prototype.installed = function () {
        var installed = this.apps.filter(function (app) { return react_native_1.Linking.canOpenURL(app.scheme + '://'); });
        return installed.length > 0;
    };
    return TrustWallet;
}());
function signTransaction(transaction) {
    var promise = new Promise(function (resolve, reject) {
        resolve("");
    });
    return promise;
}
exports.signTransaction = signTransaction;
function signMessage(message) {
    var promise = new Promise(function (resolve, reject) {
        resolve("");
    });
    return promise;
}
exports.signMessage = signMessage;
